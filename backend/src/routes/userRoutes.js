import { Router } from "express";
import { db } from "../config/db.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { wrap, ok } from "../utils/errors.js";
import * as s from "../schemas/index.js";
import { updateProfile } from "../services/userService.js";
export const userRouter = Router();
userRouter.use(authenticate);
userRouter.patch(
  "/me",
  validate(s.profile),
  wrap(async (req, res) =>
    ok(res, await updateProfile(req.user, req.validated.body)),
  ),
);
userRouter.get(
  "/me/preferences",
  wrap(async (req, res) =>
    ok(
      res,
      await db.userPreference.upsert({
        where: { userId: req.user.id },
        create: { userId: req.user.id },
        update: {},
      }),
    ),
  ),
);
userRouter.patch(
  "/me/preferences",
  validate(s.preferences),
  wrap(async (req, res) =>
    ok(
      res,
      await db.userPreference.upsert({
        where: { userId: req.user.id },
        create: { userId: req.user.id, ...req.validated.body },
        update: req.validated.body,
      }),
    ),
  ),
);
