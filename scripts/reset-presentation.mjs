import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const text = await readFile(new URL("../backend/.env", import.meta.url), "utf8");
const local = {};
for (const raw of text.split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith("#") || !line.includes("=")) continue;
  const index = line.indexOf("=");
  local[line.slice(0, index)] = line.slice(index + 1);
}
const database = new URL(local.DATABASE_URL);
if (
  !["localhost", "127.0.0.1"].includes(database.hostname) ||
  database.pathname.replace(/^\//, "") !== "agriprice_presentation" ||
  local.NODE_ENV !== "development"
)
  throw new Error(
    "Reset refused. DATABASE_URL must target the local agriprice_presentation database in development mode.",
  );

const env = { ...process.env, ...local };
const command = process.platform === "win32" ? "npx.cmd" : "npx";
const reset = spawnSync(
  command,
  [
    "prisma",
    "migrate",
    "reset",
    "--force",
    "--skip-seed",
    "--schema",
    "backend/prisma/schema.prisma",
  ],
  { env, stdio: "inherit" },
);
if (reset.status !== 0) process.exit(reset.status || 1);
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const seed = spawnSync(npm, ["run", "db:seed"], {
  env,
  stdio: "inherit",
});
process.exit(seed.status || 0);
