# PostgreSQL and Supabase setup

Use a dedicated Supabase project or the private `agriprice` schema in an approved existing project. The migration creates application tables in the Prisma connection's selected schema. Do not point it at `public` if existing tables have similar names.

Obtain the exact connection URLs from the Supabase Connect panel. Runtime transaction-pooler URLs should include `pgbouncer=true`; migrations require a direct or session-mode connection. Keep `schema=agriprice` on both. Use TLS in production and URL-encode special characters in passwords.

The migration owner needs permission to create the schema and its objects. Application tables enable Row Level Security with no public policies and revoke PUBLIC privileges. A dedicated table-owning application role can use Prisma while browser Data API roles cannot. Do not add `agriprice` to Supabase's exposed Data API schemas. Do not grant anon/authenticated access to application tables. Separate migration and runtime credentials may be introduced with carefully reviewed grants/RLS policies.

Review existing data and take a platform backup before a real migration. The repository does not contain a database-login creation password or an automatic permission-changing provisioning script. Create appropriate credentials in an approved administrative setup flow and store them only in backend secrets.

## Storage

Bucket: `crop-images`, public read, maximum 5 MB, JPEG/PNG/WebP only. No client write policy. Express checks MAO authorization before reading multipart uploads, checks size/MIME/extension/decoded format, strips metadata, normalizes to WebP, and assigns a UUID object path. Database records contain URL/path only.

Edits upload first, commit the record, then remove the old object. If the record save fails, the new object is removed. Failed deletions enter `StorageCleanup` for retry. Platform backups and Storage-object backups are still the operator's responsibility.

## Data design

Money uses PostgreSQL DECIMAL and Prisma Decimal. Prices have crop/market/date and status/date indexes. Partial unique indexes permit only one current verified record per crop/market/date and one pending replacement per original. Lowercased crop and market names are unique. PostgreSQL checks prohibit negative prices/costs and invalid forecast horizons.

Historical reads use VERIFIED records with `supersededAt IS NULL`. Old superseded versions remain available in the database for audit continuity. An approval transaction updates the new quotation, supersedes the old revision, records the audit event, marks forecasts stale, and emits recipient-owned notifications.

The `User`, `RefreshSession`, `UserPreference`, `Crop`, `Market`, `Price`, `Forecast`, `Notification`, `AuditLog`, `ContactMessage`, `SystemSetting`, and `StorageCleanup` tables are defined in `backend/prisma/schema.prisma`.
