# Implementation scope

The supplied ZIP defines the visual reference and starter agricultural dataset. The rebuilt monorepo retains forest green/off-white styling, original images and icons, split authentication layout, public sections, Farmer bottom navigation, and management drawers. All active data mutation paths use Express and PostgreSQL; the original browser repository and simulated Admin state are removed.

Implemented areas: public contact and legal pages; Farmer-only registration and authenticated routing; rotating JWT sessions; required crop uploads; MAO catalog/market/price validation; stored baseline forecasts; database reports; transparent server financial calculations; account preferences and notifications; Admin accounts/audit/health/security/snapshots/settings/contact inbox.

Operational boundaries: live Supabase provisioning is awaiting explicit project authorization and credentials; Storage contract tests are not a live cloud upload; no email-reset provider is configured; Filipino covers common UI labels rather than every paragraph; full multi-device/screen-reader acceptance requires deployment testing. No real sales volume exists. Starter data is explicitly a development import. Application exports are agricultural snapshots rather than platform backups.
