function Block({ className = "" }) { return <span className={`skeleton-block ${className}`.trim()} aria-hidden="true" />; }

export default function PortalSkeleton({ farmer = false }) {
  return (
    <div className={`portal-shell skeleton-shell ${farmer ? "farmer-portal-shell" : ""}`}>
      <aside className="portal-sidebar skeleton-sidebar">
        <div className="skeleton-brand"><Block className="skeleton-logo"/><Block className="skeleton-brand-title"/></div>
        <Block className="skeleton-caption"/>
        {Array.from({length: 7}, (_, i) => <Block className="skeleton-nav" key={i}/>)}
      </aside>
      <div className="portal-main">
        <header className="portal-topbar skeleton-topbar"><Block className="skeleton-page-title"/><Block className="skeleton-user"/></header>
        <main className="portal-content skeleton-content">
          <Block className="skeleton-heading"/><Block className="skeleton-copy"/>
          <div className="skeleton-card-grid">{Array.from({length:4},(_,i)=><Block className="skeleton-card" key={i}/>)}</div>
          <div className="skeleton-panel-grid"><Block className="skeleton-panel"/><Block className="skeleton-panel"/></div>
        </main>
      </div>
      {farmer && <div className="skeleton-bottom-nav">{Array.from({length:5},(_,i)=><Block className="skeleton-bottom-item" key={i}/>)}</div>}
    </div>
  );
}
