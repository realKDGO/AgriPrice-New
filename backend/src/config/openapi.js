const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const str = { type: "string" },
  uuid = { type: "string", format: "uuid" },
  number = { type: "number", minimum: 0 };
const object = (properties, required = Object.keys(properties)) => ({
  type: "object",
  additionalProperties: false,
  properties,
  required,
});
const schemas = {
  Error: object(
    {
      success: { type: "boolean", example: false },
      message: str,
      errors: { type: "array", items: object({ field: str, message: str }) },
    },
    ["success", "message"],
  ),
  Register: object({
    firstName: str,
    lastName: str,
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 8, maxLength: 72 },
    confirmPassword: str,
    acceptTerms: { type: "boolean", enum: [true] },
  }),
  Recovery: object({ email: { type: "string", format: "email" } }),
  ContactStatus: object({
    status: { type: "string", enum: ["READ", "RESOLVED"] },
  }),
  Login: object(
    {
      email: { type: "string", format: "email" },
      password: str,
      rememberMe: { type: "boolean", default: false },
    },
    ["email", "password"],
  ),
  Profile: object({
    firstName: str,
    lastName: str,
    email: str,
    currentPassword: str,
  }),
  Password: object({
    currentPassword: str,
    newPassword: { type: "string", minLength: 8, maxLength: 72 },
    confirmPassword: str,
  }),
  Crop: object(
    {
      name: str,
      category: { type: "string", enum: ["Grain", "Vegetable", "Fruit"] },
      unit: { type: "string", enum: ["kg"] },
      status: { type: "string", enum: ["ACTIVE", "ARCHIVED"] },
      photo: { type: "string", format: "binary" },
    },
    ["name", "category", "photo"],
  ),
  Market: object(
    {
      name: str,
      location: str,
      transportBaseCost: number,
      distanceKm: { ...number, nullable: true },
      status: { type: "string", enum: ["ACTIVE", "ARCHIVED"] },
    },
    ["name", "location", "transportBaseCost"],
  ),
  Price: object({
    cropId: uuid,
    marketId: uuid,
    price: { type: "number", exclusiveMinimum: true, minimum: 0 },
    date: { type: "string", format: "date" },
    source: str,
  }),
  Review: object({ reviewNote: { type: "string", maxLength: 1000 } }, []),
  Rejection: object({
    reviewNote: { type: "string", minLength: 1, maxLength: 1000 },
  }),
  Recommendation: object(
    {
      cropId: uuid,
      quantity: { type: "number", minimum: 0, exclusiveMinimum: true },
      otherExpenses: number,
    },
    ["cropId", "quantity"],
  ),
  Profit: object(
    {
      cropId: uuid,
      marketId: uuid,
      quantity: { type: "number", minimum: 0, exclusiveMinimum: true },
      sellingPrice: number,
      otherExpenses: number,
    },
    ["cropId", "marketId", "quantity", "sellingPrice"],
  ),
  Forecast: object({
    cropId: uuid,
    marketId: uuid,
    horizonMonths: { type: "integer", enum: [1, 3, 6] },
  }),
  Contact: object({
    name: str,
    email: { type: "string", format: "email" },
    subject: str,
    message: { type: "string", minLength: 10, maxLength: 5000 },
  }),
  Preferences: object(
    {
      price: { type: "boolean" },
      forecast: { type: "boolean" },
      market: { type: "boolean" },
      theme: { type: "string", enum: ["light", "dark", "system"] },
      language: { type: "string", enum: ["English", "Filipino"] },
      textSize: { type: "string", enum: ["small", "standard", "large"] },
      defaultCrop: { ...uuid, nullable: true },
    },
    [],
  ),
  AccountCreate: object({
    firstName: str,
    lastName: str,
    email: str,
    password: { type: "string", minLength: 8, maxLength: 72 },
    currentPassword: str,
  }),
  AccountUpdate: object(
    {
      firstName: str,
      lastName: str,
      email: str,
      status: { type: "string", enum: ["ACTIVE", "SUSPENDED", "INACTIVE"] },
      currentPassword: str,
    },
    ["firstName", "lastName", "email", "status"],
  ),
  Status: object({ status: { type: "string", enum: ["ACTIVE", "ARCHIVED"] } }),
  Confirm: object({ currentPassword: str }),
  Restore: object({
    currentPassword: str,
    confirmation: { type: "string", enum: ["RESTORE AGRICULTURAL DATA"] },
    snapshot: {
      type: "object",
      description:
        "JSON returned by /admin/backups/export. Maximum 10 MB. Merge by ID; matching agricultural records are overwritten, unrelated records retained.",
    },
  }),
  Settings: object({
    sessionTimeout: { type: "integer", minimum: 5, maximum: 240 },
    currentPassword: str,
  }),
};
const paths = {};
const pageParams = [
  "page",
  "limit",
  "search",
  "status",
  "category",
  "cropId",
  "marketId",
  "dateFrom",
  "dateTo",
  "trend",
].map((name) => ({
  name,
  in: "query",
  schema:
    name === "page" || name === "limit"
      ? {
          type: "integer",
          minimum: 1,
          maximum: name === "limit" ? 100 : 100000,
        }
      : name.endsWith("Id")
        ? uuid
        : name.startsWith("date")
          ? { type: "string", format: "date" }
          : str,
  description: name === "limit" ? "Default 25, maximum 100." : undefined,
}));
function route(path, method, summary, roles, body, pagination = false) {
  const parameters = [
    ...(path.includes("{id}")
      ? [{ in: "path", name: "id", required: true, schema: uuid }]
      : []),
    ...(pagination ? pageParams : []),
  ];
  const op = {
    summary,
    description: `${roles}. Monetary database values are serialized as decimal strings. All errors use the Error schema.`,
    tags: [path.split("/")[1]],
    security: roles === "Public" ? [] : [{ bearerAuth: [] }],
    parameters,
    responses: {
      200: {
        description:
          "Success envelope: {success:true,data:...}. Paginated collections return data.items,total,page,limit,pages.",
      },
      201: { description: "Created" },
      401: { description: "Authentication required or expired" },
      403: { description: "Role is not permitted" },
      409: { description: "Conflict or concurrent modification" },
      422: {
        description: "Invalid fields",
        content: { "application/json": { schema: ref("Error") } },
      },
      429: { description: "Rate limited" },
      503: { description: "Dependent service unavailable" },
    },
  };
  if (body)
    op.requestBody = {
      required: true,
      content: {
        [body === "Crop" ? "multipart/form-data" : "application/json"]: {
          schema: ref(body),
        },
      },
    };
  if (body === "Crop" && method === "patch") {
    op.description += " Photo replacement is optional for an existing crop.";
    op.requestBody.content["multipart/form-data"].schema = {
      ...schemas.Crop,
      required: ["name", "category"],
    };
  }
  (paths[path] ||= {})[method] = op;
}
route("/auth/register", "post", "Register Farmer", "Public", "Register");
route("/auth/login", "post", "Sign in", "Public", "Login");
route("/auth/refresh", "post", "Rotate refresh token", "Public");
route("/auth/logout", "post", "Revoke session family", "Public");
route("/auth/me", "get", "Current user", "All authenticated roles");
route(
  "/auth/change-password",
  "post",
  "Change password and revoke sessions",
  "All authenticated roles",
  "Password",
);
route(
  "/auth/forgot-password",
  "post",
  "Recovery availability",
  "Public",
  "Recovery",
);
for (const kind of ["crops", "markets"]) {
  const body = kind === "crops" ? "Crop" : "Market";
  route("/" + kind, "get", "List " + kind, "FARMER, MAO", null, true);
  route("/" + kind + "/{id}", "get", "View record", "FARMER, MAO");
  route("/" + kind, "post", "Create record", "MAO only", body);
  route("/" + kind + "/{id}", "patch", "Update record", "MAO only", body);
  route(
    "/" + kind + "/{id}/status",
    "patch",
    "Archive or activate",
    "MAO only",
    "Status",
  );
}
for (const suffix of ["current", "history", "pending", ""])
  route(
    "/prices" + (suffix ? "/" + suffix : ""),
    "get",
    "List prices",
    suffix === "current" || suffix === "history" ? "FARMER, MAO" : "MAO only",
    null,
    true,
  );
route("/prices", "post", "Submit pending price", "MAO only", "Price");
route("/prices/{id}", "patch", "Submit price revision", "MAO only", "Price");
route(
  "/prices/{id}/approve",
  "post",
  "Approve pending price",
  "MAO only",
  "Review",
);
route(
  "/prices/{id}/reject",
  "post",
  "Reject pending price",
  "MAO only",
  "Rejection",
);
route(
  "/recommendations",
  "post",
  "Rank by estimated net return",
  "FARMER, MAO",
  "Recommendation",
);
route("/profit", "post", "Calculate net earnings", "FARMER, MAO", "Profit");
route("/reports", "get", "Agricultural report", "FARMER, MAO", null, true);
route("/forecasts", "get", "Read stored forecast", "FARMER, MAO");
paths["/forecasts"].get.parameters = Object.entries(
  schemas.Forecast.properties,
).map(([name, schema]) => ({ name, in: "query", required: true, schema }));
route(
  "/forecasts/generate",
  "post",
  "Generate forecast from verified history",
  "MAO only",
  "Forecast",
);
route("/mao/dashboard", "get", "Agricultural dashboard", "MAO only");
route(
  "/users/me",
  "patch",
  "Update own profile",
  "All authenticated roles",
  "Profile",
);
route(
  "/users/me/preferences",
  "get",
  "Read preferences",
  "All authenticated roles",
);
route(
  "/users/me/preferences",
  "patch",
  "Save preferences",
  "All authenticated roles",
  "Preferences",
);
route(
  "/notifications",
  "get",
  "Own notifications",
  "All authenticated roles",
  null,
  true,
);
route(
  "/notifications/unread-count",
  "get",
  "Unread count",
  "All authenticated roles",
);
route(
  "/notifications/read-all",
  "patch",
  "Mark all own notifications read",
  "All authenticated roles",
);
route(
  "/notifications/{id}/read",
  "patch",
  "Mark own notification read",
  "All authenticated roles",
);
for (const path of ["dashboard", "monitoring", "security", "settings"])
  route("/admin/" + path, "get", "Read " + path, "ADMIN only");
for (const path of ["users", "mao-accounts", "audit", "contacts"])
  route("/admin/" + path, "get", "List " + path, "ADMIN only", null, true);
for (const path of ["users", "mao-accounts"])
  route(
    "/admin/" + path + "/{id}",
    "patch",
    "Update account; role cannot be changed",
    "ADMIN only",
    "AccountUpdate",
  );
route(
  "/admin/mao-accounts",
  "post",
  "Create MAO account",
  "ADMIN only",
  "AccountCreate",
);
route(
  "/admin/settings",
  "patch",
  "Update idle timeout",
  "ADMIN only",
  "Settings",
);
route(
  "/admin/backups/export",
  "post",
  "Export agricultural snapshot",
  "ADMIN only",
  "Confirm",
);
route(
  "/admin/backups/restore",
  "post",
  "Restore agricultural snapshot",
  "ADMIN only",
  "Restore",
);
route(
  "/admin/contacts/{id}",
  "patch",
  "Update contact status",
  "ADMIN only",
  "ContactStatus",
);
route("/contact", "post", "Store inquiry", "Public", "Contact");
export const openapi = {
  openapi: "3.0.3",
  info: {
    title: "AgriPrice API",
    version: "2.0.0",
    description:
      "Express / Prisma API. Use the access token returned by sign-in as a Bearer token. Refresh tokens are HttpOnly cookies, rotated on refresh. Browser writes require the configured frontend origin; include credentials. Farmer registration rejects role fields. Admin does not inherit MAO mutation permissions. No password reset email is sent by the recovery endpoint.",
  },
  servers: [{ url: "/api/v1" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas,
  },
  paths,
};
