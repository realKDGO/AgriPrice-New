import { db } from "../config/db.js";
import { AppError } from "../utils/errors.js";
import { eligible, currentPrices } from "./priceService.js";
import { notifyAudience, audit } from "./auditService.js";
export const MODEL_VERSION = "monthly-linear-trend-v1";
// Equal-weight monthly means avoid giving frequently reported months more influence.
export function fitMonthlyTrend(records, asOf = new Date()) {
  const buckets = new Map();
  for (const r of records) {
    const d = new Date(r.date);
    const key = d.getUTCFullYear() * 12 + d.getUTCMonth();
    const b = buckets.get(key) || [];
    b.push(Number(r.price));
    buckets.set(key, b);
  }
  const points = [...buckets]
    .sort((a, b) => a[0] - b[0])
    .slice(-12)
    .map(([x, v]) => ({ x, y: v.reduce((a, b) => a + b, 0) / v.length }));
  if (points.length < 3)
    throw new AppError(
      422,
      "At least three months of verified prices for this crop and market are needed.",
    );
  const origin = points[0].x;
  const xs = points.map((p) => p.x - origin),
    ys = points.map((p) => p.y);
  const n = points.length;
  const mx = xs.reduce((a, b) => a + b) / n,
    my = ys.reduce((a, b) => a + b) / n;
  const slope =
    xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) /
    xs.reduce((s, x) => s + (x - mx) ** 2, 0);
  return Array.from({ length: 6 }, (_, i) => {
    const target = new Date(
      Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth() + i + 1, 1),
    );
    const x = target.getUTCFullYear() * 12 + target.getUTCMonth() - origin;
    return {
      horizonMonths: i + 1,
      targetDate: target,
      predictedPrice: Math.max(0, my + slope * (x - mx)).toFixed(2),
      inputCount: records.length,
    };
  });
}
export async function generateForecast(cropId, marketId, actor) {
  const records = await db.price.findMany({
    where: {
      ...eligible,
      cropId,
      marketId,
      date: {
        gte: new Date(
          new Date().setUTCFullYear(new Date().getUTCFullYear() - 1),
        ),
      },
    },
    orderBy: { date: "asc" },
  });
  const forecastDate = new Date(new Date().toISOString().slice(0, 10));
  const values = fitMonthlyTrend(records, forecastDate);
  return db.$transaction(async (tx) => {
    const rows = [];
    for (const value of values) {
      rows.push(
        await tx.forecast.upsert({
          where: {
            cropId_marketId_forecastDate_horizonMonths_modelVersion: {
              cropId,
              marketId,
              forecastDate,
              horizonMonths: value.horizonMonths,
              modelVersion: MODEL_VERSION,
            },
          },
          create: {
            cropId,
            marketId,
            forecastDate,
            ...value,
            modelVersion: MODEL_VERSION,
          },
          update: { ...value, status: "AVAILABLE", generatedAt: new Date() },
        }),
      );
    }
    await audit(tx, actor, "FORECAST_GENERATE", "Forecast", rows[0].id);
    await notifyAudience(
      tx,
      "FORECAST_AVAILABLE",
      "Forecast available",
      "A new crop price outlook is available.",
      rows[0].id,
    );
    return rows;
  });
}
export async function getLatestForecast(cropId, marketId) {
  const last = await db.forecast.findFirst({
    where: {
      cropId,
      marketId,
      status: "AVAILABLE",
      modelVersion: MODEL_VERSION,
      crop: { status: "ACTIVE" },
      market: { status: "ACTIVE" },
    },
    orderBy: { generatedAt: "desc" },
  });
  return last
    ? db.forecast.findMany({
        where: {
          cropId,
          marketId,
          forecastDate: last.forecastDate,
          status: "AVAILABLE",
          modelVersion: MODEL_VERSION,
        },
        orderBy: { horizonMonths: "asc" },
      })
    : [];
}
export async function getForecast({ cropId, marketId, horizonMonths }) {
  const rows = await getLatestForecast(cropId, marketId);
  const baseline=(await currentPrices(cropId,marketId))[0]?.price;
  const target=rows.find(r=>r.horizonMonths===horizonMonths);
  return {
    items: rows.filter((r) => r.horizonMonths <= horizonMonths),
    baselinePrice:baseline||null,
    trend:baseline&&target?(Number(target.predictedPrice)>Number(baseline)?"Increasing":Number(target.predictedPrice)<Number(baseline)?"Decreasing":"Stable"):null,
    method: "Monthly linear trend",
    note: "Estimates use verified monthly historical prices. Future prices may differ. No calibrated confidence interval is available.",
  };
}
