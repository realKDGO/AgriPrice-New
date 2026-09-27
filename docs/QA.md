# Verification record — September 11, 2026

## Completed

- Vite production build succeeds; route/chart bundles are split and the original image assets resolve.
- Prisma schema validation and client generation succeed.
- Express starts successfully against the isolated database; `/api/health` returns HTTP 200 with API and database available.
- The supplied SQL migration applies successfully to a disposable PostgreSQL-compatible PGlite instance, accessed by the real Prisma client over the PostgreSQL wire protocol. This verifies the migration/application path in isolation, not a live Supabase migration.
- 19 backend domain/security unit tests pass: role matrix, origin protection, image validation, monetary arithmetic, ranking, forecast input requirements and result structure.
- 17 database-backed API workflow cases pass: Farmer-only registration, hashed-password login, Remember me cookie persistence, server role restrictions, required/invalid/oversized/valid crop images, image replacement cleanup, market create/update validation, pending/public price separation, revision approval, rejection notes, financial endpoints, reports, notification ownership, Admin password confirmation, snapshot validation/restore, refresh rotation/replay and suspended-account rejection.
- The API test harness uses a local HTTP endpoint implementing the Supabase Storage request contract. It tests the real upload adapter and database save/cleanup flow. It does not certify a live Supabase bucket upload.
- 5 frontend interaction tests pass: registration fields/consent/no role selector, password mismatch, accessible password visibility, exactly three forecast horizon buttons, and correct record action targets in both table/card rendering.
- Landing and Privacy Policy were inspected in the live browser preview at 1363 px. Each had one main H1, no missing image alt attributes and no page-width overflow. Footer privacy navigation resolved correctly.
- Source review confirms no active mock repository, localStorage database, sessionStorage authentication, browser alert/confirm/prompt, or frontend service-role/JWT secret values.
- All eight original crop photographs decode as JPEG; the supplied logo/favicons/apple-touch icon remain in frontend public assets.

## Remaining deployment acceptance

1. Authorize the target Supabase project and its dedicated database credentials/schema permissions; configure backend secrets and migrate the live database.
2. Verify a real Supabase Storage create/replace/delete workflow and seed original images if starter data is desired.
3. Run the full workflow suite against the deployment's real PostgreSQL version, including simultaneous approval/refresh contention. PGlite is single-process and does not substitute for production concurrency testing.
4. Validate frontend/API HTTPS origins, cookie behavior, CORS, proxy trust, cloud health checks, scheduled jobs, and startup on the selected Node host.
5. Complete authenticated visual QA and keyboard/screen-reader acceptance across the requested 320–1920 px matrix. Fluid layouts, mobile cards/drawers/bottom navigation are implemented, but the entire device matrix has not been browser-verified here.
6. Finalize operator identity/contact, privacy retention and rights-request procedures before production personal-data collection.

No production-ready certification, live service health, or full accessibility-conformance claim is made by these checks.
