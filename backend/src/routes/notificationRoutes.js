import { Router } from "express";
import { db } from "../config/db.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { wrap, ok, AppError } from "../utils/errors.js";
import * as s from "../schemas/index.js";
import { paginated } from "../services/catalogService.js";
export const notificationRouter = Router();
notificationRouter.use(authenticate);
notificationRouter.get(
  "/",
  validate(s.page, "query"),
  wrap(async (req, res) =>
    ok(
      res,
      await paginated(
        "notification",
        { userId: req.user.id },
        req.validated.query,
      ),
    ),
  ),
);
notificationRouter.get(
  "/unread-count",
  wrap(async (req, res) =>
    ok(res, {
      count: await db.notification.count({
        where: { userId: req.user.id, isRead: false },
      }),
    }),
  ),
);
notificationRouter.patch(
  "/read-all",
  wrap(async (req, res) =>
    ok(
      res,
      await db.notification.updateMany({
        where: { userId: req.user.id, isRead: false },
        data: { isRead: true },
      }),
    ),
  ),
);
notificationRouter.patch(
  "/:id/read",
  wrap(async (req, res) => {
    const result = await db.notification.updateMany({
      where: { id: s.id.parse(req.params.id), userId: req.user.id },
      data: { isRead: true },
    });
    if (!result.count) throw new AppError(404, "Notification not found.");
    ok(res, result);
  }),
);
