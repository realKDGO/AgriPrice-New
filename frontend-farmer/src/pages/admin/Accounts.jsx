import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  PageHead,
  Panel,
  Records,
  SearchBox,
  Select,
  Field,
  Modal,
  Badge,
} from "../../components/common/UI";
import { QueryState, Pagination } from "../../components/common/Async";
import { useApp } from "../../hooks/useApp";
import { useQuery } from "../../hooks/useQuery";
import { userService } from "../../services/userService";
import { errorMessage } from "../../services/api";
export default function Accounts({ mao = false }) {
  const { notify } = useApp();
  const [search, setSearch] = useState(""),
    [status, setStatus] = useState(""),
    [page, setPage] = useState(1),
    [edit, setEdit] = useState(null),
    [busy, setBusy] = useState(false);
  const query = useQuery(
    () => userService.list(mao, { page, search, status: status || undefined }),
    [mao, page, search, status],
  );
  useEffect(() => setPage(1), [search, status]);
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const body = {
        firstName: edit.firstName,
        lastName: edit.lastName,
        email: edit.email,
        ...(edit.id ? { status: edit.status } : { password: edit.password }),
        ...(mao ? { currentPassword: edit.currentPassword } : {}),
      };
      await userService.save(mao, edit.id, body);
      setEdit(null);
      query.reload();
      notify("Account saved.");
    } catch (e) {
      notify(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHead
        title={mao ? "MAO Accounts" : "User Accounts"}
        description={
          mao
            ? "Create and manage MAO accounts."
            : "Manage Farmer account details and status."
        }
        action={
          mao && (
            <button
              className="button"
              onClick={() =>
                setEdit({
                  firstName: "",
                  lastName: "",
                  email: "",
                  password: "",
                  currentPassword: "",
                  status: "ACTIVE",
                })
              }
            >
              <Plus size={17} />
              Create MAO Account
            </button>
          )
        }
      />
      <div className="filter-bar">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search name or email"
        />
        <Select
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { id: "", name: "All statuses" },
            ...["ACTIVE", "SUSPENDED", "INACTIVE"].map((id) => ({
              id,
              name: id,
            })),
          ]}
        />
      </div>
      <QueryState query={query}>
        <Panel>
          <Records
            rows={query.data?.items || []}
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email Address" },
              { key: "role", label: "Role" },
              {
                key: "status",
                label: "Status",
                render: (r) => <Badge>{r.status}</Badge>,
              },
              {
                key: "lastLoginAt",
                label: "Last Login",
                render: (r) =>
                  r.lastLoginAt
                    ? new Date(r.lastLoginAt).toLocaleString()
                    : "Never",
              },
            ]}
            actions={(r) => (
              <button
                className="button secondary small"
                onClick={() => setEdit({ ...r, currentPassword: "" })}
              >
                Edit Account
              </button>
            )}
          />
        </Panel>
        <Pagination data={query.data} onPage={setPage} />
      </QueryState>
      {edit && (
        <Modal
          title={edit.id ? "Edit Account" : "Create MAO Account"}
          onClose={() => setEdit(null)}
        >
          <form onSubmit={save} className="form-stack">
            {[
              ["First Name", "firstName", "text"],
              ["Last Name", "lastName", "text"],
              ["Email Address", "email", "email"],
              ...(!edit.id
                ? [["Initial Password", "password", "password"]]
                : []),
            ].map(([label, key, type]) => (
              <Field key={key} label={label}>
                <input
                  required
                  type={type}
                  minLength={type === "password" ? 8 : 1}
                  maxLength={type === "password" ? 72 : 254}
                  value={edit[key]}
                  onChange={(e) => setEdit({ ...edit, [key]: e.target.value })}
                />
              </Field>
            ))}
            <Field label="Role">
              <input readOnly value={mao ? "MAO" : "FARMER"} />
            </Field>
            {edit.id && (
              <Select
                label="Account Status"
                value={edit.status}
                onChange={(v) => setEdit({ ...edit, status: v })}
                options={["ACTIVE", "SUSPENDED", "INACTIVE"].map((id) => ({
                  id,
                  name: id,
                }))}
              />
            )}{" "}
            {mao && (
              <Field
                label="Your Admin Password"
                hint="Required to confirm privileged account changes."
              >
                <input
                  required
                  type="password"
                  autoComplete="current-password"
                  value={edit.currentPassword}
                  onChange={(e) =>
                    setEdit({ ...edit, currentPassword: e.target.value })
                  }
                />
              </Field>
            )}
            <p className="muted">
              Suspending or deactivating an account immediately ends its
              sessions.
            </p>
            <button disabled={busy} className="button">
              {busy
                ? "Saving…"
                : edit.id
                  ? "Save Account Changes"
                  : "Create MAO Account"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
