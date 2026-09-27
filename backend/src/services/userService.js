import bcrypt from "bcrypt";
import { db } from "../config/db.js";
import { audit } from "./auditService.js";
import { checkPassword, publicUser } from "./authService.js";
import { AppError, requireRecord } from "../utils/errors.js";
export async function createMao(actor, input) {
  await checkPassword(actor, input.currentPassword);
  const { password, currentPassword, ...fields } = input;
  const passwordHash = await bcrypt.hash(password, 12);
  return db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        ...fields,
        passwordHash,
        role: "MAO",
        preference: { create: {} },
      },
    });
    await audit(tx, actor, "MAO_CREATE", "User", user.id);
    return publicUser(user);
  });
}
export async function updateAccount(actor, id, input, role) {
  const original = requireRecord(await db.user.findUnique({ where: { id } }));
  if (original.role !== role)
    throw new AppError(403, "Use the account management area for this role.");
  if (original.role !== "FARMER")
    await checkPassword(actor, input.currentPassword);
  if (id === actor.id && input.status !== "ACTIVE")
    throw new AppError(422, "You cannot suspend your own account.");
  const { currentPassword, ...fields } = input;
  return db.$transaction(async (tx) => {
    const user = await tx.user.update({ where: { id }, data: fields });
    if (user.status !== "ACTIVE")
      await tx.refreshSession.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    await audit(tx, actor, "ACCOUNT_UPDATE", "User", id, {
      previousStatus: original.status,
      status: user.status,
    });
    await tx.notification.create({
      data: {
        userId: id,
        type: "SECURITY",
        title: "Account updated",
        message: "An administrator updated your account details or access.",
      },
    });
    return publicUser(user);
  });
}
export async function updateProfile(user, input) {
  await checkPassword(user, input.currentPassword);
  const { currentPassword, ...fields } = input;
  return db.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: user.id },
      data: fields,
    });
    await audit(tx, user, "PROFILE_UPDATE", "User", user.id);
    return publicUser(updated);
  });
}
