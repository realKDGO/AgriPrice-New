// Local record identity utility.
export function createId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `record-${Date.now()}-${Array.from(crypto.getRandomValues(new Uint32Array(2))).join("-")}`;
}
