import * as service from "../services/authService.js";
import { env } from "../config/env.js";
import { ok } from "../utils/errors.js";
const cookie = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.COOKIE_SAME_SITE,
  path: "/api/v1/auth",
};
function send(res, result, status = 200) {
  const { refreshToken, persistent, ...data } = result;
  res.cookie("agriprice_refresh", refreshToken, {
    ...cookie,
    ...(persistent
      ? { maxAge: service.duration(env.JWT_REFRESH_EXPIRES_IN) }
      : {}),
  });
  return ok(res, data, status);
}
export const register = async (req, res) =>
  send(res, await service.register(req.validated.body, req.ip), 201);
export const login = async (req, res) =>
  send(res, await service.login(req.validated.body, req.ip));
export const refresh = async (req, res) =>
  send(res, await service.refresh(req.cookies.agriprice_refresh));
export const logout = async (req, res) => {
  await service.logout(req.cookies.agriprice_refresh);
  res.clearCookie("agriprice_refresh", cookie);
  ok(res, { loggedOut: true });
};
export const me = (req, res) => ok(res, service.publicUser(req.user));
export const changePassword = async (req, res) => {
  await service.changePassword(req.user, req.validated.body);
  res.clearCookie("agriprice_refresh", cookie);
  ok(res, { message: "Password changed. Please sign in again." });
};
