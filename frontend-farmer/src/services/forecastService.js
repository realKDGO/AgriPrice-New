import { get, post } from "./api";
export const forecastService = {
  get: (params) => get("/forecasts", params),
  generate: (body) => post("/forecasts/generate", body),
};
