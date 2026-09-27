# API integration

OpenAPI: `/api/openapi.json`; interactive Swagger: `/api/docs`.

Base: `/api/v1`. Successful responses use `{success:true,data:...}`. Errors use `{success:false,message,errors:[...]}`. Money from Prisma is serialized as decimal strings. Paginated collections return `items,total,page,limit,pages`, with `limit` capped at 100.

| Group | Access and operations |
|---|---|
| `/auth` | Farmer registration, login with optional Remember me persistence, refresh cookie rotation, logout, me, password change, recovery availability |
| `/crops`, `/markets` | Farmer/MAO reads; MAO-only create, update and archive/activate |
| `/prices` | Current/history reads; MAO pending submissions, revisions and approve/reject |
| `/forecasts` | Stored forecasts for Farmer/MAO; MAO-only `/generate` |
| `/recommendations`, `/profit` | Validated server calculations for Farmer/MAO |
| `/reports`, `/mao/dashboard` | Agricultural aggregation and MAO summary |
| `/users/me` | Own profile and persisted preferences |
| `/notifications` | Recipient-owned pagination, unread count, mark one/all read |
| `/admin` | Account management, audit, security, monitoring, settings, snapshots, contacts |
| `/contact` | Validated, rate-limited public inquiries stored in PostgreSQL |

Write requests from browsers must come from the configured frontend origin. Axios sends credentials; login/refresh responses provide an access token. Refresh/logout cookie operations require Origin, including when using an API client. Admin and MAO permissions are separate, not hierarchical.

Create/update crop requests use multipart field `photo` plus name/category/unit/status. Creation requires a photo. Editing retains the image when the field is omitted. Accepted original formats are JPEG, PNG and WebP, up to 5 MB; the server verifies decoded content and converts to controlled WebP storage objects.

Source records may be entered in their original language. Search terms and filters are query parameters for catalog/price records; personal profile values and credentials belong in request bodies. HTTP logs omit query strings and bodies.
