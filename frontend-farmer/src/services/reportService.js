import { get } from "./api";
export const reportService = {
  agriculture: (params) => get("/reports", params),
  dashboard: (role) => get(`/${role.toLowerCase()}/dashboard`),
};
