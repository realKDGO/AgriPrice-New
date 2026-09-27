import { app } from "./app.js";
import { env } from "./config/env.js";
import { db } from "./config/db.js";
await db.$connect();
const server = app.listen(env.PORT, "0.0.0.0", () =>
  console.log(`AgriPrice API listening on ${env.PORT}`),
);
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () =>
    server.close(async () => {
      await db.$disconnect();
      process.exit(0);
    }),
  );
