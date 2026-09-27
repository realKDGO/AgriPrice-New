export const audit = (
  db,
  actor,
  action,
  entityType,
  entityId,
  metadata,
  status = "SUCCESS",
  ipAddress,
) =>
  db.auditLog.create({
    data: {
      actorUserId: actor?.id,
      action,
      entityType,
      entityId,
      metadata,
      status,
      ipAddress,
    },
  });
export async function notifyAudience(db, type, title, message, entityId) {
  const preference =
    type === "PRICE_UPDATED"
      ? "price"
      : type === "FORECAST_AVAILABLE"
        ? "forecast"
        : "market";
  await db.$executeRaw`INSERT INTO "Notification" ("id","userId","type","title","message","isRead","relatedEntityId","createdAt") SELECT gen_random_uuid(),u.id,${type},${title},${message},false,${entityId},now() FROM "User" u LEFT JOIN "UserPreference" p ON p."userId"=u.id WHERE u.status='ACTIVE' AND u.role='FARMER' AND CASE WHEN ${preference}='price' THEN COALESCE(p.price,true) WHEN ${preference}='forecast' THEN COALESCE(p.forecast,true) ELSE COALESCE(p.market,true) END`;
}
