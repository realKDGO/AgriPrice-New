import { useState, useMemo } from "react";
import { Download, Search } from "lucide-react";
import AdminHeader from "../../components/common/AdminHeader";

const DEFAULT_LOGS = [
  {
    id: 1,
    account: "Added users record",
    action: "Application activity",
    category: "Application activity",
    dateTime: "2026-09-06 12:31",
    result: "Success",
  },
  {
    id: 2,
    account: "AgriPrice user",
    action: "Added users record",
    category: "Application activity",
    dateTime: "2026-09-06 12:29",
    result: "Success",
  },
  {
    id: 3,
    account: "Juan dela Cruz",
    action: "Signed in to farmer Account",
    category: "Session",
    dateTime: "2026-09-05 08:20",
    result: "Success",
  },
  {
    id: 4,
    account: "Elena Reyes",
    action: "Reviewed price submissions",
    category: "Agricultural data",
    dateTime: "2026-09-05 08:00",
    result: "Success",
  },
  {
    id: 5,
    account: "System Administrator",
    action: "Reviewed account access",
    category: "Administration",
    dateTime: "2026-09-04 15:10",
    result: "Success",
  },
];

export default function AuditLogs() {
  const [logs] = useState(DEFAULT_LOGS);
  const [search, setSearch] = useState("");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = search.toLowerCase();
      return (
        log.account.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.category.toLowerCase().includes(q) ||
        log.dateTime.includes(q)
      );
    });
  }, [logs, search]);

  const handleExportCSV = () => {
    const headers = ["Account", "Action", "Category", "Date & Time", "Result"];
    const rows = filteredLogs.map((log) => [
      `"${log.account}"`,
      `"${log.action}"`,
      `"${log.category}"`,
      `"${log.dateTime}"`,
      `"${log.result}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `agriprice_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <AdminHeader
        title="Activity & Audit Logs"
        subtitle="Recent account and application activity."
      >
        <button
          type="button"
          className="admin-btn-primary"
          onClick={handleExportCSV}
        >
          <Download size={16} strokeWidth={2.2} />
          <span>Export CSV</span>
        </button>
      </AdminHeader>

      {/* Search Bar */}
      <div className="admin-filters-bar">
        <div className="admin-search-wrapper" style={{ maxWidth: "100%" }}>
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search audit activity"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Logs Table Card */}
      <div className="admin-card admin-card--flush">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Action</th>
                <th>Category</th>
                <th>Date & Time</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "var(--admin-text-muted)" }}>
                    No audit logs matching "{search}".
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontWeight: 500 }}>{log.account}</td>
                    <td>{log.action}</td>
                    <td style={{ color: "var(--admin-text-muted)" }}>
                      {log.category}
                    </td>
                    <td style={{ color: "var(--admin-text-muted)" }}>
                      {log.dateTime}
                    </td>
                    <td>
                      <span className="admin-pill admin-pill--success">
                        {log.result}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
