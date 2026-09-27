import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { wrap, ok } from "../utils/errors.js";
import * as s from "../schemas/index.js";
import * as service from "../services/priceService.js";
export const priceRouter = Router();
priceRouter.use(authenticate, authorize("FARMER", "MAO"));
priceRouter.get(
  "/current",
  validate(s.page, "query"),
  wrap(async (req, res) => {
    const q = req.validated.query;
    const rows = await service.currentPrices(q.cropId, q.marketId);
    const filtered = rows.filter(
      (r) =>
        (!q.search ||
          `${r.crop.name} ${r.market.name}`
            .toLowerCase()
            .includes(q.search.toLowerCase())) &&
        (!q.trend ||
          (r.previousPrice !== null &&
            (q.trend === "up"
              ? Number(r.price) > Number(r.previousPrice)
              : q.trend === "down"
                ? Number(r.price) < Number(r.previousPrice)
                : Number(r.price) === Number(r.previousPrice)))),
    );
    ok(res, {
      items: filtered.slice((q.page - 1) * q.limit, q.page * q.limit),
      total: filtered.length,
      page: q.page,
      limit: q.limit,
      pages: Math.ceil(filtered.length / q.limit),
    });
  }),
);
priceRouter.get(
  "/history",
  validate(s.page, "query"),
  wrap(async (req, res) =>
    ok(res, await service.listPrices(req.validated.query, req.user.role, true)),
  ),
);
priceRouter.get(
  "/pending",
  authorize("MAO"),
  validate(s.page, "query"),
  wrap(async (req, res) =>
    ok(
      res,
      await service.listPrices(
        { ...req.validated.query, status: "PENDING" },
        "MAO",
      ),
    ),
  ),
);
priceRouter.get(
  "/",
  authorize("MAO"),
  validate(s.page, "query"),
  wrap(async (req, res) =>
    ok(res, await service.listPrices(req.validated.query, "MAO")),
  ),
);
priceRouter.post(
  "/",
  authorize("MAO"),
  validate(s.price),
  wrap(async (req, res) =>
    ok(res, await service.submitPrice(req.user, null, req.validated.body), 201),
  ),
);
priceRouter.patch(
  "/:id",
  authorize("MAO"),
  validate(s.price),
  wrap(async (req, res) =>
    ok(
      res,
      await service.submitPrice(
        req.user,
        s.id.parse(req.params.id),
        req.validated.body,
      ),
    ),
  ),
);
for (const action of ["approve", "reject"])
  priceRouter.post(
    "/:id/" + action,
    authorize("MAO"),
    validate(s[action]),
    wrap(async (req, res) =>
      ok(
        res,
        await service.reviewPrice(
          req.user,
          s.id.parse(req.params.id),
          action === "approve",
          req.validated.body.reviewNote,
        ),
      ),
    ),
  );
