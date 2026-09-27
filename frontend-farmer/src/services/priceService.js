import { get, post, patch } from "./api";
export const priceService = {
  current: (params) => get("/prices/current", params),
  history: (params) => get("/prices/history", params),
  list: (params) => get("/prices", params),
  save: (id, body) =>
    id ? patch(`/prices/${id}`, body) : post("/prices", body),
  review: (id, approved, reviewNote) =>
    post(`/prices/${id}/${approved ? "approve" : "reject"}`, { reviewNote }),
};
