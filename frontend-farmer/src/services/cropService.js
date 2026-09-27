import { get, post, patch } from "./api";
export const cropService = {
  list: (params) => get("/crops", params),
  get: (id) => get(`/crops/${id}`),
  save: (id, fields, photo) => {
    const body = new FormData();
    Object.entries(fields).forEach(([k, v]) => body.append(k, v));
    if (photo) body.append("photo", photo);
    return id ? patch(`/crops/${id}`, body) : post("/crops", body);
  },
  status: (id, status) => patch(`/crops/${id}/status`, { status }),
};
