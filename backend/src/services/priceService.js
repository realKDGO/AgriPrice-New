import { Prisma } from "@prisma/client";
import { db } from "../config/db.js";
import { AppError, requireRecord } from "../utils/errors.js";
import { audit, notifyAudience } from "./auditService.js";
import { paginated } from "./catalogService.js";
export const eligible = {
  status: "VERIFIED",
  supersededAt: null,
  crop: { status: "ACTIVE" },
  market: { status: "ACTIVE" },
};
export async function currentPrices(cropId, marketId) {
  // PostgreSQL selects the latest row per pair before Prisma loads relations.
  const ids =
    await db.$queryRaw`SELECT DISTINCT ON (p."cropId",p."marketId") p.id FROM "Price" p JOIN "Crop" c ON c.id=p."cropId" JOIN "Market" m ON m.id=p."marketId" WHERE p.status='VERIFIED' AND p."supersededAt" IS NULL AND c.status='ACTIVE' AND m.status='ACTIVE' ${cropId ? Prisma.sql`AND p."cropId"=${cropId}::uuid` : Prisma.empty} ${marketId ? Prisma.sql`AND p."marketId"=${marketId}::uuid` : Prisma.empty} ORDER BY p."cropId",p."marketId",p.date DESC,p."reviewedAt" DESC,p.id DESC`;
  return db.price.findMany({
    where: { id: { in: ids.map((r) => r.id) } },
    orderBy: [{ date: "desc" }, { reviewedAt: "desc" }, { id: "desc" }],
    include: { crop: true, market: true },
  });
}
export async function listPrices(q, role, history = false) {
  const where = {};
  if (role !== "MAO" || history)
    Object.assign(where, { status: "VERIFIED", supersededAt: null });
  else if (q.status) where.status = q.status;
  if (q.cropId) where.cropId = q.cropId;
  if (q.marketId) where.marketId = q.marketId;
  if (q.dateFrom || q.dateTo)
    where.date = {
      ...(q.dateFrom ? { gte: new Date(q.dateFrom) } : {}),
      ...(q.dateTo ? { lte: new Date(q.dateTo) } : {}),
    };
  if (q.search)
    where.OR = [
      { crop: { name: { contains: q.search, mode: "insensitive" } } },
      { market: { name: { contains: q.search, mode: "insensitive" } } },
    ];
  return paginated(
    "price",
    where,
    q,
    {
      crop: true,
      market: true,
      reviewer: { select: { firstName: true, lastName: true } },
    },
    [{ date: "desc" }, { createdAt: "desc" }],
  );
}
export async function submitPrice(user, id, input) {
  return db.$transaction(
    async (tx) => {
      const crop = requireRecord(
        await tx.crop.findUnique({ where: { id: input.cropId } }),
      );
      const market = requireRecord(
        await tx.market.findUnique({ where: { id: input.marketId } }),
      );
      if (crop.status !== "ACTIVE" || market.status !== "ACTIVE")
        throw new AppError(422, "Choose an active crop and market.");
      const original = id
        ? requireRecord(await tx.price.findUnique({ where: { id } }))
        : null;
      if (original?.supersededAt)
        throw new AppError(409, "This price has already been replaced.");
      if (
        original?.status === "VERIFIED" &&
        (original.cropId !== input.cropId ||
          original.marketId !== input.marketId ||
          original.date.toISOString().slice(0, 10) !== input.date)
      )
        throw new AppError(
          422,
          "A revision must retain its crop, market, and record date. Submit a separate record for a new quotation.",
        );
      const prev = await tx.price.findFirst({
        where: { ...eligible, cropId: input.cropId, marketId: input.marketId },
        orderBy: [{ date: "desc" }, { reviewedAt: "desc" }],
      });
      const data = {
        ...input,
        price: new Prisma.Decimal(input.price),
        date: new Date(input.date),
        status: "PENDING",
        previousPrice: prev?.price,
        createdBy: user.id,
        reviewedBy: null,
        reviewedAt: null,
        reviewNote: null,
      };
      const r =
        original?.status === "PENDING"
          ? await tx.price.update({ where: { id: original.id }, data })
          : await tx.price.create({
              data: {
                ...data,
                revisionOfId:
                  original?.status === "VERIFIED" ? original.id : null,
              },
            });
      await audit(tx, user, "PRICE_SUBMIT", "Price", r.id);
      return r;
    },
    { isolationLevel: "Serializable" },
  );
}
export async function reviewPrice(user, id, approved, reviewNote) {
  return db.$transaction(
    async (tx) => {
      const r = requireRecord(
        await tx.price.findUnique({ where: { id }, include: { crop: true } }),
      );
      if (r.status !== "PENDING")
        throw new AppError(409, "This price has already been reviewed.");
      if (approved) {
        if (r.revisionOfId) {
          const changed = await tx.price.updateMany({
            where: {
              id: r.revisionOfId,
              status: "VERIFIED",
              supersededAt: null,
            },
            data: { supersededAt: new Date() },
          });
          if (changed.count !== 1)
            throw new AppError(
              409,
              "The original price was replaced. Submit a new revision.",
            );
        } else {
          const duplicate = await tx.price.findFirst({
            where: {
              cropId: r.cropId,
              marketId: r.marketId,
              date: r.date,
              status: "VERIFIED",
              supersededAt: null,
            },
          });
          if (duplicate)
            throw new AppError(
              409,
              "A verified quotation exists for this date. Edit it to submit a revision.",
            );
        }
      }
      const updated = await tx.price.update({
        where: { id },
        data: {
          status: approved ? "VERIFIED" : "REJECTED",
          reviewedBy: user.id,
          reviewedAt: new Date(),
          reviewNote,
        },
      });
      await audit(
        tx,
        user,
        approved ? "PRICE_APPROVE" : "PRICE_REJECT",
        "Price",
        id,
        { reviewNote },
      );
      if (approved) {
        await tx.forecast.updateMany({
          where: { cropId: r.cropId, marketId: r.marketId },
          data: { status: "STALE" },
        });
        await notifyAudience(
          tx,
          "PRICE_UPDATED",
          "Crop price updated",
          `${r.crop.name} has a newly verified quotation.`,
          id,
        );
      }
      return updated;
    },
    { isolationLevel: "Serializable" },
  );
}
