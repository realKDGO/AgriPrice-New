import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import bcrypt from "bcrypt";
import { db } from "../src/config/db.js";
import {
  storage,
  uploadImage,
  removeImage,
} from "../src/services/storageService.js";
import { env } from "../src/config/env.js";
import { crops, markets, prices, history } from "./starterData.js";
const stableId = (key) => {
  const h = createHash("sha256").update(`agriprice-seed:${key}`).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
};
async function account(role) {
  const email = process.env[`SEED_${role}_EMAIL`],
    password = process.env[`SEED_${role}_PASSWORD`];
  if (!email || !password) return;
  if (password.length < 12 || Buffer.byteLength(password) > 72)
    throw new Error("Seed passwords must be 12–72 bytes.");
  const names = {
    ADMIN: ["System", "Administrator"],
    MAO: ["Maria", "Agriculture Officer"],
    FARMER: ["Juan", "Dela Cruz"],
  };
  const passwordHash = await bcrypt.hash(password, 12);
  return db.user.upsert({
    where: { email: email.toLowerCase() },
    update: {
      firstName: names[role][0],
      lastName: names[role][1],
      passwordHash,
      role,
      status: "ACTIVE",
    },
    create: {
      firstName: names[role][0],
      lastName: names[role][1],
      email: email.toLowerCase(),
      passwordHash,
      role,
      preference: { create: {} },
    },
  });
}
try {
  if (env.NODE_ENV === "production")
    throw new Error(
      "The development seed is disabled in production. Provision the initial Admin using the separate bootstrap-admin command.",
    );
  const admin = await account("ADMIN");
  const mao = await account("MAO");
  const farmer = await account("FARMER");
  if (process.env.SEED_SAMPLE_DATA !== "true") {
    console.log("Development accounts initialized. Sample-data seed disabled.");
  } else {
    if (!env.LOCAL_STORAGE_MODE) {
      const client = storage();
      const exists = await client.getBucket(env.SUPABASE_CROP_BUCKET);
      if (exists.error) {
        const result = await client.createBucket(env.SUPABASE_CROP_BUCKET, {
          public: true,
          fileSizeLimit: 5 * 1024 * 1024,
          allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
        });
        if (result.error) throw result.error;
      }
    }
    for (const c of crops) {
      const id = stableId(c.id);
      if (await db.crop.findUnique({ where: { id } })) continue;
      if (env.LOCAL_STORAGE_MODE) {
        await db.crop.create({
          data: {
            id,
            name: c.name,
            category: c.category,
            unit: c.unit,
            imageUrl: c.image,
            imagePath: `presentation-seed/${c.image.split("/").pop()}`,
          },
        });
        continue;
      }
      const path = fileURLToPath(
        new URL("../../frontend/public" + c.image, import.meta.url),
      );
      const buffer = await readFile(path);
      const uploaded = await uploadImage({
        buffer,
        size: buffer.length,
        mimetype: "image/jpeg",
        originalname: c.image.split("/").pop(),
      });
      try {
        await db.crop.create({
          data: {
            id,
            name: c.name,
            category: c.category,
            unit: c.unit,
            ...uploaded,
          },
        });
      } catch (error) {
        await removeImage(uploaded.imagePath);
        throw error;
      }
    }
    for (const m of markets)
      await db.market.upsert({
        where: { id: stableId(m.id) },
        update: {},
        create: {
          id: stableId(m.id),
          name: m.name,
          location: m.location,
          distanceKm: m.distanceKm,
          transportBaseCost: m.transport,
        },
      });
    for (const p of [...history, ...prices]) {
      const cropId = stableId(p.cropId);
      const marketId = stableId(p.marketId);
      const date = new Date(p.date);

      const existing = await db.price.findFirst({
        where: {
          cropId,
          marketId,
          date,
        },
      });

      const data = {
        price: p.price,
        previousPrice: p.previous,
        status: p.status.toUpperCase(),
        source: "Development starter dataset supplied with AgriPrice",
        reviewedAt: p.status === "Verified" ? date : null,
        createdBy: mao?.id,
        reviewedBy: p.status === "Verified" ? mao?.id : null,
      };

      if (existing) {
        await db.price.update({
          where: { id: existing.id },
          data,
        });
      } else {
        await db.price.create({
          data: {
            id: stableId(p.id),
            cropId,
            marketId,
            ...data,
            date,
          },
        });
      }
    }
    const demoPassword = process.env.SEED_FARMER_PASSWORD;
    if (!demoPassword)
      throw new Error("SEED_FARMER_PASSWORD is required for presentation data.");
    const demoHash = await bcrypt.hash(demoPassword, 12);
    const extraUsers = [
      ["rosa@example.org", "Rosa", "Santos", "FARMER", "ACTIVE"],
      ["pedro@example.org", "Pedro", "Reyes", "FARMER", "ACTIVE"],
      ["lina@example.org", "Lina", "Mendoza", "FARMER", "ACTIVE"],
      ["suspended@example.org", "Carlos", "Garcia", "FARMER", "SUSPENDED"],
    ];
    for (const [email, firstName, lastName, role, status] of extraUsers)
      await db.user.upsert({
        where: { email },
        update: { firstName, lastName, role, status, passwordHash: demoHash },
        create: {
          email,
          firstName,
          lastName,
          role,
          status,
          passwordHash: demoHash,
          preference: { create: {} },
        },
      });

    const forecastDate = new Date("2026-09-18");
    for (const [cropIndex, crop] of crops.entries())
      for (const [marketIndex, market] of markets.entries())
        for (let horizonMonths = 1; horizonMonths <= 6; horizonMonths++) {
          const baseline = crop.base + [0, 2, -2, 3, -1, 1, 4][marketIndex];
          const predictedPrice =
            Math.round(
              (baseline + horizonMonths * 0.65 + Math.sin(cropIndex + horizonMonths) * 1.4) *
              100,
            ) / 100;
          const targetDate = new Date("2026-10-01");
          targetDate.setUTCMonth(targetDate.getUTCMonth() + horizonMonths - 1);
          await db.forecast.upsert({
            where: {
              cropId_marketId_forecastDate_horizonMonths_modelVersion: {
                cropId: stableId(crop.id),
                marketId: stableId(market.id),
                forecastDate,
                horizonMonths,
                modelVersion: "monthly-linear-trend-v1",
              },
            },
            update: { predictedPrice, targetDate, status: "AVAILABLE" },
            create: {
              cropId: stableId(crop.id),
              marketId: stableId(market.id),
              horizonMonths,
              forecastDate,
              targetDate,
              predictedPrice,
              modelVersion: "monthly-linear-trend-v1",
              inputCount: 12,
              status: "AVAILABLE",
            },
          });
        }

    const notifications = [
      ["PRICE_UPDATED", "Price updated", "Verified crop prices were updated for the monitored markets.", false],
      ["FORECAST_AVAILABLE", "Forecast available", "New 1, 3, and 6 month price forecasts are available.", false],
      ["MARKET_UPDATED", "Market information updated", "Transport estimates were updated for active markets.", true],
      ["SECURITY_NOTICE", "Account security", "Your presentation account signed in successfully.", true],
    ];
    if (farmer)
      for (const [index, [type, title, message, isRead]] of notifications.entries())
        await db.notification.upsert({
          where: { id: stableId(`notification-${index}`) },
          update: { type, title, message, isRead },
          create: {
            id: stableId(`notification-${index}`),
            userId: farmer.id,
            type,
            title,
            message,
            isRead,
          },
        });

    const activities = [
      ["REGISTER", "User", farmer?.id, farmer?.id],
      ["CROP_CREATE", "Crop", stableId("rice"), mao?.id],
      ["MARKET_CREATE", "Market", stableId("antipolo"), mao?.id],
      ["PRICE_SUBMIT", "Price", stableId("pending-rice"), mao?.id],
      ["PRICE_APPROVE", "Price", stableId("price-rice-antipolo"), mao?.id],
      ["FORECAST_GENERATE", "Forecast", null, mao?.id],
      ["LOGIN_SUCCESS", "User", admin?.id, admin?.id],
      ["LOGIN_FAILURE", "Authentication", null, null],
      ["ACCOUNT_UPDATE", "User", stableId("demo-suspended-user"), admin?.id],
    ];
    for (const [index, [action, entityType, entityId, actorUserId]] of activities.entries())
      await db.auditLog.upsert({
        where: { id: stableId(`audit-${index}`) },
        update: { action, entityType, entityId, actorUserId },
        create: {
          id: stableId(`audit-${index}`),
          action,
          entityType,
          entityId,
          actorUserId,
          status: action === "LOGIN_FAILURE" ? "FAILED" : "SUCCESS",
          ipAddress: "127.0.0.1",
          metadata: { source: "Local presentation seed" },
        },
      });

    await db.systemSetting.upsert({
      where: { key: "sessionTimeout" },
      update: { value: 30 },
      create: { key: "sessionTimeout", value: 30 },
    });
    const messages = [
      ["Ana Villanueva", "ana@example.org", "Price information", "How often are verified prices updated?"],
      ["Rizal Farmers Cooperative", "coop@example.org", "Market coverage", "Can another public market be added to monitoring?"],
    ];
    for (const [index, [name, email, subject, message]] of messages.entries())
      await db.contactMessage.upsert({
        where: { id: stableId(`contact-${index}`) },
        update: { name, email, subject, message },
        create: {
          id: stableId(`contact-${index}`),
          name,
          email,
          subject,
          message,
        },
      });
    console.log(
      "Local presentation data seeded: accounts, crops, crop photos, markets, prices, history, forecasts, notifications, activity, and contact records.",
    );
  }
} finally {
  await db.$disconnect();
}
