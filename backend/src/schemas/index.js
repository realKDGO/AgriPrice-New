import { z } from "zod";
const name = z.string().trim().min(1).max(80);
const password = z
  .string()
  .min(8)
  .max(72)
  .refine(
    (s) => Buffer.byteLength(s, "utf8") <= 72,
    "Password must be at most 72 UTF-8 bytes.",
  );
const email = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((s) => s.toLowerCase());
export const id = z.string().uuid();
const amount = z.coerce
  .number()
  .finite()
  .min(0)
  .max(999999999)
  .refine(
    (n) => Math.abs(n * 100 - Math.round(n * 100)) < 0.00001,
    "Use at most two decimal places.",
  );
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (s) =>
      !isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s,
    "Enter a valid date.",
  );
export const register = z
  .object({
    firstName: name,
    lastName: name,
    email,
    password,
    confirmPassword: z.string(),
    acceptTerms: z.literal(true),
  })
  .strict()
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
export const login = z
  .object({
    email,
    password: z.string().min(1).max(200),
    rememberMe: z.boolean().default(false),
  })
  .strict();
export const changePassword = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: password,
    confirmPassword: z.string(),
  })
  .strict()
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
export const profile = z
  .object({
    firstName: name,
    lastName: name,
    email,
    currentPassword: z.string().min(1),
  })
  .strict();
export const preferences = z
  .object({
    price: z.boolean().optional(),
    forecast: z.boolean().optional(),
    market: z.boolean().optional(),
    language: z.enum(["English", "Filipino"]).optional(),
    theme: z.enum(["light", "dark", "system"]).optional(),
    textSize: z.enum(["small", "standard", "large"]).optional(),
    defaultCrop: id.nullable().optional(),
  })
  .strict();
export const crop = z
  .object({
    name: z.string().trim().min(1).max(100),
    category: z.enum(["Grain", "Vegetable", "Fruit"]),
    unit: z.literal("kg").default("kg"),
    status: z.enum(["ACTIVE", "ARCHIVED"]).default("ACTIVE"),
  })
  .strict();
export const market = z
  .object({
    name: z.string().trim().min(1).max(120),
    location: z.string().trim().min(1).max(200),
    transportBaseCost: amount,
    distanceKm: amount.nullable().optional(),
    status: z.enum(["ACTIVE", "ARCHIVED"]).default("ACTIVE"),
  })
  .strict();
export const recordStatus = z
  .object({ status: z.enum(["ACTIVE", "ARCHIVED"]) })
  .strict();
export const price = z
  .object({
    cropId: id,
    marketId: id,
    price: amount.refine((n) => n > 0, "Price must be greater than zero."),
    date: date.refine(
      (s) => s <= new Date().toISOString().slice(0, 10),
      "Future prices cannot be submitted.",
    ),
    source: z.string().trim().min(1).max(200),
  })
  .strict();
export const approve = z
  .object({ reviewNote: z.string().trim().max(1000).optional() })
  .strict();
export const reject = z
  .object({ reviewNote: z.string().trim().min(1).max(1000) })
  .strict();
export const page = z
  .object({
    page: z.coerce.number().int().min(1).max(100000).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(25),
    search: z.string().trim().max(200).optional(),
    trend: z.enum(["up", "down", "stable"]).optional(),
    status: z
      .enum([
        "ACTIVE",
        "ARCHIVED",
        "PENDING",
        "VERIFIED",
        "REJECTED",
        "SUSPENDED",
        "INACTIVE",
      ])
      .optional(),
    category: z.enum(["Grain", "Vegetable", "Fruit"]).optional(),
    cropId: id.optional(),
    marketId: id.optional(),
    dateFrom: date.optional(),
    dateTo: date.optional(),
    role: z.enum(["FARMER", "MAO", "ADMIN"]).optional(),
  })
  .strict()
  .refine((v) => !v.dateFrom || !v.dateTo || v.dateFrom <= v.dateTo, {
    message: "Start date must be before end date.",
    path: ["dateFrom"],
  });
export const recommendation = z
  .object({
    cropId: id,
    quantity: amount.refine((n) => n > 0).transform(String),
    otherExpenses: amount.default(0).transform(String),
  })
  .strict();
export const profit = z
  .object({
    cropId: id,
    marketId: id,
    quantity: amount.refine((n) => n > 0).transform(String),
    sellingPrice: amount.refine((n) => n > 0).transform(String),
    otherExpenses: amount.default(0).transform(String),
  })
  .strict();
export const forecast = z
  .object({
    cropId: id,
    marketId: id,
    horizonMonths: z.coerce.number().refine((n) => [1, 3, 6].includes(n)),
  })
  .strict();
export const accountCreate = z
  .object({
    firstName: name,
    lastName: name,
    email,
    password,
    currentPassword: z.string().min(1),
  })
  .strict();
export const accountUpdate = z
  .object({
    firstName: name,
    lastName: name,
    email,
    status: z.enum(["ACTIVE", "SUSPENDED", "INACTIVE"]),
    currentPassword: z.string().optional(),
  })
  .strict();
export const contact = z
  .object({
    name: z.string().trim().min(1).max(120),
    email,
    subject: z.string().trim().min(1).max(200),
    message: z.string().trim().min(10).max(5000),
  })
  .strict();
export const settings = z
  .object({
    sessionTimeout: z.coerce.number().int().min(5).max(240),
    currentPassword: z.string().min(1),
  })
  .strict();
export const confirm = z
  .object({ currentPassword: z.string().min(1) })
  .strict();

export const restoreRequest = z
  .object({
    currentPassword: z.string().min(1).max(200),
    confirmation: z.literal("RESTORE AGRICULTURAL DATA"),
    snapshot: z.unknown(),
  })
  .strict();
export const contactStatus = z
  .object({ status: z.enum(["READ", "RESOLVED"]) })
  .strict();
