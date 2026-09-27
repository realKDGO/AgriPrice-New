# AgriPrice MAO Portal Foundation

This branch is prepared for MAO frontend development.

## Reusable foundation
- `src/components/common/Brand.jsx` - AgriPrice logo and portal label
- `PortalSidebar.jsx` / `PortalTopbar.jsx` - shared portal navigation shell
- `PageHeader.jsx` - page title, description, and actions
- `ActionButton.jsx` - primary and secondary actions
- `StatCard.jsx` - dashboard KPI cards
- `Panel.jsx` - reusable content section/card
- `DataTable.jsx` - reusable table wrapper
- `StatusBadge.jsx` - consistent status colors
- `SearchBar.jsx` / `FilterSelect.jsx` - list filtering controls
- `PortalSignIn.jsx` - reusable portal sign-in card
- `PlaceholderPage.jsx` - temporary page scaffold for unfinished routes

## Navigation
Edit `src/config/navigation.js` when adding or renaming portal routes.

## Styling
Shared portal styles are in `src/styles/portal.css`. Reuse these components before creating page-specific copies.

## Branding
`public/agriprice-logo.png` is used throughout the portal and `public/favicon.png` is the browser icon.
