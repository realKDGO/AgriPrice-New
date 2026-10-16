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
    [review, setReview] = useState(null),
    [decline, setDecline] = useState(null),
    [reviewPassword, setReviewPassword] = useState(""),
    [declineReason, setDeclineReason] = useState(""),
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
  async function reviewRequest(decision, reason) {
    if (!review || !reviewPassword) {
      notify("Enter your admin password to review this request.");
      return;
    }
    setBusy(true);
    try {
      await userService.reviewMaoRequest(review.id, {
        decision,
        currentPassword: reviewPassword,
        ...(decision === "decline" ? { reason } : {}),
      });
      setReview(null);
      setDecline(null);
      setReviewPassword("");
      setDeclineReason("");
      query.reload();
      notify(decision === "approve" ? "MAO account approved." : "MAO request declined.");
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
            ...(mao
              ? ["PENDING", "ACTIVE", "DECLINED", "SUSPENDED", "INACTIVE"]
              : ["ACTIVE", "SUSPENDED", "INACTIVE"]
            ).map((id) => ({
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
                render: (r) => (
                  <Badge tone={["PENDING", "DECLINED"].includes(r.status) ? "warning" : ""}>
                    {r.status}
                  </Badge>
                ),
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
                onClick={() => {
                  if (mao && r.status === "PENDING") {
                    setReview(r);
                    setReviewPassword("");
                  } else {
                    setEdit({ ...r, currentPassword: "" });
                  }
                }}
              >
                {mao && r.status === "PENDING" ? "Review Request" : "Edit Account"}
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
                options={["ACTIVE", "DECLINED", "SUSPENDED", "INACTIVE"].map((id) => ({
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
      {review && !decline && (
        <Modal
          title="MAO Account Request"
          onClose={() => {
            setReview(null);
            setReviewPassword("");
          }}
        >
          <dl className="result-lines">
            <div><dt>First Name</dt><dd>{review.firstName}</dd></div>
            <div><dt>Last Name</dt><dd>{review.lastName}</dd></div>
            <div><dt>Email Address</dt><dd>{review.email}</dd></div>
            <div><dt>Account Type</dt><dd>Municipal Agriculture Office</dd></div>
            <div>
              <dt>Request Submitted</dt>
              <dd>{review.createdAt ? new Date(review.createdAt).toLocaleString() : "—"}</dd>
            </div>
            <div>
              <dt>Terms Accepted</dt>
              <dd>{review.termsAcceptedAt ? new Date(review.termsAcceptedAt).toLocaleString() : "Yes"}</dd>
            </div>
          </dl>
          <Field label="Your Admin Password">
            <input
              type="password"
              autoComplete="current-password"
              required
              value={reviewPassword}
              onChange={(e) => setReviewPassword(e.target.value)}
            />
          </Field>
          <div className="row-actions mt-4">
            <button
              type="button"
              className="button secondary"
              disabled={busy}
              onClick={() => {
                setDecline(review);
                setDeclineReason("");
              }}
            >
              Decline
            </button>
            <button
              type="button"
              className="button"
              disabled={busy}
              onClick={() => reviewRequest("approve")}
            >
              {busy ? "Approving…" : "Approve"}
            </button>
          </div>
        </Modal>
      )}
      {decline && (
        <Modal
          title="Decline MAO Request"
          onClose={() => {
            setDecline(null);
            setReview(decline);
          }}
        >
          <p>
            Provide a reason for declining {decline.firstName} {decline.lastName}.
            This reason will be saved with the account decision.
          </p>
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              reviewRequest("decline", declineReason.trim());
            }}
          >
            <Field label="Reason for Declining">
              <textarea
                required
                minLength={1}
                maxLength={1000}
                rows={4}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
              />
            </Field>
            <Field label="Your Admin Password">
              <input
                type="password"
                autoComplete="current-password"
                required
                value={reviewPassword}
                onChange={(e) => setReviewPassword(e.target.value)}
              />
            </Field>
            <div className="row-actions">
              <button
                type="button"
                className="button secondary"
                disabled={busy}
                onClick={() => {
                  setDecline(null);
                  setReview(decline);
                }}
              >
                Back
              </button>
              <button type="submit" className="button" disabled={busy}>
                {busy ? "Declining…" : "Confirm Decline"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
