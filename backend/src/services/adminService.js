import { db } from "../config/db.js";
import { storage } from "./storageService.js";
import { env } from "../config/env.js";
import { audit } from "./auditService.js";
import { checkPassword } from "./authService.js";
import { z } from "zod";
import { crop, market, price, id } from "../schemas/index.js";
import { AppError } from "../utils/errors.js";
export async function monitoring() {
  const checkedAt = new Date();
  let database = "Unavailable",
    images = "Not configured";
  try {
    await db.$queryRaw`SELECT 1`;
    database = "Available";
  } catch {}
  if (env.SUPABASE_SERVICE_ROLE_KEY)
    try {
      const { error } = await storage().getBucket(env.SUPABASE_CROP_BUCKET);
      images = error ? "Unavailable" : "Available";
    } catch {
      images = "Unavailable";
    }
  let lastForecast = null;
  try {
    lastForecast = await db.forecast.findFirst({
      orderBy: { generatedAt: "desc" },
      select: { generatedAt: true },
    });
  } catch {}
  return {
    checkedAt,
    services: [
      { name: "API", status: "Available" },
      { name: "Database", status: database },
      { name: "Crop image storage", status: images },
      {
        name: "Forecast records",
        status: lastForecast ? "Available" : "No generated records",
      },
    ],
    lastForecastAt: lastForecast?.generatedAt || null,
  };
}
// Application data snapshot only. User credentials, sessions and storage binaries are deliberately excluded.
export async function snapshot(actor, password) {
  await checkPassword(actor, password);
  return db.$transaction(
    async (tx) => {
      const [crops, markets, prices] = await Promise.all([
        tx.crop.findMany(),
        tx.market.findMany(),
        tx.price.findMany(),
      ]);
      await audit(tx, actor, "SNAPSHOT_EXPORT", "Backup");
      return {
        format: "agriprice-agricultural-v1",
        createdAt: new Date(),
        crops,
        markets,
        prices,
      };
    },
    { isolationLevel: "RepeatableRead", timeout: 30000 },
  );
}
const cropBackup = crop.extend({
  id,
  imageUrl: z.string().url(),
  imagePath: z.string().regex(/^crops\/[a-zA-Z0-9._-]+$/),
  createdBy: id.nullable(),
  updatedBy: id.nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
const marketBackup = market.extend({
  id,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
const priceBackup = price.extend({
  id,
  status: z.enum(["PENDING", "VERIFIED", "REJECTED"]),
  previousPrice: z.coerce.number().nonnegative().nullable(),
  reviewNote: z.string().max(1000).nullable(),
  createdBy: id.nullable(),
  reviewedBy: id.nullable(),
  reviewedAt: z.string().datetime().nullable(),
  revisionOfId: id.nullable(),
  supersededAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  date: z.string().datetime(),
});
const snapshotSchema = z
  .object({
    format: z.literal("agriprice-agricultural-v1"),
    createdAt: z.string().datetime(),
    crops: z.array(cropBackup).max(10000),
    markets: z.array(marketBackup).max(10000),
    prices: z.array(priceBackup).max(100000),
  })
  .strict();
export async function restore(actor, input) {
  await checkPassword(actor, input.currentPassword);
  if (input.confirmation !== "RESTORE AGRICULTURAL DATA")
    throw new AppError(422, "Enter the restore confirmation phrase.");
  const parsed = snapshotSchema.safeParse(input.snapshot);
  if (!parsed.success)
    throw new AppError(
      422,
      "This snapshot is invalid or uses an unsupported format.",
    );
  const s = parsed.data;
  const cropIds = new Set(s.crops.map((x) => x.id)),
    marketIds = new Set(s.markets.map((x) => x.id)),
    priceIds = new Set(s.prices.map((x) => x.id));
  if (
    cropIds.size !== s.crops.length ||
    marketIds.size !== s.markets.length ||
    priceIds.size !== s.prices.length ||
    s.prices.some(
      (p) =>
        !cropIds.has(p.cropId) ||
        !marketIds.has(p.marketId) ||
        (p.revisionOfId && !priceIds.has(p.revisionOfId)),
    )
  )
    throw new AppError(422, "Snapshot references are inconsistent.");
  // Restrict image links to this project's controlled bucket.
  const imagePrefix = `${env.SUPABASE_URL}/storage/v1/object/public/${env.SUPABASE_CROP_BUCKET}/`;
  if (s.crops.some((c) => c.imageUrl !== imagePrefix + c.imagePath))
    throw new AppError(
      422,
      "Snapshot crop photos do not belong to this image bucket.",
    );
  return db.$transaction(
    async (tx) => {
      // Merge by stable IDs; retain newer unrelated records and never delete accounts or audit history.
      for (const row of s.crops) {
        const { createdAt, updatedAt, createdBy, updatedBy, ...value } = row;
        await tx.crop.upsert({
          where: { id: row.id },
          create: value,
          update: value,
        });
      }
      for (const row of s.markets) {
        const { createdAt, updatedAt, ...value } = row;
        await tx.market.upsert({
          where: { id: row.id },
          create: value,
          update: value,
        });
      }
      for (const row of s.prices) {
        const { createdBy, reviewedBy, revisionOfId, ...value } = row;
        for (const key of [
          "date",
          "reviewedAt",
          "supersededAt",
          "createdAt",
          "updatedAt",
        ])
          if (value[key]) value[key] = new Date(value[key]);
        await tx.price.upsert({
          where: { id: row.id },
          create: value,
          update: value,
        });
      }
      for (const row of s.prices)
        if (row.revisionOfId)
          await tx.price.update({
            where: { id: row.id },
            data: { revisionOfId: row.revisionOfId },
          });
      await tx.forecast.updateMany({ data: { status: "STALE" } });
      await audit(tx, actor, "SNAPSHOT_RESTORE", "Backup", undefined, {
        crops: s.crops.length,
        markets: s.markets.length,
        prices: s.prices.length,
      });
      return { restored: true };
    },
    { isolationLevel: "Serializable", timeout: 60000 },
  );
}
