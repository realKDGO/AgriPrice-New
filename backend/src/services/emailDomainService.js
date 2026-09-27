import { resolve4, resolve6, resolveMx } from "node:dns/promises";
import { domainToASCII } from "node:url";
import { AppError } from "../utils/errors.js";

const reservedSuffixes = new Set([
  "example",
  "invalid",
  "local",
  "localhost",
  "test",
]);
const commonMailDomains = new Set([
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
]);
const cache = new Map();
const CACHE_MS = 10 * 60 * 1000;
const LOOKUP_TIMEOUT_MS = 3500;

const timeout = (promise) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(
      () =>
        reject(
          Object.assign(new Error("DNS lookup timed out."), {
            code: "ETIMEOUT",
          }),
        ),
      LOOKUP_TIMEOUT_MS,
    );
    Promise.resolve(promise).then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });

const expectedDnsFailure = (error) =>
  ["ENODATA", "ENOTFOUND", "ENOENT"].includes(error?.code);

export function emailDomain(email) {
  const raw = email.split("@").at(-1)?.trim().replace(/\.$/, "");
  const domain = domainToASCII(raw || "").toLowerCase();
  const suffix = domain.split(".").at(-1);
  if (!domain || !domain.includes(".") || reservedSuffixes.has(suffix)) return "";
  return domain;
}

async function hasAddressRecord(domain, resolver) {
  const results = await Promise.allSettled([
    timeout(resolver.resolve4(domain)),
    timeout(resolver.resolve6(domain)),
  ]);
  if (results.some((result) => result.status === "fulfilled" && result.value.length))
    return true;
  const unexpected = results.find(
    (result) => result.status === "rejected" && !expectedDnsFailure(result.reason),
  );
  if (unexpected) throw unexpected.reason;
  return false;
}

export async function hasMailDomain(
  email,
  resolver = { resolveMx, resolve4, resolve6 },
) {
  const domain = emailDomain(email);
  if (!domain) return false;

  const cached = cache.get(domain);
  if (resolver.resolveMx === resolveMx && cached?.expiresAt > Date.now())
    return cached.valid;

  let valid;
  try {
    const records = await timeout(resolver.resolveMx(domain));
    // A null MX explicitly states that the domain does not accept email.
    valid = records.some((record) => record.exchange && record.exchange !== ".");
  } catch (error) {
    if (error?.code === "ENODATA") valid = await hasAddressRecord(domain, resolver);
    else if (expectedDnsFailure(error)) valid = false;
    else throw error;
  }

  if (resolver.resolveMx === resolveMx) {
    if (cache.size >= 1000) cache.delete(cache.keys().next().value);
    cache.set(domain, { valid, expiresAt: Date.now() + CACHE_MS });
  }
  return valid;
}

export async function requireValidMailDomain(email) {
  if (!emailDomain(email))
    throw new AppError(422, "Enter an email address with a valid mail domain.", [
      { field: "email", message: "Enter an email address with a valid mail domain." },
    ]);

  // Automated tests use isolated addresses and must not depend on public DNS.
  if (process.env.NODE_ENV === "test") return;

  try {
    if (await hasMailDomain(email)) return;
  } catch {
    if (
      process.env.EMAIL_DOMAIN_CHECK_MODE === "dns_or_common" &&
      commonMailDomains.has(emailDomain(email))
    )
      return;
    throw new AppError(503, "We could not verify this email domain right now.", [
      { field: "email", message: "We could not verify this email domain right now. Try again." },
    ]);
  }
  throw new AppError(422, "Enter an email address with a valid mail domain.", [
    { field: "email", message: "Enter an email address with a valid mail domain." },
  ]);
}
