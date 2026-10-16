import { get, patch, post } from "./api";

export const userService = {
  profile: (body) => patch("/users/me", body),
  preferences: () => get("/users/me/preferences"),
  savePreferences: (body) => patch("/users/me/preferences", body),
  list: (mao = false, params) => get(mao ? "/admin/mao-accounts" : "/admin/users", params),
  save: (mao = false, id, body) =>
    id
      ? patch(mao ? `/admin/mao-accounts/${id}` : `/admin/users/${id}`, body)
      : post("/admin/mao-accounts", body),
  reviewMaoRequest: (id, body) =>
    patch(`/admin/mao-accounts/${id}/review`, body),
};
