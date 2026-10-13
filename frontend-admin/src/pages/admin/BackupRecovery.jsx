import { useState } from "react";
import { Bell, Database } from "lucide-react";
import "../../styles/backup.css";

const SNAPSHOT_KEY = "agriprice:latest-snapshot";

function readSnapshot() {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function collectRecords() {
  const records = {};
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key !== SNAPSHOT_KEY) {
        records[key] = localStorage.getItem(key);
      }
    }
  } catch {
    return records;
  }
  return records;
}

export default function BackupRecovery() {
  const [snapshot, setSnapshot] = useState(readSnapshot);

  const handleCreateBackup = () => {
    const createdAt = new Date().toISOString();
    const records = collectRecords();
    const payload = { createdAt, records };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `agriprice-backup-${createdAt.slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    const saved = { createdAt, count: Object.keys(records).length };
    try {
      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(saved));
    } catch {
      return;
    }
    setSnapshot(saved);
  };

  return (
    <section className="backup">
      <header className="backup__header">
        <h1 className="backup__title">Backup &amp; Recovery</h1>
        <button type="button" className="backup__bell" aria-label="Notifications">
          <Bell size={16} strokeWidth={1.75} />
        </button>
      </header>

      <div className="backup__toolbar">
        <p className="backup__subtitle">Save and restore browser-local Current records.</p>
        <button type="button" className="backup__create" onClick={handleCreateBackup}>
          <Database size={16} strokeWidth={2} />
          Create backup file
        </button>
      </div>

      <div className="backup__body">
        <article className="backup__card">
          <h2 className="backup__card-title">Latest local snapshot</h2>
          <p className="backup__card-text">
            {snapshot
              ? `Saved ${new Date(snapshot.createdAt).toLocaleString()} · ${snapshot.count} records`
              : "No snapshot saved in this browser."}
          </p>
        </article>

        <p className="backup__note">
          This backup file contains the records available in this application. Database backups
          and recovery are not connected.
        </p>
      </div>
    </section>
  );
}
