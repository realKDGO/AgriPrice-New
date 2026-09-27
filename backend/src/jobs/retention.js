import { db } from "../config/db.js";
// Expired token material has no further session use. Audit/contact retention is operator-defined.
try {
  await db.refreshSession.deleteMany({
    where: { expiresAt: { lt: new Date(Date.now() - 30 * 86400000) } },
  });
} finally {
  await db.$disconnect();
}
