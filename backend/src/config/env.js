import "dotenv/config";
import { z } from "zod";
const schema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z
    .string()
    .regex(/^\d+[mh]$/)
    .default("15m"),
  JWT_REFRESH_EXPIRES_IN: z
    .string()
    .regex(/^\d+[dh]$/)
    .default("7d"),
  FRONTEND_URL: z.string().url(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_CROP_BUCKET: z.string().default("crop-images"),
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
  TRUST_PROXY: z.coerce.number().int().min(0).max(3).default(0),
  LOCAL_STORAGE_MODE: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  LOCAL_STORAGE_DIR: z.string().default("uploads"),
  LOCAL_STORAGE_PUBLIC_URL: z
    .string()
    .url()
    .default("http://localhost:5000/uploads"),
  ALLOW_LAN_ORIGINS: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  EMAIL_DOMAIN_CHECK_MODE: z
    .enum(["dns", "dns_or_common"])
    .default("dns"),
});
export const env = schema.parse(process.env);
if (env.JWT_ACCESS_SECRET === env.JWT_REFRESH_SECRET)
  throw new Error("JWT secrets must be distinct.");
if (env.COOKIE_SAME_SITE === "none" && env.NODE_ENV !== "production")
  throw new Error("Cross-site cookies require HTTPS production mode.");
