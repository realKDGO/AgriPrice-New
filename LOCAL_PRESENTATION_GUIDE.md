# AgriPrice Local Presentation Guide

This package is an isolated presentation copy of AgriPrice. It runs the React frontend, Express backend, and a PostgreSQL database on your computer. It does not connect to the live Render backend or the production Supabase database.

## What is included

- Eight supplied crop photos and crop records
- Seven Rizal market records
- Current and historical verified prices
- Pending prices for MAO validation
- Stored 1, 3, and 6 month forecasts
- Farmer notifications and preferences
- Farmer, MAO, Admin, suspended-account, audit, security, and contact records
- Local crop-image upload storage
- Real bcrypt password hashing, JWT authentication, refresh cookies, rate limits, Zod validation, and role authorization
- Duplicate-email and password-confirmation validation

All agricultural values in this package are presentation data. They must not be described as current official prices.

## Requirements

1. Node.js 22 LTS or newer
2. PostgreSQL 16 or newer with pgAdmin
3. npm

XAMPP is not used because AgriPrice uses Node.js, Express, Prisma, and PostgreSQL instead of PHP and MySQL.

## First-time Windows setup

1. Install PostgreSQL and remember the password for the `postgres` user.
   For the simplest local URL, use a password containing letters and numbers. If it contains `@`, `:`, `/`, `#`, or `%`, URL-encode those characters in `backend/.env`.
2. Open pgAdmin.
3. Right-click **Databases**, choose **Create → Database**, and name it:

   ```text
   agriprice_presentation
   ```

   Alternatively, run `database/create-presentation-database.sql` while connected to PostgreSQL's `postgres` maintenance database.

4. Double-click `setup-presentation.cmd`.
5. The first run creates `backend/.env` and opens it in Notepad.
6. Replace both occurrences of `CHANGE_YOUR_POSTGRES_PASSWORD` with your PostgreSQL password, then save the file.
7. Run `setup-presentation.cmd` again. It installs packages, creates the tables, and loads all dummy records.
8. Double-click `start-presentation.cmd`.
9. Open `http://localhost:4173`.

If PowerShell blocks `npm.ps1`, use the included `.cmd` files or Command Prompt. They call `npm.cmd` and do not require changing the PowerShell execution policy.

## Presentation accounts

| Role | Email | Password |
|---|---|---|
| Farmer | `farmer@example.org` | `AgriPriceDemo2026!` |
| MAO | `mao@example.org` | `AgriPriceDemo2026!` |
| Admin | `admin@example.org` | `AgriPriceDemo2026!` |

These credentials exist only in the local presentation database. Password hashes, rather than plain passwords, are stored in PostgreSQL.

Public registration always creates a Farmer. Registering an existing email shows the error beneath the Email Address field. Password length and confirmation errors are also shown beneath their corresponding fields.

New registrations still validate the public mail domain. If the classroom network blocks DNS lookups, common providers such as Gmail, Outlook, Yahoo, iCloud, and Proton remain available for presentation registration. Random domains and private suffixes such as `.local` remain rejected. This checks the domain, not ownership of an individual mailbox.

## Restore the original presentation data

Close the development servers and run:

```text
reset-presentation-data.cmd
```

The reset script refuses to run unless the database host is `localhost` or `127.0.0.1`, the database is named `agriprice_presentation`, and `NODE_ENV` is `development`. It cannot reset the live Supabase database.

## Test on a phone or tablet

1. Connect the computer and mobile device to the same Wi-Fi network.
2. Run `ipconfig` in Command Prompt and find the computer's IPv4 address, such as `192.168.1.25`.
3. Keep `start-presentation.cmd` running.
4. On the mobile device, open:

   ```text
   http://192.168.1.25:4173
   ```

The frontend automatically calls port `5000` using the same hostname. If Windows asks whether Node.js may communicate on private networks, select **Allow**.

For newly uploaded crop photos to display on other devices, update this line in `backend/.env` using the computer's IPv4 address and restart the servers:

```env
LOCAL_STORAGE_PUBLIC_URL=http://192.168.1.25:5000/uploads
```

## Manual commands

```sh
npm ci
npm run presentation:setup
npm run dev:all
```

Frontend: `http://localhost:4173`  
Backend: `http://localhost:5000`  
API health: `http://localhost:5000/api/health`  
API documentation: `http://localhost:5000/api/docs`

## Important separation

- Do not copy the presentation `.env` values into Render.
- Do not point this package at the production Supabase connection string.
- Do not use the presentation credentials in production.
- This package includes the actual backend security boundaries, but its records and credentials are intentionally local and disposable.
