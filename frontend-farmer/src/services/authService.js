import { get, post, setAccessToken, refreshSession } from "./api";
export const authService = {
  me: () => get("/auth/me"),
  restore: refreshSession,
  async bypass(role = "FARMER") {
    const r = await post("/auth/bypass", { role });
    setAccessToken(r.accessToken);
    return r.user;
  },
  async login(email, password, rememberMe = false) {
    const r = await post("/auth/login", { email, password, rememberMe });
    setAccessToken(r.accessToken);
    return r.user;
  },
  async register(body) {
    const r = await post("/auth/register", body);
    if (r.accessToken) setAccessToken(r.accessToken);
    return r.user;
  },
  async logout() {
    await post("/auth/logout", {});
    setAccessToken(null);
  },
  changePassword: (body) => post("/auth/change-password", body),
  forgot: (email) => post("/auth/forgot-password", { email }),
};
