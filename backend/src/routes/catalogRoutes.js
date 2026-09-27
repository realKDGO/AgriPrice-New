import { Router } from "express";
import multer from "multer";
import { db } from "../config/db.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { wrap, ok, requireRecord, AppError } from "../utils/errors.js";
import * as schema from "../schemas/index.js";
import * as service from "../services/catalogService.js";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 5 },
}).single("photo");
export function catalogRouter(kind) {
  const router = Router();
  router.use(authenticate, authorize("FARMER", "MAO"));
  router.get(
    "/",
    validate(schema.page, "query"),
    wrap(async (req, res) =>
      ok(
        res,
        await service.listCatalog(kind, req.validated.query, req.user.role),
      ),
    ),
  );
  router.get(
    "/:id",
    wrap(async (req, res) => {
      const id = schema.id.parse(req.params.id);
      const r = requireRecord(await db[kind].findUnique({ where: { id } }));
      if (req.user.role === "FARMER" && r.status !== "ACTIVE")
        throw new AppError(404, "Record not found.");
      ok(res, r);
    }),
  );
  const middleware = kind === "crop" ? [upload] : [];
  router.post(
    "/",
    authorize("MAO"),
    ...middleware,
    validate(schema[kind]),
    wrap(async (req, res) =>
      ok(
        res,
        await (kind === "crop"
          ? service.saveCrop(req.user, null, req.validated.body, req.file)
          : service.saveMarket(req.user, null, req.validated.body)),
        201,
      ),
    ),
  );
  router.patch(
    "/:id",
    authorize("MAO"),
    ...middleware,
    validate(schema[kind]),
    wrap(async (req, res) =>
      ok(
        res,
        await (kind === "crop"
          ? service.saveCrop(
              req.user,
              schema.id.parse(req.params.id),
              req.validated.body,
              req.file,
            )
          : service.saveMarket(
              req.user,
              schema.id.parse(req.params.id),
              req.validated.body,
            )),
      ),
    ),
  );
  router.patch(
    "/:id/status",
    authorize("MAO"),
    validate(schema.recordStatus),
    wrap(async (req, res) =>
      ok(
        res,
        await service.setStatus(
          kind,
          req.user,
          schema.id.parse(req.params.id),
          req.validated.body.status,
        ),
      ),
    ),
  );
  return router;
}
