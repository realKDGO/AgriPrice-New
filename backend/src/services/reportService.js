import { Prisma } from "@prisma/client";
import { db } from "../config/db.js";
import { currentPrices, eligible } from "./priceService.js";
import {
  rankMarkets,
  calculateProfit,
  transportCost,
} from "./domainService.js";
import { AppError, requireRecord } from "../utils/errors.js";
export async function recommendations(input) {
  return rankMarkets(
    await currentPrices(input.cropId),
    input.quantity,
    input.otherExpenses,
  );
}
export async function profit(input) {
  const crop = requireRecord(
    await db.crop.findUnique({ where: { id: input.cropId } }),
  );
  const market = requireRecord(
    await db.market.findUnique({ where: { id: input.marketId } }),
  );
  if (crop.status !== "ACTIVE" || market.status !== "ACTIVE")
    throw new AppError(422, "Choose an active crop and market.");
  return calculateProfit(
    input.quantity,
    input.sellingPrice,
    transportCost(market.transportBaseCost, input.quantity),
    input.otherExpenses,
  );
}
export async function agriculturalReport(q = {}) {
  const rows = await currentPrices(q.cropId, q.marketId);
  const prices = rows.map((r) => Number(r.price));
  const averages = await db.price.groupBy({
    by: ["cropId"],
    where: {
      ...eligible,
      ...(q.cropId ? { cropId: q.cropId } : {}),
      ...(q.marketId ? { marketId: q.marketId } : {}),
    },
    _avg: { price: true },
    _count: true,
  });
  const monthly =
    await db.$queryRaw`SELECT to_char(p.date,'YYYY-MM') AS month,avg(p.price) AS price,count(*)::int AS count FROM "Price" p JOIN "Crop" c ON c.id=p."cropId" JOIN "Market" m ON m.id=p."marketId" WHERE p.status='VERIFIED' AND p."supersededAt" IS NULL AND c.status='ACTIVE' AND m.status='ACTIVE' AND p.date >= date_trunc('month',now())-interval '11 months' ${q.cropId ? Prisma.sql`AND p."cropId"=${q.cropId}::uuid` : Prisma.empty} ${q.marketId ? Prisma.sql`AND p."marketId"=${q.marketId}::uuid` : Prisma.empty} GROUP BY to_char(p.date,'YYYY-MM') ORDER BY month`;
  return {
    items: rows,
    monthly,
    summary: {
      highest: prices.length ? Math.max(...prices) : null,
      lowest: prices.length ? Math.min(...prices) : null,
      average: prices.length
        ? prices.reduce((a, b) => a + b, 0) / prices.length
        : null,
      monitoredCrops: new Set(rows.map((r) => r.cropId)).size,
    },
    averages,
  };
}
export async function dashboard(user) {
  if (user.role === "ADMIN") {
    const [total, activeFarmers, activeMao, suspended, failures, recent] =
      await Promise.all([
        db.user.count(),
        db.user.count({ where: { role: "FARMER", status: "ACTIVE" } }),
        db.user.count({ where: { role: "MAO", status: "ACTIVE" } }),
        db.user.count({ where: { status: "SUSPENDED" } }),
        db.auditLog.count({
          where: {
            action: "LOGIN_FAILURE",
            createdAt: { gte: new Date(Date.now() - 86400000) },
          },
        }),
        db.auditLog.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { actor: { select: { firstName: true, lastName: true } } },
        }),
      ]);
    return { total, activeFarmers, activeMao, suspended, failures, recent };
  }
  const [activeCrops, activeMarkets, pending, verified, recent] =
    await Promise.all([
      db.crop.count({ where: { status: "ACTIVE" } }),
      db.market.count({ where: { status: "ACTIVE" } }),
      db.price.count({ where: { status: "PENDING" } }),
      db.price.count({ where: { status: "VERIFIED", supersededAt: null } }),
      db.auditLog.findMany({
        where: { entityType: { in: ["Crop", "Market", "Price", "Forecast"] } },
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { actor: { select: { firstName: true, lastName: true } } },
      }),
    ]);
  return { activeCrops, activeMarkets, pending, verified, recent };
}
