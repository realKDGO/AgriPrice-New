import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createHash, randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { db } from "../config/db.js";
import { AppError } from "../utils/errors.js";
import { audit } from "./auditService.js";
import { requireValidMailDomain } from "./emailDomainService.js";
export const publicUser = (u) => ({
  id: u.id,
  firstName: u.firstName,
  lastName: u.lastName,
  name: `${u.firstName} ${u.lastName}`,
  email: u.email,
  role: u.role,
  status: u.status,
  lastLoginAt: u.lastLoginAt,
  createdAt: u.createdAt,
});
const hash = (s) => createHash("sha256").update(s).digest("hex");
export const duration = (s) =>
  parseInt(s) * { m: 60000, h: 3600000, d: 86400000 }[s.at(-1)];
export async function checkPassword(user, password) {
  if (!password || !(await bcrypt.compare(password, user.passwordHash)))
    throw new AppError(401, "Current password is incorrect.");
}
async function issue(tx, user, familyId = randomUUID(), persistent = false) {
  const sid = randomUUID();
  const refreshToken = jwt.sign(
    { sub: user.id, sid, familyId },
    env.JWT_REFRESH_SECRET,
    {
      algorithm: "HS256",
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      issuer: "agriprice",
      audience: "agriprice-refresh",
    },
  );
  await tx.refreshSession.create({
    data: {
      id: sid,
      userId: user.id,
      tokenHash: hash(refreshToken),
      familyId,
      expiresAt: new Date(Date.now() + duration(env.JWT_REFRESH_EXPIRES_IN)),
      persistent,
    },
  });
  const accessToken = jwt.sign({ sub: user.id, sid }, env.JWT_ACCESS_SECRET, {
    algorithm: "HS256",
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    issuer: "agriprice",
    audience: "agriprice-api",
  });
  return { user: publicUser(user), accessToken, refreshToken, persistent };
}
export async function register(input, ip) {
  const { confirmPassword, acceptTerms, password, ...fields } = input;
  if (await db.user.findUnique({ where: { email: fields.email } }))
    throw new AppError(409, "An account with this email address already exists.", [
      {
        field: "email",
        message: "An account with this email address already exists.",
      },
    ]);
  await requireValidMailDomain(fields.email);
  const passwordHash = await bcrypt.hash(password, 12);
  return db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        ...fields,
        passwordHash,
        role: "FARMER",
        preference: { create: {} },
      },
    });
    await audit(
      tx,
      user,
      "REGISTER",
      "User",
      user.id,
      undefined,
      "SUCCESS",
      ip,
    );
    return issue(tx, user);
  });
}
const dummyHash = await bcrypt.hash(randomUUID(), 12);
export async function login({ email, password, rememberMe = false }, ip) {
  const user = await db.user.findUnique({ where: { email } });
  const valid = await bcrypt.compare(password, user?.passwordHash || dummyHash);
  if (!valid || !user || user.status !== "ACTIVE") {
    await audit(
      db,
      null,
      "LOGIN_FAILURE",
      "Authentication",
      undefined,
      undefined,
      "FAILED",
      ip,
    );
    throw new AppError(401, "Unable to sign in with these credentials.");
  }
  return db.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    await audit(
      tx,
      user,
      "LOGIN_SUCCESS",
      "User",
      user.id,
      undefined,
      "SUCCESS",
      ip,
    );
    return issue(tx, updated, randomUUID(), rememberMe);
  });
}
export async function refresh(token) {
  let claims;
  try {
    claims = jwt.verify(token, env.JWT_REFRESH_SECRET, {
      algorithms: ["HS256"],
      issuer: "agriprice",
      audience: "agriprice-refresh",
    });
  } catch {
    throw new AppError(401, "Please sign in again.");
  }
  const session = await db.refreshSession.findUnique({
    where: { id: claims.sid },
    include: { user: true },
  });
  if (
    !session ||
    session.tokenHash !== hash(token) ||
    session.userId !== claims.sub
  )
    throw new AppError(401, "Please sign in again.");
  if (session.revokedAt) {
    await db.refreshSession.updateMany({
      where: { familyId: session.familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    throw new AppError(401, "Please sign in again.");
  }
  const setting = await db.systemSetting.findUnique({
    where: { key: "sessionTimeout" },
  });
  if (
    Date.now() - session.lastUsedAt.getTime() >
    Number(setting?.value || 30) * 60000
  )
    throw new AppError(401, "Your session timed out. Please sign in again.");
  if (session.expiresAt < new Date() || session.user.status !== "ACTIVE")
    throw new AppError(401, "Please sign in again.");
  return db.$transaction(async (tx) => {
    const count = await tx.refreshSession.updateMany({
      where: { id: session.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (count.count !== 1) throw new AppError(401, "Please sign in again.");
    return issue(tx, session.user, session.familyId, session.persistent);
  });
}
export async function logout(token) {
  if (!token) return;
  const session = await db.refreshSession.findUnique({
    where: { tokenHash: hash(token) },
  });
  if (session)
    await db.$transaction(async (tx) => {
      await tx.refreshSession.updateMany({
        where: { familyId: session.familyId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      await audit(tx, { id: session.userId }, "LOGOUT", "User", session.userId);
    });
}
export async function changePassword(user, input) {
  await checkPassword(user, input.currentPassword);
  const passwordHash = await bcrypt.hash(input.newPassword, 12);
  await db.$transaction(async (tx) => {
    await tx.user.update({ where: { id: user.id }, data: { passwordHash } });
    await tx.refreshSession.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await audit(tx, user, "PASSWORD_CHANGE", "User", user.id);
  });
}
