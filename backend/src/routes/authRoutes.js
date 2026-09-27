import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as c from "../controllers/authController.js";
import * as s from "../schemas/index.js";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import { wrap, ok } from "../utils/errors.js";
export const authRouter = Router();
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
  },
});
for (const action of ["register", "login"])
  authRouter.post(
    "/" + action,
    authLimiter,
    validate(s[action]),
    wrap(c[action]),
  );
authRouter.post("/refresh", wrap(c.refresh));
authRouter.post("/logout", wrap(c.logout));
authRouter.get("/me", authenticate, c.me);
authRouter.post(
  "/change-password",
  authLimiter,
  authenticate,
  validate(s.changePassword),
  wrap(c.changePassword),
);
authRouter.post(
  "/forgot-password",
  authLimiter,
  validate(s.login.pick({ email: true })),
  (req, res) =>
    ok(res, {
      message:
        "Password recovery is handled by your AgriPrice administrator. Email reset delivery is not currently available.",
    }),
);
