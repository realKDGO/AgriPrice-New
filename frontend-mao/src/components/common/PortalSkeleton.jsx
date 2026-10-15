function Block({ className = "" }) {
  return <span className={`skeleton-block ${className}`.trim()} aria-hidden="true" />;
}

/**
 * PortalSkeleton — Full-screen skeleton shown during auth/route loading.
 *
 * Desktop: classic sidebar + topbar + content grid
 * Mobile (≤680px): horizontal top-bar brand strip + content stacked vertically.
 *                  The desktop sidebar is hidden; a compact mobile nav-bar strip
 *                  is shown at the top instead, matching the actual collapsed layout.
 */
export default function PortalSkeleton({ farmer = false }) {
  return (
    <div className={`portal-shell skeleton-shell ${farmer ? "farmer-portal-shell" : ""}`}>
      {/* ── Desktop sidebar (hidden on mobile via CSS) ────────────── */}
      <aside className="portal-sidebar skeleton-sidebar skeleton-sidebar-desktop">
        <div className="skeleton-brand">
          <Block className="skeleton-logo" />
          <Block className="skeleton-brand-title" />
        </div>
        <Block className="skeleton-caption" />
        {Array.from({ length: 7 }, (_, i) => <Block className="skeleton-nav" key={i} />)}
      </aside>

      {/* ── Mobile top nav bar (shown only on mobile) ─────────────── */}
      <div className="skeleton-mobile-topnav" aria-hidden="true">
        <div className="skeleton-mobile-brand">
          <Block className="skeleton-mobile-logo" />
          <Block className="skeleton-mobile-brand-text" />
        </div>
        <Block className="skeleton-mobile-topnav-action" />
      </div>

      <div className="portal-main">
        {/* Desktop topbar (hidden on mobile) */}
        <header className="portal-topbar skeleton-topbar skeleton-topbar-desktop">
          <Block className="skeleton-page-title" />
          <Block className="skeleton-user" />
        </header>

        {/* Mobile page header bar (shown only on mobile) */}
        <div className="skeleton-mobile-header" aria-hidden="true">
          <Block className="skeleton-mobile-page-title" />
          <Block className="skeleton-mobile-bell" />
        </div>

        <main className="portal-content skeleton-content">
          {/* Heading and sub-copy */}
          <Block className="skeleton-heading" />
          <Block className="skeleton-copy" />

          {/* Desktop: 4-col card grid — Mobile: 2-col grid */}
          <div className="skeleton-card-grid">
            {Array.from({ length: 4 }, (_, i) => <Block className="skeleton-card" key={i} />)}
          </div>

          {/* Desktop: 2-col panel grid — Mobile: stacked */}
          <div className="skeleton-panel-grid">
            <Block className="skeleton-panel" />
            <Block className="skeleton-panel" />
          </div>
        </main>
      </div>

      {farmer && (
        <div className="skeleton-bottom-nav">
          {Array.from({ length: 5 }, (_, i) => <Block className="skeleton-bottom-item" key={i} />)}
        </div>
      )}
    </div>
  );
}
