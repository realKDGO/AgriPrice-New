import { Router } from "express";
import { db } from "../config/db.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { wrap, ok, AppError } from "../utils/errors.js";
import * as s from "../schemas/index.js";
import { paginated } from "../services/catalogService.js";
import { publicUser, checkPassword } from "../services/authService.js";
import { createMao, updateAccount } from "../services/userService.js";
import * as a from "../services/adminService.js";
import { audit } from "../services/auditService.js";
import { dashboard } from "../services/reportService.js";
export const adminRouter = Router();
adminRouter.use(authenticate, authorize("ADMIN"));
adminRouter.get(
  "/dashboard",
  wrap(async (req, res) => ok(res, await dashboard(req.user))),
);
for (const [path, role] of [
  ["users", "FARMER"],
  ["mao-accounts", "MAO"],
]) {
  adminRouter.get(
    "/" + path,
    validate(s.page, "query"),
    wrap(async (req, res) => {
      const q = req.validated.query;
      const where = {
        role,
        ...(q.status ? { status: q.status } : {}),
        ...(q.search
          ? {
              OR: [
                { email: { contains: q.search, mode: "insensitive" } },
                { firstName: { contains: q.search, mode: "insensitive" } },
                { lastName: { contains: q.search, mode: "insensitive" } },
              ],
            }
          : {}),
      };
      const result = await paginated("user", where, q);
      ok(res, { ...result, items: result.items.map(publicUser) });
    }),
  );
  adminRouter.patch(
    "/" + path + "/:id",
    validate(s.accountUpdate),
    wrap(async (req, res) =>
      ok(
        res,
        await updateAccount(
          req.user,
          s.id.parse(req.params.id),
          req.validated.body,
          role,
        ),
      ),
    ),
  );
}
adminRouter.post(
  "/mao-accounts",
  validate(s.accountCreate),
  wrap(async (req, res) =>
    ok(res, await createMao(req.user, req.validated.body), 201),
  ),
);
adminRouter.get(
  "/audit",
  validate(s.page, "query"),
  wrap(async (req, res) => {
    const q = req.validated.query;
    ok(
      res,
      await paginated(
        "auditLog",
        q.search ? { action: { contains: q.search, mode: "insensitive" } } : {},
        q,
        { actor: { select: { firstName: true, lastName: true } } },
      ),
    );
  }),
);
adminRouter.get(
  "/monitoring",
  wrap(async (req, res) => ok(res, await a.monitoring())),
);
adminRouter.get(
  "/security",
  wrap(async (req, res) =>
    ok(res, {
      summary: await dashboard(req.user),
      events: await db.auditLog.findMany({
        where: {
          action: {
            in: [
              "LOGIN_FAILURE",
              "LOGIN_SUCCESS",
              "PASSWORD_CHANGE",
              "ACCOUNT_UPDATE",
              "MAO_CREATE",
              "SNAPSHOT_RESTORE",
            ],
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    }),
  ),
);
adminRouter.post(
  "/backups/export",
  validate(s.confirm),
  wrap(async (req, res) =>
    ok(res, await a.snapshot(req.user, req.validated.body.currentPassword)),
  ),
);
adminRouter.post(
  "/backups/restore",
  validate(s.restoreRequest),
  wrap(async (req, res) =>
    ok(res, await a.restore(req.user, req.validated.body)),
  ),
);
adminRouter.get(
  "/settings",
  wrap(async (req, res) =>
    ok(
      res,
      (await db.systemSetting.findUnique({ where: { key: "sessionTimeout" } }))
        ?.value || 30,
    ),
  ),
);
adminRouter.patch(
  "/settings",
  validate(s.settings),
  wrap(async (req, res) => {
    await checkPassword(req.user, req.validated.body.currentPassword);
    ok(
      res,
      await db.$transaction(async (tx) => {
        const r = await tx.systemSetting.upsert({
          where: { key: "sessionTimeout" },
          create: {
            key: "sessionTimeout",
            value: req.validated.body.sessionTimeout,
          },
          update: { value: req.validated.body.sessionTimeout },
        });
        await audit(
          tx,
          req.user,
          "SYSTEM_SETTINGS_UPDATE",
          "SystemSetting",
          "sessionTimeout",
        );
        return r;
      }),
    );
  }),
);
adminRouter.get(
  "/contacts",
  validate(s.page, "query"),
  wrap(async (req, res) =>
    ok(res, await paginated("contactMessage", {}, req.validated.query)),
  ),
);
adminRouter.patch(
  "/contacts/:id",
  validate(s.contactStatus),
  wrap(async (req, res) => {
    if (!["READ", "RESOLVED"].includes(req.body.status))
      throw new AppError(422, "Invalid message status.");
    ok(
      res,
      await db.contactMessage.update({
        where: { id: s.id.parse(req.params.id) },
        data: { status: req.body.status },
      }),
    );
  }),
);
