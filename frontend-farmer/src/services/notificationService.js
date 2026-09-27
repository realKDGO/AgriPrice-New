import { get, patch } from "./api";
export const notificationService = {
  list: (params) => get("/notifications", params),
  count: () => get("/notifications/unread-count"),
  read: (id) => patch(`/notifications/${id}/read`, {}),
  readAll: () => patch("/notifications/read-all", {}),
};
