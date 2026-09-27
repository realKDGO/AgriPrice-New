import bcrypt from "bcrypt";
import { db } from "../config/db.js";
import { z } from "zod";
try {
  const input = z
    .object({
      ADMIN_EMAIL: z.string().email(),
      ADMIN_PASSWORD: z
        .string()
        .min(12)
        .refine((s) => Buffer.byteLength(s) <= 72),
    })
    .parse(process.env);
  if (await db.user.count({ where: { role: "ADMIN" } }))
    throw new Error(
      "An Admin already exists. Bootstrap is only allowed for an empty Admin roster.",
    );
  await db.user.create({
    data: {
      firstName: "System",
      lastName: "Administrator",
      email: input.ADMIN_EMAIL.toLowerCase(),
      passwordHash: await bcrypt.hash(input.ADMIN_PASSWORD, 12),
      role: "ADMIN",
      preference: { create: {} },
    },
  });
  console.log(
    "Initial Admin created. Remove bootstrap credentials from the environment.",
  );
} finally {
  await db.$disconnect();
}
