import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { wrap, ok } from "../utils/errors.js";
import * as s from "../schemas/index.js";
import * as r from "../services/reportService.js";
import * as f from "../services/forecastService.js";
export const decisionRouter = Router();
decisionRouter.use(authenticate, authorize("FARMER", "MAO"));
decisionRouter.post(
  "/recommendations",
  validate(s.recommendation),
  wrap(async (req, res) =>
    ok(res, await r.recommendations(req.validated.body)),
  ),
);
decisionRouter.post(
  "/profit",
  validate(s.profit),
  wrap(async (req, res) => ok(res, await r.profit(req.validated.body))),
);
decisionRouter.get(
  "/reports",
  validate(s.page, "query"),
  wrap(async (req, res) =>
    ok(res, await r.agriculturalReport(req.validated.query)),
  ),
);
decisionRouter.get(
  "/forecasts",
  validate(s.forecast, "query"),
  wrap(async (req, res) => ok(res, await f.getForecast(req.validated.query))),
);
decisionRouter.post(
  "/forecasts/generate",
  authorize("MAO"),
  validate(s.forecast),
  wrap(async (req, res) => {
    const { cropId, marketId } = req.validated.body;
    ok(res, await f.generateForecast(cropId, marketId, req.user));
  }),
);
decisionRouter.get(
  "/mao/dashboard",
  authorize("MAO"),
  wrap(async (req, res) => ok(res, await r.dashboard(req.user))),
);
