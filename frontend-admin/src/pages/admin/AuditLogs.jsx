import { useMemo, useState } from "react";
import "../../styles/audit.css";

const LOGS = [
  { id: 1, account: "AgriPrice user", action: "Added users record", category: "Application activity", at: "2026-09-06 12:31", result: "Success" },
  { id: 2, account: "AgriPrice user", action: "Added users record", category: "Application activity", at: "2026-09-06 12:29", result: "Success" },
  { id: 3, account: "Juan dela Cruz", action: "Signed in to farmer account", category: "Session", at: "2026-09-05 08:20", result: "Success" },
  { id: 4, account: "Elena Reyes", action: "Reviewed price submissions", category: "Agricultural data", at: "2026-09-05 08:00", result: "Success" },
  { id: 5, account: "System Administrator", action: "Reviewed account access", category: "Administration", at: "2026-09-04 15:10", result: "Success" },
];

export default function AuditLogsPage() {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LOGS;
    return LOGS.filter((l) =>
      [l.account, l.action, l.category, l.at, l.result].some((v) => v.toLowerCase().includes(q))
    );
  }, [query]);

  const exportCsv = () => {
    const header = ["Account", "Action", "Category", "Date & Time", "Result"];
    const rows = visible.map((l) => [l.account, l.action, l.category, l.at, l.result]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="audit">
      {/* TOP BAR: edit the title or contents here */}
      <header className="audit-topbar">
        <h1 className="audit-topbar__title">Activity &amp; Audit Logs</h1>
        <button className="audit-icon-btn" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
        </button>
      </header>

      <main className="audit-content">
        <div className="audit-intro">
          <p>Recent account and application activity.</p>
          <button className="audit-btn" onClick={exportCsv}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            Export CSV
          </button>
        </div>

        <label className="audit-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            placeholder="Search audit activity"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <div className="audit-card">
          <table>
            <thead>
              <tr>
                <th>Account</th>
                <th>Action</th>
                <th>Category</th>
                <th>Date &amp; time</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((l) => (
                <tr key={l.id}>
                  <td>{l.account}</td>
                  <td>{l.action}</td>
                  <td>{l.category}</td>
                  <td className="nowrap">{l.at}</td>
                  <td>{l.result}</td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="audit-empty">No activity matches your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
