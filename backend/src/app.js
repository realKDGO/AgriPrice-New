import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { ZodError } from "zod";
import { env } from "./config/env.js";
import { db } from "./config/db.js";
import { allowedFrontendOrigin, trustedOrigin } from "./middleware/auth.js";
import { validate } from "./middleware/validate.js";
import { wrap, ok } from "./utils/errors.js";
import { contact } from "./schemas/index.js";
import { authRouter, authLimiter } from "./routes/authRoutes.js";
import { catalogRouter } from "./routes/catalogRoutes.js";
import { priceRouter } from "./routes/priceRoutes.js";
import { userRouter } from "./routes/userRoutes.js";
import { notificationRouter } from "./routes/notificationRoutes.js";
import { decisionRouter } from "./routes/decisionRoutes.js";
import { adminRouter } from "./routes/adminRoutes.js";
import { openapi } from "./config/openapi.js";
export const app = express();
app.disable("x-powered-by");
app.set("trust proxy", env.TRUST_PROXY);
app.use(
  helmet({
    crossOriginResourcePolicy: env.LOCAL_STORAGE_MODE
      ? { policy: "cross-origin" }
      : undefined,
  }),
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedFrontendOrigin(origin)) return callback(null, true);
      callback(new Error("This request origin is not allowed."));
    },
    credentials: true,
  }),
);
if (env.LOCAL_STORAGE_MODE)
  app.use(
    "/uploads",
    express.static(env.LOCAL_STORAGE_DIR, {
      dotfiles: "deny",
      fallthrough: false,
      immutable: false,
      index: false,
      maxAge: "1h",
    }),
  );
morgan.token("path", (req) => req.path);
app.use(
  morgan(":method :path :status :response-time ms", {
    skip: () => env.NODE_ENV === "test",
  }),
);
app.use(express.json({ limit: "10mb" }), cookieParser(), trustedOrigin);
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
  }),
);
app.get(
  "/api/health",
  wrap(async (req, res) => {
    try {
      await db.$queryRaw`SELECT 1`;
      ok(res, { api: "available", database: "available" });
    } catch {
      res
        .status(503)
        .json({ success: false, message: "Database is unavailable." });
    }
  }),
);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapi));
app.get("/api/openapi.json", (req, res) => res.json(openapi));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/crops", catalogRouter("crop"));
app.use("/api/v1/markets", catalogRouter("market"));
app.use("/api/v1/prices", priceRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/admin", adminRouter);
app.post(
  "/api/v1/contact",
  authLimiter,
  validate(contact),
  wrap(async (req, res) => {
    const r = await db.contactMessage.create({ data: req.validated.body });
    ok(res, { id: r.id, message: "Your message has been received." }, 201);
  }),
);
app.use("/api/v1", decisionRouter);
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Endpoint not found." }),
);
app.use((error, req, res, next) => {
  let status = error.status || 500;
  let message = error.message;
  let errors = error.errors || [];
  if (error instanceof ZodError) {
    status = 422;
    message = "Check the information and try again.";
    errors = error.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
    }));
  }
  if (error.code === "P2002") {
    status = 409;
    message = "A record with these details already exists.";
  }
  if (error.code === "P2025") {
    status = 404;
    message = "Record not found.";
  }
  if (error.code === "P2034") {
    status = 409;
    message = "This record changed during your request. Refresh and try again.";
  }
  if (error.code === "LIMIT_FILE_SIZE") {
    status = 422;
    message = "Crop photos must be 5 MB or smaller.";
  }
  if (error.code === "LIMIT_UNEXPECTED_FILE") {
    status = 422;
    message = "Upload one crop photo using the photo field.";
  }
  if (status >= 500) {
    message = "Unable to complete this request. Please try again.";
    console.error("Request failed", { name: error.name, code: error.code });
  }
  res.status(status).json({ success: false, message, errors });
});
