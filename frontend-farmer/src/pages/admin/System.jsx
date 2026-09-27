import { useState } from "react";
import {
  PageHead,
  Panel,
  Records,
  SearchBox,
  Select,
  Badge,
  Field,
  Modal,
} from "../../components/common/UI";
import { QueryState, Pagination } from "../../components/common/Async";
import { Settings } from "../farmer/Account";
import { useApp } from "../../hooks/useApp";
import { useQuery } from "../../hooks/useQuery";
import { get, post, patch, errorMessage } from "../../services/api";
import { downloadCSV, downloadJSON } from "../../utils/format";
const auditColumns = [
  { key: "action", label: "Action" },
  {
    key: "actor",
    label: "Account",
    render: (r) =>
      r.actor ? `${r.actor.firstName} ${r.actor.lastName}` : "System / Unknown",
  },
  {
    key: "createdAt",
    label: "Date",
    render: (r) => new Date(r.createdAt).toLocaleString(),
  },
  { key: "status", label: "Result" },
];
export function Access() {
  return (
    <>
      <PageHead title="Roles & Access" />
      <Panel>
        <Records
          rows={[
            {
              id: "FARMER",
              role: "Farmer",
              access:
                "Read agricultural information and use decision-support tools.",
            },
            {
              id: "MAO",
              role: "MAO",
              access:
                "Manage crops, markets, prices, validation and agricultural reports.",
            },
            {
              id: "ADMIN",
              role: "Admin",
              access:
                "Manage accounts, system settings, security, audit and recovery.",
            },
          ]}
          columns={[
            { key: "role", label: "Role" },
            { key: "access", label: "Responsibilities" },
          ]}
        />
      </Panel>
      <p>
        Roles have separate permissions. Farmer accounts keep their Farmer role.
      </p>
    </>
  );
}
export function Audit() {
  const [search, setSearch] = useState(""),
    [page, setPage] = useState(1);
  const query = useQuery(
    () => get("/admin/audit", { page, search }),
    [page, search],
  );
  return (
    <>
      <PageHead
        title="Audit Logs"
        action={
          <button
            className="button"
            disabled={!query.data?.items.length}
            onClick={() =>
              downloadCSV(
                `agriprice-audit-page-${page}`,
                query.data.items.map((r) => ({
                  action: r.action,
                  entity: r.entityType,
                  date: r.createdAt,
                  status: r.status,
                  actor: r.actor
                    ? `${r.actor.firstName} ${r.actor.lastName}`
                    : "Unknown",
                })),
              )
            }
          >
            Export Displayed Records
          </button>
        }
      />
      <SearchBox
        value={search}
        onChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
      />
      <QueryState query={query}>
        <Panel>
          <Records rows={query.data?.items || []} columns={auditColumns} />
        </Panel>
        <Pagination data={query.data} onPage={setPage} />
      </QueryState>
    </>
  );
}
export function Monitoring() {
  const query = useQuery(() => get("/admin/monitoring"));
  return (
    <>
      <PageHead
        title="System Monitoring"
        action={
          <button
            className="button"
            disabled={query.loading}
            onClick={query.reload}
          >
            Refresh Status
          </button>
        }
      />
      <QueryState query={query}>
        <Panel>
          {query.data?.services.map((s) => (
            <div className="monitor-row" key={s.name}>
              <h3>{s.name}</h3>
              <Badge>{s.status}</Badge>
            </div>
          ))}
          <p>
            Checked{" "}
            {query.data && new Date(query.data.checkedAt).toLocaleString()}
          </p>
        </Panel>
      </QueryState>
    </>
  );
}
export function Security() {
  const query = useQuery(() => get("/admin/security"));
  return (
    <>
      <PageHead title="Security" />
      <QueryState query={query}>
        <Panel>
          <dl className="result-lines">
            <div>
              <dt>Active Farmer Accounts</dt>
              <dd>{query.data?.summary.activeFarmers}</dd>
            </div>
            <div>
              <dt>Active MAO Accounts</dt>
              <dd>{query.data?.summary.activeMao}</dd>
            </div>
            <div>
              <dt>Suspended Accounts</dt>
              <dd>{query.data?.summary.suspended}</dd>
            </div>
            <div>
              <dt>Failed Sign-ins in the Last 24 Hours</dt>
              <dd>{query.data?.summary.failures}</dd>
            </div>
          </dl>
        </Panel>
        <Panel>
          <h2>Recent Security Events</h2>
          <Records
            rows={query.data?.events || []}
            columns={auditColumns.filter((c) => c.key !== "actor")}
          />
        </Panel>
      </QueryState>
    </>
  );
}
export function Configuration() {
  const { notify } = useApp();
  const query = useQuery(() => get("/admin/settings"));
  const [open, setOpen] = useState(false),
    [value, setValue] = useState(30),
    [password, setPassword] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <>
      <Settings />
      <Panel>
        <h2>System Settings</h2>
        <p>Idle session timeout: {query.data || "…"} minutes.</p>
        <button
          className="button secondary"
          onClick={() => {
            setValue(query.data || 30);
            setPassword("");
            setOpen(true);
          }}
        >
          Edit Session Timeout
        </button>
      </Panel>
      {open && (
        <Modal title="Session Timeout" onClose={() => setOpen(false)}>
          <form
            className="form-stack"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              try {
                await patch("/admin/settings", {
                  sessionTimeout: Number(value),
                  currentPassword: password,
                });
                setOpen(false);
                query.reload();
                notify("System settings saved.");
              } catch (e) {
                notify(errorMessage(e));
              } finally {
                setBusy(false);
              }
            }}
          >
            <Field label="Idle Timeout (minutes)">
              <input
                type="number"
                required
                min="5"
                max="240"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </Field>
            <Field label="Your Admin Password">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <button className="button" disabled={busy}>
              Save Changes
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
export function Backups() {
  const { notify } = useApp();
  const [mode, setMode] = useState(""),
    [password, setPassword] = useState(""),
    [phrase, setPhrase] = useState(""),
    [file, setFile] = useState(null),
    [busy, setBusy] = useState(false);
  async function run(e) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "export")
        downloadJSON(
          "agriprice-agricultural-snapshot",
          await post("/admin/backups/export", { currentPassword: password }),
        );
      else {
        if (!file || file.size > 10 * 1024 * 1024)
          throw new Error("Choose a JSON snapshot under 10 MB.");
        const snapshot = JSON.parse(await file.text());
        await post("/admin/backups/restore", {
          currentPassword: password,
          confirmation: phrase,
          snapshot,
        });
      }
      setMode("");
      notify(mode === "export" ? "Snapshot downloaded." : "Snapshot restored.");
    } catch (e) {
      notify(e.response ? errorMessage(e) : e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHead title="Backup & Recovery" />
      <Panel>
        <h2>Agricultural Data Snapshot</h2>
        <p>
          Export crop, market, and price records. The snapshot excludes
          passwords, sessions, account data, and image files.
        </p>
        <div className="row-actions">
          <button
            className="button"
            onClick={() => {
              setMode("export");
              setPassword("");
            }}
          >
            Export Snapshot
          </button>
          <button
            className="button secondary"
            onClick={() => {
              setMode("restore");
              setPassword("");
              setPhrase("");
              setFile(null);
            }}
          >
            Restore Snapshot
          </button>
        </div>
      </Panel>
      <p className="notice">
        Database-wide recovery and image backups are managed separately by the
        hosting provider. Restoring merges records by their IDs and overwrites
        matching agricultural records. Unrelated records and audit history
        remain.
      </p>
      {mode && (
        <Modal
          title={
            mode === "export" ? "Export Snapshot" : "Restore Agricultural Data"
          }
          onClose={() => setMode("")}
        >
          <form className="form-stack" onSubmit={run}>
            <Field label="Your Admin Password">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            {mode === "restore" && (
              <>
                <Field label="Snapshot File">
                  <input
                    type="file"
                    required
                    accept="application/json,.json"
                    onChange={(e) => setFile(e.target.files?.[0])}
                  />
                </Field>
                <Field label="Type RESTORE AGRICULTURAL DATA to confirm">
                  <input
                    required
                    value={phrase}
                    onChange={(e) => setPhrase(e.target.value)}
                  />
                </Field>
                <p>
                  Matching records will be overwritten. Forecasts will need
                  regeneration.
                </p>
              </>
            )}
            <button className="button" disabled={busy}>
              {busy
                ? "Processing…"
                : mode === "export"
                  ? "Download Snapshot"
                  : "Restore Snapshot"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
export function TechnicalReports() {
  const [type, setType] = useState("users"),
    [page, setPage] = useState(1);
  const query = useQuery(() => get(`/admin/${type}`, { page }), [type, page]);
  const columns =
    type === "audit"
      ? auditColumns
      : [
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "status", label: "Status" },
        ];
  return (
    <>
      <PageHead
        title="Technical Reports"
        action={
          <button
            className="button"
            disabled={!query.data?.items.length}
            onClick={() =>
              downloadCSV(
                `agriprice-${type}-page-${page}`,
                query.data.items.map((r) =>
                  type === "audit"
                    ? { action: r.action, date: r.createdAt, status: r.status }
                    : {
                        name: r.name,
                        role: r.role,
                        status: r.status,
                        lastLogin: r.lastLoginAt,
                      },
                ),
              )
            }
          >
            Export Displayed Records
          </button>
        }
      />
      <Select
        label="Report"
        value={type}
        onChange={(v) => {
          setType(v);
          setPage(1);
        }}
        options={[
          { id: "users", name: "Farmer Account Summary" },
          { id: "mao-accounts", name: "MAO Account Summary" },
          { id: "audit", name: "System Activity Report" },
        ]}
      />
      <QueryState query={query}>
        <Panel>
          <Records rows={query.data?.items || []} columns={columns} />
        </Panel>
        <Pagination data={query.data} onPage={setPage} />
      </QueryState>
    </>
  );
}
export function Contacts() {
  const { notify } = useApp();
  const [page, setPage] = useState(1),
    [selected, setSelected] = useState(null);
  const query = useQuery(() => get("/admin/contacts", { page }), [page]);
  return (
    <>
      <PageHead title="Contact Inbox" />
      <QueryState query={query}>
        <Panel>
          <Records
            rows={query.data?.items || []}
            columns={[
              { key: "subject", label: "Subject" },
              { key: "name", label: "Sender" },
              {
                key: "createdAt",
                label: "Date",
                render: (r) => new Date(r.createdAt).toLocaleString(),
              },
              { key: "status", label: "Status" },
            ]}
            actions={(r) => (
              <button
                className="button secondary small"
                onClick={() => setSelected(r)}
              >
                Read Message
              </button>
            )}
          />
        </Panel>
        <Pagination data={query.data} onPage={setPage} />
      </QueryState>
      {selected && (
        <Modal title={selected.subject} onClose={() => setSelected(null)}>
          <p>
            {selected.name} · {selected.email}
          </p>
          <p style={{ whiteSpace: "pre-wrap" }}>{selected.message}</p>
          <button
            className="button"
            onClick={async () => {
              try {
                await patch(`/admin/contacts/${selected.id}`, {
                  status: "RESOLVED",
                });
                setSelected(null);
                query.reload();
                notify("Message marked as resolved.");
              } catch (e) {
                notify(errorMessage(e));
              }
            }}
          >
            Mark as Resolved
          </button>
        </Modal>
      )}
    </>
  );
}
