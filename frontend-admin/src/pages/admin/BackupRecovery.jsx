import { useState } from "react";
import { Database } from "lucide-react";
import AdminHeader from "../../components/common/AdminHeader";

export default function BackupRecovery() {
  const [snapshot, setSnapshot] = useState(
    localStorage.getItem("agriprice_last_snapshot") || null
  );

  const handleCreateBackup = () => {
    const backupData = {
      version: "2.0.0",
      timestamp: new Date().toISOString(),
      source: "AgriPrice Presentation System",
      records: {
        totalUsers: 10,
        activeMao: 2,
        studyMunicipality: "Jala-Jala, Rizal",
        sessionTimeout: 30,
      },
    };

    const dateStr = new Date().toLocaleString();
    localStorage.setItem("agriprice_last_snapshot", dateStr);
    setSnapshot(dateStr);

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `agriprice_backup_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <AdminHeader
        title="Backup & Recovery"
        subtitle="Save and restore browser-local Current records."
      >
        <button
          type="button"
          className="admin-btn-primary"
          onClick={handleCreateBackup}
        >
          <Database size={16} strokeWidth={2.2} />
          <span>Create backup file</span>
        </button>
      </AdminHeader>

      {/* Snapshot Card */}
      <div className="admin-card" style={{ marginBottom: "18px" }}>
        <h2 className="admin-card-header__title" style={{ marginBottom: "8px" }}>
          Latest local snapshot
        </h2>
        <div style={{ fontSize: "13.5px", color: "var(--admin-text-muted)" }}>
          {snapshot
            ? `Snapshot saved: ${snapshot}`
            : "No snapshot saved in this browser."}
        </div>
      </div>

      {/* Notice below */}
      <p style={{ fontSize: "13px", color: "var(--admin-text-muted)", margin: "0", lineHeight: 1.5 }}>
        This backup file contains the records available in this application.
        Database backups and recovery are not connected.
      </p>
    </div>
  );
}
