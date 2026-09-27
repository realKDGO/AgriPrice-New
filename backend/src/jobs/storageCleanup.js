import { db } from "../config/db.js";
import { removeImage } from "../services/storageService.js";
try {
  for (const item of await db.storageCleanup.findMany({
    take: 100,
    orderBy: { createdAt: "asc" },
  })) {
    const references = await db.crop.count({
      where: { imagePath: item.imagePath },
    });
    if (!references) await removeImage(item.imagePath);
  }
} finally {
  await db.$disconnect();
}
