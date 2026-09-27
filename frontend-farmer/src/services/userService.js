import { get, patch } from "./api";

export const userService = {
  profile: (body) => patch("/users/me", body),
  preferences: () => get("/users/me/preferences"),
  savePreferences: (body) => patch("/users/me/preferences", body),
};
