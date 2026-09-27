import { get, post, patch } from "./api";
export const marketService = {
  list: (params) => get("/markets", params),
  save: (id, body) =>
    id ? patch(`/markets/${id}`, body) : post("/markets", body),
  status: (id, status) => patch(`/markets/${id}/status`, { status }),
  compare: (body) => post("/recommendations", body),
  profit: (body) => post("/profit", body),
};
