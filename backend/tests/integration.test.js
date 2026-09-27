import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import request from "supertest";
import bcrypt from "bcrypt";
import sharp from "sharp";

// Run only against a disposable, migrated database. No production fallback.
test(
  "database-backed API workflows",
  { skip: !process.env.TEST_DATABASE_URL },
  async (t) => {
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
    process.env.DIRECT_URL = process.env.TEST_DATABASE_URL;
    process.env.NODE_ENV = "test";
    process.env.FRONTEND_URL = "http://localhost:5173";
    process.env.JWT_ACCESS_SECRET =
      "integration-access-secret-with-at-least-32-characters";
    process.env.JWT_REFRESH_SECRET =
      "integration-refresh-secret-with-at-least-32-characters";
    const objects = new Set();
    const storageServer = createServer(async (req, res) => {
      let body = Buffer.alloc(0);
      for await (const part of req) body = Buffer.concat([body, part]);
      res.setHeader("Content-Type", "application/json");
      if (req.method === "POST") {
        assert.ok(body.length > 0);
        objects.add(
          decodeURIComponent(req.url.split("/object/crop-images/")[1]),
        );
        res.end(JSON.stringify({ Key: "uploaded" }));
      } else if (req.method === "DELETE") {
        for (const key of JSON.parse(body).prefixes) objects.delete(key);
        res.end("[]");
      } else res.end("{}");
    });
    await new Promise((r) => storageServer.listen(0, "127.0.0.1", r));
    process.env.SUPABASE_URL = `http://127.0.0.1:${storageServer.address().port}`;
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-storage-adapter-key";
    const { app } = await import("../src/app.js");
    const { db } = await import("../src/config/db.js");
    const pass = "TestPassword-487!";
    const origin = process.env.FRONTEND_URL;
    const api = (method, path, token) => {
      const r = request(app)
        [method]("/api/v1" + path)
        .set("Origin", origin);
      if (token) r.set("Authorization", "Bearer " + token);
      return r;
    };
    let farmer, mao, admin, crop, market, verified, revision;
    try {
      await t.test(
        "registration enforces Farmer role and never returns password hashes",
        async () => {
          const payload = {
            firstName: "Test",
            lastName: "Farmer",
            email: "farmer@integration.example.com",
            password: pass,
            confirmPassword: pass,
            acceptTerms: true,
          };
          assert.equal(
            (
              await api("post", "/auth/register").send({
                ...payload,
                role: "ADMIN",
              })
            ).status,
            422,
          );
          const r = await api("post", "/auth/register").send(payload);
          assert.equal(r.status, 201, JSON.stringify(r.body));
          farmer = r.body.data;
          assert.equal(farmer.user.role, "FARMER");
          assert.equal(farmer.user.passwordHash, undefined);
          assert.match(r.headers["set-cookie"][0], /HttpOnly/);
        },
      );
      await t.test(
        "privileged accounts authenticate against hashed passwords",
        async () => {
          for (const role of ["MAO", "ADMIN"])
            await db.user.create({
              data: {
                firstName: "Test",
                lastName: role,
                email: role.toLowerCase() + "@integration.example.com",
                passwordHash: await bcrypt.hash(pass, 12),
                role,
              },
            });
          const m = await api("post", "/auth/login").send({
            email: "mao@integration.example.com",
            password: pass,
          });
          assert.equal(m.status, 200);
          mao = m.body.data;
          const a = await api("post", "/auth/login").send({
            email: "admin@integration.example.com",
            password: pass,
          });
          assert.equal(a.status, 200);
          admin = a.body.data;
        },
      );
      await t.test("Remember me controls refresh-cookie persistence", async () => {
        const temporary = await api("post", "/auth/login").send({
          email: "mao@integration.example.com",
          password: pass,
          rememberMe: false,
        });
        assert.doesNotMatch(temporary.headers["set-cookie"][0], /Max-Age=/i);
        const remembered = await api("post", "/auth/login").send({
          email: "mao@integration.example.com",
          password: pass,
          rememberMe: true,
        });
        assert.match(remembered.headers["set-cookie"][0], /Max-Age=/i);
      });
      await t.test(
        "server rejects public, Farmer, and Admin crop mutations; MAO cannot access Admin",
        async () => {
          assert.equal((await api("post", "/crops").send({})).status, 401);
          for (const token of [farmer.accessToken, admin.accessToken])
            assert.equal(
              (await api("post", "/crops", token).send({})).status,
              403,
            );
          assert.equal(
            (await api("post", "/prices", farmer.accessToken).send({})).status,
            403,
          );
          for (const token of [farmer.accessToken, mao.accessToken])
            assert.equal(
              (await api("get", "/admin/dashboard", token)).status,
              403,
            );
          assert.equal(
            (await api("get", "/admin/dashboard", admin.accessToken)).status,
            200,
          );
        },
      );
      await t.test(
        "crop creation rejects missing, invalid, and oversized photos",
        async () => {
          const make = () =>
            api("post", "/crops", mao.accessToken)
              .field("name", "Test Rice")
              .field("category", "Grain");
          assert.equal((await make()).status, 422);
          assert.equal(
            (
              await make().attach("photo", Buffer.from("bad"), {
                filename: "bad.svg",
                contentType: "image/svg+xml",
              })
            ).status,
            422,
          );
          assert.equal(
            (
              await make().attach("photo", Buffer.alloc(5 * 1024 * 1024 + 1), {
                filename: "large.png",
                contentType: "image/png",
              })
            ).status,
            422,
          );
        },
      );
      await t.test(
        "valid crop image uploads through Supabase adapter; edit retains or replaces object",
        async () => {
          const photo = await sharp({
            create: { width: 8, height: 8, channels: 3, background: "#228844" },
          })
            .png()
            .toBuffer();
          const r = await api("post", "/crops", mao.accessToken)
            .field("name", "Test Rice")
            .field("category", "Grain")
            .attach("photo", photo, {
              filename: "rice.png",
              contentType: "image/png",
            });
          assert.equal(r.status, 201, JSON.stringify(r.body));
          crop = r.body.data;
          assert.ok(objects.has(crop.imagePath));
          const old = crop.imagePath;
          const same = await api("patch", "/crops/" + crop.id, mao.accessToken)
            .field("name", "Test Rice")
            .field("category", "Grain");
          assert.equal(same.status, 200);
          assert.equal(same.body.data.imagePath, old);
          const changed = await api(
            "patch",
            "/crops/" + crop.id,
            mao.accessToken,
          )
            .field("name", "Test Rice")
            .field("category", "Grain")
            .attach("photo", photo, {
              filename: "rice.png",
              contentType: "image/png",
            });
          assert.equal(changed.status, 200);
          assert.notEqual(changed.body.data.imagePath, old);
          assert.ok(!objects.has(old));
          crop = changed.body.data;
        },
      );
      await t.test(
        "MAO creates and updates market; invalid transport cost rejected",
        async () => {
          const payload = {
            name: "Test Market",
            location: "Rizal",
            transportBaseCost: 100,
          };
          assert.equal(
            (
              await api("post", "/markets", mao.accessToken).send({
                ...payload,
                transportBaseCost: -1,
              })
            ).status,
            422,
          );
          const r = await api("post", "/markets", mao.accessToken).send(
            payload,
          );
          assert.equal(r.status, 201);
          market = r.body.data;
          assert.equal(
            (
              await api("patch", "/markets/" + market.id, mao.accessToken).send(
                { ...payload, location: "Jala-Jala" },
              )
            ).status,
            200,
          );
        },
      );
      await t.test(
        "pending quotations are private; approval exposes verified price",
        async () => {
          const r = await api("post", "/prices", mao.accessToken).send({
            cropId: crop.id,
            marketId: market.id,
            price: 50,
            date: "2026-01-01",
            source: "Integration fixture",
          });
          assert.equal(r.status, 201);
          verified = r.body.data;
          assert.equal(
            (await api("get", "/prices/current", farmer.accessToken)).body.data
              .total,
            0,
          );
          assert.equal(
            (
              await api(
                "post",
                `/prices/${verified.id}/approve`,
                mao.accessToken,
              ).send({})
            ).status,
            200,
          );
          assert.equal(
            Number(
              (await api("get", "/prices/current", farmer.accessToken)).body
                .data.items[0].price,
            ),
            50,
          );
        },
      );
      await t.test(
        "editing a verified quotation keeps original public until revision approved",
        async () => {
          const r = await api(
            "patch",
            "/prices/" + verified.id,
            mao.accessToken,
          ).send({
            cropId: crop.id,
            marketId: market.id,
            price: 60,
            date: "2026-01-01",
            source: "Corrected fixture",
          });
          assert.equal(r.status, 200);
          revision = r.body.data;
          assert.notEqual(revision.id, verified.id);
          assert.equal(
            Number(
              (await api("get", "/prices/current", farmer.accessToken)).body
                .data.items[0].price,
            ),
            50,
          );
          assert.equal(
            (
              await api(
                "post",
                `/prices/${revision.id}/approve`,
                mao.accessToken,
              ).send({ reviewNote: "Reviewed" })
            ).status,
            200,
          );
          const rows = (await api("get", "/prices/history", farmer.accessToken))
            .body.data;
          assert.equal(rows.total, 1);
          assert.equal(Number(rows.items[0].price), 60);
          assert.ok(
            (await db.price.findUnique({ where: { id: verified.id } }))
              .supersededAt,
          );
          assert.ok(
            await db.auditLog.findFirst({
              where: { entityId: revision.id, action: "PRICE_APPROVE" },
            }),
          );
        },
      );
      await t.test(
        "rejection requires note and never publishes rejected price",
        async () => {
          const r = await api("post", "/prices", mao.accessToken).send({
            cropId: crop.id,
            marketId: market.id,
            price: 80,
            date: "2026-01-02",
            source: "Rejected fixture",
          });
          assert.equal(
            (
              await api(
                "post",
                `/prices/${r.body.data.id}/reject`,
                mao.accessToken,
              ).send({})
            ).status,
            422,
          );
          assert.equal(
            (
              await api(
                "post",
                `/prices/${r.body.data.id}/reject`,
                mao.accessToken,
              ).send({ reviewNote: "Incorrect source" })
            ).status,
            200,
          );
          assert.equal(
            Number(
              (await api("get", "/prices/current", farmer.accessToken)).body
                .data.items[0].price,
            ),
            60,
          );
        },
      );
      await t.test(
        "recommendation and profit endpoints calculate consistent net earnings",
        async () => {
          const ranked = await api(
            "post",
            "/recommendations",
            farmer.accessToken,
          ).send({ cropId: crop.id, quantity: 100 });
          assert.equal(ranked.status, 200);
          assert.equal(ranked.body.data[0].net, "5900.00");
          const result = await api("post", "/profit", farmer.accessToken).send({
            cropId: crop.id,
            marketId: market.id,
            quantity: 100,
            sellingPrice: 60,
            otherExpenses: 200,
          });
          assert.equal(result.status, 200);
          assert.equal(result.body.data.net, "5700.00");
          assert.equal(result.body.data.margin, "95");
        },
      );
      await t.test(
        "reports aggregate verified records; notifications belong to their recipient",
        async () => {
          const report = await api("get", "/reports", farmer.accessToken);
          assert.equal(report.status, 200);
          assert.equal(report.body.data.summary.highest, 60);
          const n = await api("get", "/notifications", farmer.accessToken);
          assert.ok(n.body.data.items.length > 0);
          const notification = n.body.data.items[0];
          assert.equal(
            (
              await api(
                "patch",
                `/notifications/${notification.id}/read`,
                mao.accessToken,
              )
            ).status,
            404,
          );
          assert.equal(
            (
              await api(
                "patch",
                `/notifications/${notification.id}/read`,
                farmer.accessToken,
              )
            ).status,
            200,
          );
        },
      );
      await t.test(
        "MAO account creation requires Admin password and returns no credentials",
        async () => {
          const payload = {
            firstName: "Second",
            lastName: "MAO",
            email: "second@integration.example.com",
            password: pass,
            currentPassword: "wrong",
          };
          assert.equal(
            (
              await api("post", "/admin/mao-accounts", admin.accessToken).send(
                payload,
              )
            ).status,
            401,
          );
          const r = await api(
            "post",
            "/admin/mao-accounts",
            admin.accessToken,
          ).send({ ...payload, currentPassword: pass });
          assert.equal(r.status, 201);
          assert.equal(r.body.data.role, "MAO");
          assert.equal(r.body.data.passwordHash, undefined);
        },
      );
      await t.test(
        "snapshot restore validates complete payload and merges transactionally",
        async () => {
          const backup = await api(
            "post",
            "/admin/backups/export",
            admin.accessToken,
          ).send({ currentPassword: pass });
          assert.equal(backup.status, 200);
          assert.equal(backup.body.data.users, undefined);
          const before = await db.price.count();
          assert.equal(
            (
              await api(
                "post",
                "/admin/backups/restore",
                admin.accessToken,
              ).send({
                currentPassword: pass,
                confirmation: "RESTORE AGRICULTURAL DATA",
                snapshot: {},
              })
            ).status,
            422,
          );
          assert.equal(await db.price.count(), before);
          const restore = await api(
            "post",
            "/admin/backups/restore",
            admin.accessToken,
          ).send({
            currentPassword: pass,
            confirmation: "RESTORE AGRICULTURAL DATA",
            snapshot: backup.body.data,
          });
          assert.equal(restore.status, 200, JSON.stringify(restore.body));
          assert.equal(await db.price.count(), before);
        },
      );
      await t.test(
        "refresh rotates cookie; replay revokes session family",
        async () => {
          const login = await api("post", "/auth/login").send({
            email: "farmer@integration.example.com",
            password: pass,
          });
          const old = login.headers["set-cookie"][0].split(";")[0];
          const refreshed = await api("post", "/auth/refresh").set(
            "Cookie",
            old,
          );
          assert.equal(refreshed.status, 200);
          assert.notEqual(
            refreshed.headers["set-cookie"][0].split(";")[0],
            old,
          );
          assert.equal(
            (await api("post", "/auth/refresh").set("Cookie", old)).status,
            401,
          );
          assert.equal(
            (await api("get", "/auth/me", refreshed.body.data.accessToken))
              .status,
            401,
          );
        },
      );
      await t.test(
        "suspension immediately invalidates access and rejects subsequent login",
        async () => {
          await db.user.update({
            where: { id: farmer.user.id },
            data: { status: "SUSPENDED" },
          });
          assert.equal(
            (await api("get", "/auth/me", farmer.accessToken)).status,
            401,
          );
          assert.equal(
            (
              await api("post", "/auth/login").send({
                email: "farmer@integration.example.com",
                password: pass,
              })
            ).status,
            401,
          );
        },
      );
    } finally {
      await db.$disconnect();
      await new Promise((r) => storageServer.close(r));
    }
  },
);
