import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { env } from "../config/env.js";
import { db } from "../config/db.js";
import { AppError } from "../utils/errors.js";
const allowed = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
};
export function storage() {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY)
    throw new AppError(503, "Image storage is not configured.");
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  }).storage;
}
export async function validateImage(file) {
  if (!file) throw new AppError(422, "A crop photo is required.");
  if (file.size > 5 * 1024 * 1024)
    throw new AppError(422, "Crop photos must be 5 MB or smaller.");
  if (
    !allowed[file.mimetype]?.includes(
      file.originalname.split(".").pop().toLowerCase(),
    )
  )
    throw new AppError(422, "Choose a JPEG, PNG, or WebP photo.");
  let meta;
  try {
    meta = await sharp(file.buffer, { limitInputPixels: 40000000 }).metadata();
  } catch {
    throw new AppError(422, "The image file could not be read.");
  }
  const mime = { jpeg: "image/jpeg", png: "image/png", webp: "image/webp" }[
    meta.format
  ];
  if (mime !== file.mimetype || meta.pages > 1)
    throw new AppError(
      422,
      "Choose a valid, non-animated JPEG, PNG, or WebP photo.",
    );
  return sharp(file.buffer, { limitInputPixels: 40000000 })
    .rotate()
    .resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toBuffer();
}
export async function uploadImage(file) {
  const bytes = await validateImage(file);
  const imagePath = `crops/${randomUUID()}.webp`;
  if (env.LOCAL_STORAGE_MODE) {
    const target = resolve(env.LOCAL_STORAGE_DIR, imagePath);
    const root = resolve(env.LOCAL_STORAGE_DIR) + sep;
    if (!target.startsWith(root))
      throw new AppError(422, "The image destination is invalid.");
    await mkdir(resolve(env.LOCAL_STORAGE_DIR, "crops"), { recursive: true });
    await writeFile(target, bytes, { flag: "wx" });
    return {
      imagePath,
      imageUrl: `${env.LOCAL_STORAGE_PUBLIC_URL.replace(/\/$/, "")}/${imagePath}`,
    };
  }
  const client = storage();
  const { error } = await client
    .from(env.SUPABASE_CROP_BUCKET)
    .upload(imagePath, bytes, { contentType: "image/webp", upsert: false });
  if (error)
    throw new AppError(
      503,
      "Unable to upload the crop photo. Please try again.",
    );
  return {
    imagePath,
    imageUrl: client.from(env.SUPABASE_CROP_BUCKET).getPublicUrl(imagePath).data
      .publicUrl,
  };
}
export async function removeImage(path) {
  if (!path) return;
  if (env.LOCAL_STORAGE_MODE) {
    try {
      const target = resolve(env.LOCAL_STORAGE_DIR, path);
      const root = resolve(env.LOCAL_STORAGE_DIR) + sep;
      if (!target.startsWith(root)) return;
      await unlink(target);
      await db.storageCleanup.deleteMany({ where: { imagePath: path } });
    } catch (error) {
      if (error?.code !== "ENOENT")
        await db.storageCleanup.upsert({
          where: { imagePath: path },
          create: { imagePath: path },
          update: { attempts: { increment: 1 } },
        });
    }
    return;
  }
  try {
    const { error } = await storage()
      .from(env.SUPABASE_CROP_BUCKET)
      .remove([path]);
    if (error) throw error;
    await db.storageCleanup.deleteMany({ where: { imagePath: path } });
  } catch {
    await db.storageCleanup.upsert({
      where: { imagePath: path },
      create: { imagePath: path },
      update: { attempts: { increment: 1 } },
    });
  }
}
