import { db } from "../config/db.js";
import { AppError, requireRecord } from "../utils/errors.js";
import { audit, notifyAudience } from "./auditService.js";
import { uploadImage, removeImage } from "./storageService.js";
export async function paginated(
  model,
  where,
  q,
  include,
  orderBy = { createdAt: "desc" },
) {
  const [items, total] = await db.$transaction([
    db[model].findMany({
      where,
      include,
      orderBy,
      skip: (q.page - 1) * q.limit,
      take: q.limit,
    }),
    db[model].count({ where }),
  ]);
  return {
    items,
    total,
    page: q.page,
    limit: q.limit,
    pages: Math.ceil(total / q.limit),
  };
}
export function listCatalog(kind, q, role) {
  const where = {
    ...(q.search ? { name: { contains: q.search, mode: "insensitive" } } : {}),
    ...(kind === "crop" && q.category ? { category: q.category } : {}),
  };
  if (role !== "MAO") where.status = "ACTIVE";
  else if (q.status) where.status = q.status;
  return paginated(kind, where, q, undefined, { name: "asc" });
}
export async function saveCrop(user, id, input, file) {
  const existing = id
    ? requireRecord(await db.crop.findUnique({ where: { id } }))
    : null;
  if (!existing && !file) throw new AppError(422, "A crop photo is required.");
  if (
    await db.crop.findFirst({
      where: {
        name: { equals: input.name, mode: "insensitive" },
        ...(id ? { id: { not: id } } : {}),
      },
    })
  )
    throw new AppError(409, "A crop with this name already exists.");
  const uploaded = file ? await uploadImage(file) : null;
  let record;
  try {
    record = await db.$transaction(async (tx) => {
      const value = { ...input, ...uploaded, updatedBy: user.id };
      const r = id
        ? await tx.crop.update({ where: { id }, data: value })
        : await tx.crop.create({ data: { ...value, createdBy: user.id } });
      await audit(tx, user, id ? "CROP_UPDATE" : "CROP_CREATE", "Crop", r.id);
      return r;
    });
  } catch (e) {
    if (uploaded) await removeImage(uploaded.imagePath);
    throw e;
  }
  if (uploaded && existing) await removeImage(existing.imagePath);
  return record;
}
export async function saveMarket(user, id, input) {
  return db.$transaction(async (tx) => {
    if (
      await tx.market.findFirst({
        where: {
          name: { equals: input.name, mode: "insensitive" },
          ...(id ? { id: { not: id } } : {}),
        },
      })
    )
      throw new AppError(409, "A market with this name already exists.");
    const r = id
      ? await tx.market.update({ where: { id }, data: input })
      : await tx.market.create({ data: input });
    await audit(
      tx,
      user,
      id ? "MARKET_UPDATE" : "MARKET_CREATE",
      "Market",
      r.id,
    );
    await notifyAudience(
      tx,
      "MARKET_UPDATED",
      "Market information updated",
      `${r.name} information has been updated.`,
      r.id,
    );
    return r;
  });
}
export async function setStatus(kind, user, id, status) {
  return db.$transaction(async (tx) => {
    const r = await tx[kind].update({ where: { id }, data: { status } });
    await audit(tx, user, `${kind.toUpperCase()}_${status}`, kind, id);
    return r;
  });
}
