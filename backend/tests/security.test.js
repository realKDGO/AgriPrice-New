import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.DIRECT_URL = process.env.DATABASE_URL;
process.env.JWT_ACCESS_SECRET = "a".repeat(40);
process.env.JWT_REFRESH_SECRET = "b".repeat(40);
process.env.FRONTEND_URL = "http://localhost:4173";
process.env.NODE_ENV = "test";
process.env.ALLOW_LAN_ORIGINS = "true";
const { authorize, trustedOrigin, allowedFrontendOrigin } = await import(
  "../src/middleware/auth.js"
);
const { validateImage } = await import("../src/services/storageService.js");
const { fitMonthlyTrend } = await import("../src/services/forecastService.js");
for (const role of ["FARMER", "MAO", "ADMIN"])
  test(`${role} agricultural mutation boundary`, () => {
    let error;
    authorize("MAO")({ user: { role } }, null, (e) => {
      error = e;
    });
    assert.equal(error?.status, role === "MAO" ? undefined : 403);
  });
for (const role of ["FARMER", "MAO", "ADMIN"])
  test(`${role} Admin boundary`, () => {
    let error;
    authorize("ADMIN")({ user: { role } }, null, (e) => {
      error = e;
    });
    assert.equal(error?.status, role === "ADMIN" ? undefined : 403);
  });
test("cross-origin cookie writes are rejected", () => {
  let error;
  trustedOrigin(
    {
      method: "POST",
      get: () => "https://untrusted.example",
      cookies: { agriprice_refresh: "x" },
    },
    null,
    (e) => {
      error = e;
    },
  );
  assert.equal(error.status, 403);
});
test("presentation mode allows only localhost and private-LAN frontend origins", () => {
  assert.equal(allowedFrontendOrigin("http://localhost:4173"), true);
  assert.equal(allowedFrontendOrigin("http://192.168.1.25:4173"), true);
  assert.equal(allowedFrontendOrigin("http://example.com:4173"), false);
  assert.equal(allowedFrontendOrigin("http://192.168.1.25:3000"), false);
});
test("photo is required", async () =>
  assert.rejects(() => validateImage(), { status: 422 }));
test("MIME spoofing and oversized photos are rejected", async () => {
  const buffer = Buffer.from("<script>alert(1)</script>");
  await assert.rejects(
    () =>
      validateImage({
        buffer,
        size: buffer.length,
        mimetype: "image/jpeg",
        originalname: "x.jpg",
      }),
    { status: 422 },
  );
  await assert.rejects(
    () =>
      validateImage({
        buffer,
        size: 6 * 1024 * 1024,
        mimetype: "image/jpeg",
        originalname: "x.jpg",
      }),
    { status: 422 },
  );
  await assert.rejects(
    () =>
      validateImage({
        buffer,
        size: buffer.length,
        mimetype: "text/html",
        originalname: "x.html",
      }),
    { status: 422 },
  );
});
test("valid photo is decoded and re-encoded to remove extraneous content", async () => {
  const buffer = await sharp({
    create: { width: 4, height: 4, channels: 3, background: "#178844" },
  })
    .png()
    .toBuffer();
  const result = await validateImage({
    buffer,
    size: buffer.length,
    mimetype: "image/png",
    originalname: "crop.png",
  });
  assert.equal((await sharp(result).metadata()).format, "webp");
});
test("forecast refuses inadequate history", () => {
  assert.throws(() => fitMonthlyTrend([{ date: "2026-01-01", price: 20 }]), {
    status: 422,
  });
});
test("forecast derives a monthly trend with six ordered targets and no confidence fiction", () => {
  const result = fitMonthlyTrend(
    [
      { date: "2026-01-01", price: 10 },
      { date: "2026-02-01", price: 20 },
      { date: "2026-03-01", price: 30 },
    ],
    new Date("2026-03-20"),
  );
  assert.equal(result.length, 6);
  assert.equal(result[0].predictedPrice, "40.00");
  assert.equal(result[0].targetDate.toISOString().slice(0, 10), "2026-04-01");
  assert.equal("confidence" in result[0], false);
});
