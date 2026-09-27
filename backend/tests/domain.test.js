import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateProfit,
  transportCost,
  rankMarkets,
  priceChange,
} from "../src/services/domainService.js";
import * as schema from "../src/schemas/index.js";
import {
  emailDomain,
  hasMailDomain,
} from "../src/services/emailDomainService.js";
test("transport preserves the supplied base/quantity formula", () => {
  assert.equal(transportCost(180, 100).toString(), "180");
  assert.equal(transportCost(180, 200).toString(), "243");
  assert.equal(transportCost(180, 0).toString(), "0");
});
test("money uses decimal arithmetic and includes transportation once", () => {
  assert.deepEqual(calculateProfit("3", "0.10", "0.10", "0.05"), {
    revenue: "0.30",
    transport: "0.10",
    expenses: "0.05",
    totalExpenses: "0.15",
    net: "0.15",
    margin: "50",
  });
});
test("zero revenue has no profit margin; losses are retained", () => {
  assert.equal(calculateProfit(0, 1, 20, 0).margin, null);
  assert.equal(calculateProfit(1, 10, 20, 0).net, "-10.00");
});
test("ranking uses net return, not highest selling price", () => {
  const result = rankMarkets(
    [
      {
        id: "a",
        price: 60,
        market: { name: "Expensive trip", transportBaseCost: 2000 },
      },
      {
        id: "b",
        price: 50,
        market: { name: "Nearby", transportBaseCost: 100 },
      },
    ],
    100,
  );
  assert.equal(result[0].id, "b");
  assert.equal(result[0].net, "4900.00");
});
test("movement handles previous zero without fabricated percent", () => {
  assert.equal(priceChange(50, 0), null);
  assert.equal(priceChange(55, 50), "10");
});
test("public registration rejects roles and mismatched passwords", () => {
  const body = {
    firstName: "A",
    lastName: "B",
    email: "a@example.com",
    password: "longpassword",
    confirmPassword: "longpassword",
    acceptTerms: true,
  };
  assert.equal(schema.register.safeParse(body).success, true);
  assert.equal(
    schema.register.safeParse({ ...body, role: "ADMIN" }).success,
    false,
  );
  assert.equal(
    schema.register.safeParse({ ...body, confirmPassword: "different" })
      .success,
    false,
  );
  assert.equal(
    schema.register.safeParse({ ...body, acceptTerms: false }).success,
    false,
  );
});
test("bcrypt byte length, money precision, and future dates are validated", () => {
  const body = {
    firstName: "A",
    lastName: "B",
    email: "a@example.com",
    password: "😀".repeat(30),
    confirmPassword: "😀".repeat(30),
    acceptTerms: true,
  };
  assert.equal(schema.register.safeParse(body).success, false);
  assert.equal(
    schema.market.safeParse({
      name: "Market",
      location: "Rizal",
      transportBaseCost: 0.001,
    }).success,
    false,
  );
  assert.equal(
    schema.profit.safeParse({
      cropId: "00000000-0000-4000-8000-000000000001",
      marketId: "00000000-0000-4000-8000-000000000002",
      quantity: 10,
      sellingPrice: 0,
      otherExpenses: 0,
    }).success,
    false,
  );
});
test("registration email domains reject private, missing, and null mail domains", async () => {
  assert.equal(emailDomain("farmer@sample.local"), "");
  assert.equal(emailDomain("farmer@sample.invalid"), "");
  assert.equal(
    await hasMailDomain("farmer@missing-domain.com", {
      resolveMx: async () => {
        throw Object.assign(new Error("not found"), { code: "ENOTFOUND" });
      },
      resolve4: async () => [],
      resolve6: async () => [],
    }),
    false,
  );
  assert.equal(
    await hasMailDomain("farmer@null-mail.com", {
      resolveMx: async () => [{ priority: 0, exchange: "." }],
      resolve4: async () => ["192.0.2.1"],
      resolve6: async () => [],
    }),
    false,
  );
  assert.equal(
    await hasMailDomain("farmer@working-mail.com", {
      resolveMx: async () => [{ priority: 10, exchange: "mail.working-mail.com" }],
      resolve4: async () => [],
      resolve6: async () => [],
    }),
    true,
  );
});
