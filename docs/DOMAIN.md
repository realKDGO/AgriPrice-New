# Domain and operating decisions

## Money and market ranking

Transport estimate, preserved from the supplied project:

`round(baseTransportCost × (0.65 + 0.35 × quantityKg / 100))`

The result is rounded to the nearest peso, half up. For 100 kg it equals the market's base transport cost. Zero quantity has zero transport; user calculation requests require positive quantity.

- Gross revenue = quantity × selling price.
- Total expenses = transportation + other expenses.
- Estimated net earnings = gross revenue − total expenses.
- Profit margin = net earnings / gross revenue × 100; undefined when revenue is zero.
- Rankings use descending estimated net earnings; market name breaks ties. No hidden score.

Decimal arithmetic rounds money to two places. User-facing estimates exclude expenses the user has not supplied. The system does not record sales transactions, so reports use Monitored Crops instead of Most Sold Crop.

## Price review

New quotations are PENDING. Only VERIFIED, unsuperseded records are public. Editing a verified record creates a pending revision retaining the original crop, market and record date. The original remains public until approval. A rejected revision leaves the original public. Approval and auditing occur in a serializable transaction; competing updates return a conflict rather than silently overwriting another review. A fresh date should be submitted as a separate quotation.

The latest verified quotation per active crop/market pair is selected by PostgreSQL. Dates and sources remain visible; “current” means latest available, not live streaming. No automatic freshness guarantee is made.

## Forecasts

`forecastService` exposes generate/read/latest boundaries. The initial method is an explicit monthly linear trend, model version `monthly-linear-trend-v1`. It takes verified, unsuperseded records from the last year, aggregates monthly means with equal month weights, fits a least-squares line, and extrapolates to the next six calendar months. Negative predictions are clamped to zero. At least three monthly observations are required. This baseline does not estimate calibrated uncertainty, so no confidence percentage is shown.

Farmer controls offer exactly 1, 3, and 6 months. MAO can generate forecasts; a scheduled job uses the same service. New verified quotations mark affected forecasts stale. Farmer GET requests do not silently run a model or create records.

## Sessions and administration

Bcrypt uses cost 12 and limits passwords to 72 UTF-8 bytes. Access JWTs are kept in memory; refresh JWTs use a restricted HttpOnly cookie, hashed database session records, rotation and replay revocation. Selecting Remember me gives that cookie its configured lifetime; otherwise it is a browser-session cookie. Every protected request checks the account and session in PostgreSQL. Logout, password changes, and suspension revoke sessions. The system idle timeout defaults to 30 minutes and is Admin-configurable from 5 to 240 minutes.

Account management cannot change a user's role through profile payloads. The dedicated MAO creation route requires Admin re-authentication. First-Admin provisioning is a separate operator command. The system does not email password-reset links without a delivery service.

## Snapshots

Admin export creates an application-level agricultural snapshot: crops, markets and price records. It excludes passwords, accounts, sessions, contact messages and image binaries. It is not a complete PostgreSQL or Supabase platform backup.

Restore requires Admin access, current password, and `RESTORE AGRICULTURAL DATA`. The server validates schema, limits, stable IDs, image bucket paths and references. A serializable transaction merges by ID and updates matching agricultural records; unrelated records and audit history remain. Any constraint violation rolls back the operation. Image objects must already exist in the configured bucket. This workflow is not a point-in-time recovery substitute.

## Dependency maintenance

The lockfile pins the reviewed runtime dependencies. Prisma 6.12 avoids the affected configuration dependency described in [GHSA-ggr8-5vv4-36mx](https://github.com/advisories/GHSA-ggr8-5vv4-36mx). Image handling uses sharp 0.35.4 following the [upstream image-library advisory](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c). Keep dependency auditing in the release process; a clean package advisory scan is not a general application-security assessment.
