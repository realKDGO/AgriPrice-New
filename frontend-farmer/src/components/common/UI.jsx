import { useApp } from "../../hooks/useApp";
import { useEffect, useRef } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  X,
  Search,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="AgriPrice home">
      <img className="brand-logo" src="/images/agriprice-white.png" alt="" />
      <span>AgriPrice</span>
    </Link>
  );
}
export function PageHead({ eyebrow, title, description, action }) {
  const { t } = useApp();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = `${title} | AgriPrice`;
  }, [title]);
  return (
    <div className="page-head">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{t(title)}</h1>
        {description && <p className="muted mt-2">{description}</p>}
      </div>
      <div className="page-head-actions">
        {["Settings", "Notifications"].includes(title) && (
          <button
            className="icon-button mobile-back"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        {action}
      </div>
    </div>
  );
}
export function SectionHead({ title, to, label = "View all", children }) {
  const { t } = useApp();
  return (
    <div className="section-head">
      <h2>{t(title)}</h2>
      {to ? (
        <Link className="text-link" to={to}>
          {label}
          <ArrowRight size={16} />
        </Link>
      ) : (
        children
      )}
    </div>
  );
}
export function Panel({ children, className = "" }) {
  return <section className={`panel ${className}`}>{children}</section>;
}
export function Badge({ children, tone = "" }) {
  return (
    <span
      className={`badge ${tone || (/Pending|Suspended|Rejected/.test(String(children)) ? "warning" : "")}`}
    >
      {children}
    </span>
  );
}
export function Change({ value }) {
  const Icon = value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus;
  return (
    <span className={`change ${value < 0 ? "down" : ""}`}>
      <Icon size={15} />
      {Math.abs(value).toFixed(1)}%{" "}
      {value > 0 ? "Increase" : value < 0 ? "Decrease" : "Stable"}
    </span>
  );
}
export function Field({ label, children, hint }) {
  const { t } = useApp();
  return (
    <label className="field">
      <span>{t(label)}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function Select({ label, value, onChange, options, ...props }) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value ?? o.id} value={o.value ?? o.id}>
            {o.label ?? o.name}
          </option>
        ))}
      </select>
    </Field>
  );
}
export function SearchBox({ value, onChange, placeholder = "Search records" }) {
  return (
    <div className="search-box" role="search">
      <Search size={18} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className="search-clear"
          aria-label="Clear search"
          onClick={() => onChange("")}
        >
          <X size={17} />
        </button>
      )}
    </div>
  );
}
export function Tabs({ items, value, onChange }) {
  return (
    <div className="tabs" aria-label="View options">
      {items.map((item) => (
        <button
          type="button"
          key={item}
          aria-pressed={value === item}
          className={value === item ? "active" : ""}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
export function Empty({
  title = "No matching records",
  text = "Try changing your search or filters.",
}) {
  return (
    <div className="empty">
      <Search size={26} />
      <h3>{title}</h3>
      <p className="muted">{text}</p>
    </div>
  );
}
export function Stat({ label, value, detail, icon: Icon }) {
  const { t } = useApp();
  return (
    <Panel>
      <div className="stat-label">
        {t(label)}
        {Icon && <Icon size={19} />}
      </div>
      <div className="stat-value">{value}</div>
      {detail && <small className="muted">{detail}</small>}
    </Panel>
  );
}
export function Modal({ title, children, onClose, drawer = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    ref.current.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      className={drawer ? "dialog drawer" : "dialog"}
      onCancel={onClose}
    >
      <div className="dialog-head">
        <h2>{title}</h2>
        <button className="icon-button" aria-label="Close" onClick={onClose}>
          <X size={22} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Records({
  columns,
  rows,
  actions,
  emptyTitle,
  emptyText,
}) {
  const { t } = useApp();
  if (!rows.length) return <Empty title={emptyTitle} text={emptyText} />;
  return (
    <>
      <div className="table-view">
        <table>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col">
                  {t(c.label)}
                </th>
              ))}
              {actions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, rowIndex) => (
              <tr key={r.id}>
                {columns.map((c) => (
                  <td key={c.key}>
                    {c.render ? c.render(r, rowIndex) : r[c.key]}
                  </td>
                ))}
                {actions && (
                  <td>
                    <div className="row-actions">{actions(r)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="record-cards">
        {rows.map((r, rowIndex) => (
          <article className="record-card" key={r.id}>
            {columns.map((c, i) => (
              <div
                key={c.key}
                className={i === 0 ? "record-title" : "record-line"}
              >
                {i > 0 && <span className="muted">{t(c.label)}</span>}
                <span>{c.render ? c.render(r, rowIndex) : r[c.key]}</span>
              </div>
            ))}
            {actions && <div className="row-actions mt-4">{actions(r)}</div>}
          </article>
        ))}
      </div>
    </>
  );
}
export function CardSkeleton() {
  return <div className="skeleton card-skeleton" aria-hidden="true" />;
}
export function TableSkeleton() {
  return <div className="skeleton table-skeleton" aria-hidden="true" />;
}
export function ChartSkeleton() {
  return <div className="skeleton chart-skeleton" aria-hidden="true" />;
}
export function PageLoader() {
  return (
    <div className="loading" role="status">
      <span className="loading-mark" />
      Loading AgriPrice…
    </div>
  );
}
function SkeletonLine({ className = "" }) {
  return <span className={`skeleton ${className}`} />;
}
function FieldSkeleton() {
  return (
    <div className="skeleton-field">
      <SkeletonLine className="skeleton-field-label" />
      <SkeletonLine className="skeleton-field-control" />
    </div>
  );
}
function CropCardSkeleton() {
  return (
    <article className="skeleton-crop-card">
      <div className="skeleton-crop-top">
        <SkeletonLine className="skeleton-crop-image" />
        <SkeletonLine className="skeleton-icon" />
      </div>
      <SkeletonLine className="skeleton-crop-name" />
      <SkeletonLine className="skeleton-crop-market" />
      <SkeletonLine className="skeleton-crop-price" />
      <SkeletonLine className="skeleton-crop-change" />
    </article>
  );
}
function TableSkeletonView() {
  return (
    <section className="skeleton-table">
      <div className="skeleton-table-head">
        <SkeletonLine />
        <SkeletonLine />
        <SkeletonLine />
        <SkeletonLine />
      </div>
      {Array.from({ length: 5 }, (_, index) => (
        <div className="skeleton-table-row" key={index}>
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine />
        </div>
      ))}
    </section>
  );
}
export function PageSkeleton({ variant = "", chrome = false }) {
  const isDashboard = ["/farmer", "/mao", "/admin"].includes(variant);
  const isPrices = variant.includes("prices") || variant.includes("historical");
  const isForecast = variant.includes("forecast");
  const isManagement =
    (variant.includes("/mao") || variant.includes("/admin")) &&
    !variant.includes("settings");
  const isCalculator =
    variant.includes("markets") || variant.includes("profit");
  const isSettings =
    variant.includes("settings") ||
    variant.includes("more") ||
    variant.includes("notifications");
  const content = isDashboard ? (
    <>
      <section className="skeleton-dashboard-welcome">
        <SkeletonLine className="skeleton-heading" />
        <SkeletonLine className="skeleton-copy" />
      </section>
      <section className="skeleton-featured">
        <div className="skeleton-featured-info">
          <SkeletonLine className="skeleton-chip" />
          <div className="skeleton-crop-identity">
            <SkeletonLine className="skeleton-crop-image" />
            <div>
              <SkeletonLine className="skeleton-crop-name" />
              <SkeletonLine className="skeleton-crop-market" />
            </div>
          </div>
          <SkeletonLine className="skeleton-price-label" />
          <SkeletonLine className="skeleton-crop-price" />
        </div>
        <div className="skeleton-featured-chart">
          <SkeletonLine className="skeleton-section-label" />
          <SkeletonLine className="skeleton-chart-line" />
          <SkeletonLine className="skeleton-button" />
        </div>
      </section>
      <section className="skeleton-dashboard-panels">
        <div className="skeleton-panel-row">
          <SkeletonLine className="skeleton-round-icon" />
          <div>
            <SkeletonLine className="skeleton-crop-name" />
            <SkeletonLine className="skeleton-copy" />
          </div>
        </div>
        <div className="skeleton-best-market">
          <SkeletonLine className="skeleton-crop-name" />
          <div>
            <SkeletonLine />
            <SkeletonLine />
            <SkeletonLine />
          </div>
          <SkeletonLine className="skeleton-button" />
        </div>
      </section>
    </>
  ) : isPrices ? (
    <>
      <section className="skeleton-tabs">
        <SkeletonLine />
        <SkeletonLine />
      </section>
      <section className="skeleton-filter-bar">
        <FieldSkeleton />
        <FieldSkeleton />
        <FieldSkeleton />
      </section>
      <section className="skeleton-crop-grid">
        {Array.from({ length: 8 }, (_, index) => (
          <CropCardSkeleton key={index} />
        ))}
      </section>
    </>
  ) : isForecast ? (
    <>
      <section className="skeleton-forecast-controls">
        <FieldSkeleton />
        <div>
          <SkeletonLine className="skeleton-field-label" />
          <SkeletonLine className="skeleton-segment" />
        </div>
      </section>
      <section className="skeleton-forecast-grid">
        <div className="skeleton-chart-card">
          <SkeletonLine className="skeleton-crop-name" />
          <SkeletonLine className="skeleton-chart-line tall" />
        </div>
        <div className="skeleton-summary-card">
          <SkeletonLine className="skeleton-crop-name" />
          <SkeletonLine className="skeleton-summary-item" />
          <SkeletonLine className="skeleton-summary-item" />
          <SkeletonLine className="skeleton-summary-item" />
        </div>
      </section>
      <TableSkeletonView />
    </>
  ) : isManagement ? (
    <>
      <section className="skeleton-page-heading">
        <SkeletonLine className="skeleton-heading" />
        <SkeletonLine className="skeleton-copy" />
      </section>
      <section className="skeleton-filter-bar management">
        <FieldSkeleton />
        <FieldSkeleton />
      </section>
      <TableSkeletonView />
    </>
  ) : isCalculator ? (
    <>
      <section className="skeleton-calculator">
        <div>
          <SkeletonLine className="skeleton-crop-name" />
          <div className="skeleton-form-grid">
            <FieldSkeleton />
            <FieldSkeleton />
            <FieldSkeleton />
            <FieldSkeleton />
          </div>
        </div>
        <div className="skeleton-summary-card">
          <SkeletonLine className="skeleton-round-icon" />
          <SkeletonLine className="skeleton-crop-name" />
          <SkeletonLine className="skeleton-summary-item" />
          <SkeletonLine className="skeleton-summary-item" />
        </div>
      </section>
      <TableSkeletonView />
    </>
  ) : isSettings ? (
    <>
      <section className="skeleton-page-heading">
        <SkeletonLine className="skeleton-heading" />
        <SkeletonLine className="skeleton-copy" />
      </section>
      <section className="skeleton-settings-grid">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="skeleton-setting-card" key={index}>
            <SkeletonLine className="skeleton-round-icon" />
            <div>
              <SkeletonLine className="skeleton-crop-name" />
              <SkeletonLine className="skeleton-copy" />
            </div>
          </div>
        ))}
      </section>
    </>
  ) : (
    <>
      <section className="skeleton-page-heading">
        <SkeletonLine className="skeleton-heading" />
        <SkeletonLine className="skeleton-copy" />
      </section>
      <section className="skeleton-filter-bar">
        <FieldSkeleton />
        <FieldSkeleton />
      </section>
      <TableSkeletonView />
    </>
  );
  return (
    <section
      className={`page-skeleton ${chrome ? "page-skeleton-chrome" : ""}`}
      role="status"
      aria-label="Loading page"
    >
      {chrome && (
        <header className="skeleton-public-header">
          <Brand />
          <SkeletonLine className="skeleton-public-actions" />
        </header>
      )}
      {content}
    </section>
  );
}
