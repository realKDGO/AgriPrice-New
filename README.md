# AgriPrice

> This ZIP is the isolated localhost presentation edition. Start with [LOCAL_PRESENTATION_GUIDE.md](LOCAL_PRESENTATION_GUIDE.md). It uses local PostgreSQL, local image storage, and seeded dummy records. It does not modify the live AgriPrice deployment.

AgriPrice is a React and Express application for crop-price information, historical trends, market comparisons, earnings estimates, and agricultural administration. The supplied AgriPrice interface, logo, favicon, crop photographs, navigation patterns, and starter market data are retained.

## Architecture

- `frontend/`: React, Vite, JavaScript, React Router, Tailwind CSS, Axios, Recharts, Lucide.
- `backend/`: Node.js, Express, Prisma, Zod, bcrypt, JWT, Helmet, CORS, Morgan, rate limiting, OpenAPI.
- `backend/prisma/`: PostgreSQL schema, versioned migration, development seed.
- `docs/`: API, operating decisions, privacy review, and verification notes.
- `database/`: database and Supabase provisioning guidance.

React calls one Axios client. Express validates and authorizes requests, services apply domain rules, and Prisma writes PostgreSQL. Crop uploads pass through Express and are stored in Supabase Storage. Frontend code contains no database credentials or browser-backed record store.

## Prerequisites

Node.js 22 LTS or later, npm, a Supabase project, PostgreSQL migration credentials, and a backend-only Supabase service-role key. Production requires an HTTPS Node host and an HTTPS frontend host. Supabase provides PostgreSQL and Storage; this application uses its own JWT authentication, not Supabase Auth.

## Install and configure

From the project root:

```sh
npm ci
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit both files. Never commit real secrets. Generate **two different** JWT secrets using your secret manager or `openssl rand -hex 48`.

Backend configuration:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Runtime PostgreSQL URL; application schema `agriprice` |
| `DIRECT_URL` | Direct or session-mode PostgreSQL URL for migrations |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Separate random secrets, at least 32 characters |
| `JWT_ACCESS_EXPIRES_IN` | Default `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Default `7d` |
| `FRONTEND_URL` | Exact trusted frontend origin, local default `http://localhost:4173` |
| `SUPABASE_URL` | Your project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend-only Storage credential |
| `SUPABASE_CROP_BUCKET` | Default `crop-images` |
| `PORT` | Default `5000` |
| `NODE_ENV` | `development`, `test`, or `production` |
| `COOKIE_SAME_SITE` | `lax` by default; `none` only for HTTPS cross-site deployment |
| `TRUST_PROXY` | Number of trusted reverse proxies; `0` by default |

Frontend uses only `VITE_API_BASE_URL`, normally `http://localhost:5000/api/v1` locally. It is embedded at build time. Use same-site frontend and API domains where possible; browser restrictions can block third-party cookies even with `SameSite=None`.

## Database and Supabase Storage

Follow [database/README.md](database/README.md) before running migrations against any existing project. Use a separate `agriprice` schema and preserve unrelated public tables.

```sh
npm run db:generate
npm run db:migrate
```

Create a **public-read** `crop-images` bucket with a 5 MB limit and JPEG/PNG/WebP MIME restrictions. Public read does not mean public write. Do not add anonymous or authenticated-client upload policies. Uploads run through MAO-authorized Express endpoints using the server credential. The development sample seed can create this bucket if it is absent.

For development, set your own `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_MAO_EMAIL`, and `SEED_MAO_PASSWORD` in the backend environment. Passwords must be 12–72 bytes. Set `SEED_SAMPLE_DATA=true` to import the eight supplied crop photos, seven markets, 58 price records and 96 historical records. These quotations are starter data, not claims about actual market conditions.

```sh
npm run db:seed
```

The seed is repeatable by stable IDs, does not reset existing account passwords, and refuses production mode. No seed password appears in the UI or source. For production's first Admin, set `ADMIN_EMAIL` and `ADMIN_PASSWORD`, then run:

```sh
npm run bootstrap:admin -w backend
```

The bootstrap refuses to create another Admin once one exists. Remove bootstrap secrets afterward. Create MAO accounts through Admin → MAO Accounts.

## Development

```sh
npm run dev:all
```

Frontend: `http://localhost:4173`. Backend: `http://localhost:5000`. Root `npm run dev` starts only the frontend for preview tooling. Each workspace also has its own `dev` command.

The root URL is the public landing page. Registration creates only Farmer accounts. Protected routes require a real active account. Configure the backend before testing sign-in or data screens.

## Roles

| Role | Responsibilities |
|---|---|
| FARMER | Read verified agricultural information; forecasts, comparisons, estimates, reports, personal settings and notifications |
| MAO | Crop photos and catalog, markets, pending price submissions, validation, history, forecast generation, agricultural reports |
| ADMIN | Farmer/MAO accounts, audit, actual service checks, security events, application snapshots, settings, technical reports, contact inbox |

Admin does not inherit MAO agricultural mutation permissions. Public registration rejects role fields. Sensitive administrative mutations require the Admin's current password. Password hashes are never returned.

## Production build and start

```sh
npm run build
npm run start -w backend
```

Vite produces `frontend/dist/`; the root build also copies the public output to `dist/` for the existing static hosting configuration. Configure static hosting to rewrite application routes to `index.html`. Run Express on a Node host with database connectivity; a static frontend host alone cannot run this backend. Set production environment variables and run migrations in your release process before starting the API. The server checks the database before listening. Frontend and backend may be deployed separately.

`GET /api/health` performs a database check. Admin monitoring additionally probes the configured Storage bucket. API documentation is at `/api/docs`, with the machine-readable document at `/api/openapi.json`.

## Scheduled jobs

Schedule these on the backend host:

```sh
npm run jobs:forecasts -w backend
npm run jobs:storage -w backend
npm run jobs:retention -w backend
```

Forecast generation uses actual verified history and needs at least three monthly buckets. Storage cleanup retries failed old-image deletion. Retention removes expired/revoked refresh sessions after the configured code's 30-day grace period; it does not invent an organizational personal-data retention schedule.

## Tests

```sh
npm test
npm run test -w frontend
npm run db:validate -w backend
```

For API integration tests, first migrate a **disposable** PostgreSQL database, then set `TEST_DATABASE_URL` and run `npm run test:integration -w backend`. The tests insert fixture users and agricultural records and must not target production. They use a local HTTP Storage contract fixture; a real Supabase Storage smoke test is a separate deployment check.

See [docs/QA.md](docs/QA.md) for completed checks and outstanding deployment validation. See [docs/DOMAIN.md](docs/DOMAIN.md) for financial formulas, price revisions, forecasts, and backup limitations.

## Deployment status

The code and migration are provided. Live database credential/schema provisioning and live Storage verification are not completed. Email password-reset delivery is not configured; the recovery screen explains this. Language preferences persist; common navigation and field labels have Filipino translations while source records and explanatory text retain their original wording.

Before collecting production personal data, the operator must complete its identity/contact information, retention schedule, rights-request process, and privacy assessment. Dedicated Privacy, Terms, and Cookie pages are included, with no unsupported certification claims. No optional trackers or consent banner are included because this build uses necessary authentication cookies only.
