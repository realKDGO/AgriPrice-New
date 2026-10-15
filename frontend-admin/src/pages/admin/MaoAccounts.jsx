import { useState, useMemo, useEffect } from "react";
import { Plus, Search, UserCheck, AlertCircle, X, Check, XCircle } from "lucide-react";
import AdminHeader from "../../components/common/AdminHeader";
import { api } from "../../services/portalAuth";

const INITIAL_MAO_USERS = [
  {
    id: "mao-req-1",
    name: "Ricardo Salcedo",
    email: "rsalcedo.mao@rizal.gov.ph",
    role: "MAO",
    status: "PENDING",
    registrationDate: "2026-10-14 14:20",
    lastLogin: "Never (Pending)",
    notes: "Official Municipal Agriculture Officer for Tanay District. Valid ID and credentials attached.",
  },
  {
    id: "mao-req-2",
    name: "Ma. Cristina Santos",
    email: "mcsantos@morong.gov.ph",
    role: "MAO",
    status: "PENDING",
    registrationDate: "2026-10-15 09:12",
    lastLogin: "Never (Pending)",
    notes: "Agricultural technologist requesting access to post weekly farmgate quotations.",
  },
  {
    id: "mao-1",
    name: "Elena Reyes",
    email: "elena@agriprice.local",
    role: "MAO",
    status: "ACTIVE",
    registrationDate: "2026-08-10 10:00",
    lastLogin: "2026-09-05 08:00",
  },
  {
    id: "mao-2",
    name: "David Lopit",
    email: "dave.mao@agriprice.local",
    role: "MAO",
    status: "ACTIVE",
    registrationDate: "2026-08-15 11:30",
    lastLogin: "2026-08-21 09:34",
  },
];

export default function MaoAccounts() {
  const [maoUsers, setMaoUsers] = useState(INITIAL_MAO_USERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "ACTIVE",
  });

  // Request review modal
  const [reviewRequest, setReviewRequest] = useState(null);

  // Decline message modal
  const [declineTarget, setDeclineTarget] = useState(null);
  const [declineReason, setDeclineReason] = useState("");
  const [declineError, setDeclineError] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Optionally fetch live accounts if backend is available
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .get("/admin/mao-accounts")
      .then((res) => {
        if (!isMounted) return;
        const items = res.data?.data?.items || res.data?.items;
        if (Array.isArray(items) && items.length > 0) {
          const liveMapped = items.map((u) => ({
            id: u.id,
            name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email,
            email: u.email,
            role: u.role || "MAO",
            status: (u.status || "ACTIVE").toUpperCase(),
            registrationDate: u.createdAt
              ? new Date(u.createdAt).toISOString().replace("T", " ").slice(0, 16)
              : "2026-09-01 08:00",
            lastLogin: u.lastLoginAt
              ? new Date(u.lastLoginAt).toISOString().replace("T", " ").slice(0, 16)
              : "Never",
          }));
          // Merge ensuring pending mock requests are also retained for demonstration
          setMaoUsers((prev) => {
            const pendingItems = prev.filter((p) => p.status === "PENDING" || p.status === "DECLINED");
            const seen = new Set(liveMapped.map((x) => x.email.toLowerCase()));
            const combined = [...liveMapped];
            for (const p of pendingItems) {
              if (!seen.has(p.email.toLowerCase())) {
                combined.unshift(p);
              }
            }
            return combined;
          });
        }
      })
      .catch(() => {
        // Fall back gracefully to mock state without crashing
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const pendingCount = useMemo(() => {
    return maoUsers.filter((u) => u.status === "PENDING").length;
  }, [maoUsers]);

  const filteredUsers = useMemo(() => {
    return maoUsers.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "ALL" ||
        u.status.toUpperCase() === statusFilter.toUpperCase();
      return matchSearch && matchStatus;
    });
  }, [maoUsers, search, statusFilter]);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", status: "ACTIVE" });
    setModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, status: user.status });
    setModalOpen(true);
  };

  const handleRowClick = (user) => {
    if (user.status === "PENDING") {
      setReviewRequest(user);
    } else {
      handleOpenEdit(user);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    if (editingUser) {
      setMaoUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: formData.name, email: formData.email, status: formData.status }
            : u
        )
      );
      showToast("MAO account updated successfully.");
    } else {
      const newUser = {
        id: "mao-" + Date.now(),
        name: formData.name,
        email: formData.email,
        role: "MAO",
        status: formData.status,
        registrationDate: new Date().toISOString().replace("T", " ").slice(0, 16),
        lastLogin: "Never",
      };
      setMaoUsers((prev) => [newUser, ...prev]);
      showToast("MAO account created successfully.");
    }
    setModalOpen(false);
  };

  const handleApprove = (target) => {
    setMaoUsers((prev) =>
      prev.map((u) =>
        u.id === target.id
          ? {
              ...u,
              status: "ACTIVE",
              lastLogin: "Approved (Active)",
            }
          : u
      )
    );
    setReviewRequest(null);
    showToast(`MAO Account for ${target.name} has been approved.`);
  };

  const handleOpenDeclineModal = (target) => {
    setDeclineTarget(target);
    setDeclineReason("");
    setDeclineError("");
  };

  const handleConfirmDecline = (e) => {
    e.preventDefault();
    if (!declineReason.trim()) {
      setDeclineError("Please specify a reason or missing information for the decline.");
      return;
    }

    setMaoUsers((prev) =>
      prev.map((u) =>
        u.id === declineTarget.id
          ? {
              ...u,
              status: "DECLINED",
              declineReason: declineReason.trim(),
            }
          : u
      )
    );
    const targetName = declineTarget.name;
    setDeclineTarget(null);
    setReviewRequest(null);
    showToast(`Request for ${targetName} declined. Notification message logged.`);
  };

  const getPillClass = (status) => {
    const s = (status || "").toUpperCase();
    if (s === "ACTIVE") return "admin-pill--active";
    if (s === "PENDING") return "admin-pill--pending";
    if (s === "DECLINED" || s === "REJECTED") return "admin-pill--declined";
    return "admin-pill--suspended";
  };

  return (
    <div>
      <AdminHeader
        title="MAO Accounts"
        subtitle="Manage MAO account access, registrations, and pending officer requests."
      >
        <button
          type="button"
          className="admin-btn-primary"
          onClick={handleOpenAdd}
        >
          <Plus size={16} strokeWidth={2.2} />
          <span>Add account</span>
        </button>
      </AdminHeader>

      {toastMessage && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 18px",
            backgroundColor: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: "8px",
            color: "#065f46",
            fontSize: "13.5px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Check size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Pending Banner Alert if any pending requests exist */}
      {pendingCount > 0 && (
        <div
          style={{
            marginBottom: "18px",
            padding: "14px 18px",
            backgroundColor: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <AlertCircle size={20} color="#d97706" />
            <div>
              <span style={{ fontWeight: 600, color: "#92400e", fontSize: "14px" }}>
                {pendingCount} Pending MAO Account Request{pendingCount > 1 ? "s" : ""}
              </span>
              <p style={{ margin: "2px 0 0 0", fontSize: "12.5px", color: "#b45309" }}>
                New Municipal Agriculture Office registration requests awaiting administrator verification.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="admin-btn-secondary"
            style={{ fontSize: "12px", padding: "6px 14px" }}
            onClick={() => setStatusFilter("PENDING")}
          >
            Review Pending Requests
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="admin-filters-bar">
        <div className="admin-search-wrapper">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-select-group">
          <span className="admin-select-label">Status</span>
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Approval ({pendingCount})</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="DECLINED">Declined</option>
          </select>
        </div>
      </div>

      {/* MAO Accounts Table Card */}
      <div className="admin-card admin-card--flush">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login / Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "36px",
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    No matching MAO accounts found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isPending = user.status === "PENDING";
                  return (
                    <tr
                      key={user.id}
                      onClick={() => handleRowClick(user)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: isPending ? "#fffdf5" : undefined,
                      }}
                      title={
                        isPending
                          ? "Click to review pending MAO request"
                          : "Click to view or edit account"
                      }
                    >
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {isPending && (
                            <span
                              style={{
                                display: "inline-block",
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: "#f59e0b",
                              }}
                              title="Pending Verification"
                            />
                          )}
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td style={{ color: "var(--admin-text-muted)" }}>{user.email}</td>
                      <td>
                        <span className="admin-pill admin-pill--role">
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-pill ${getPillClass(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td style={{ color: "var(--admin-text-muted)", fontSize: "12px" }}>
                        {user.lastLogin || user.registrationDate}
                      </td>
                      <td>
                        {isPending ? (
                          <button
                            type="button"
                            className="admin-btn-primary"
                            style={{
                              fontSize: "12px",
                              padding: "5px 12px",
                              borderRadius: "6px",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setReviewRequest(user);
                            }}
                          >
                            Review Request
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="admin-action-link"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(user);
                            }}
                          >
                            Edit account
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Request Modal (Upon clicking pending request) */}
      {reviewRequest && (
        <div
          className="admin-modal-overlay"
          onClick={() => setReviewRequest(null)}
        >
          <div
            className="admin-modal"
            style={{ maxWidth: "540px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "#fef3c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#b45309",
                  }}
                >
                  <UserCheck size={20} />
                </div>
                <div>
                  <h2
                    className="admin-modal__title"
                    style={{ margin: 0, fontSize: "18px" }}
                  >
                    MAO Account Request
                  </h2>
                  <span style={{ fontSize: "12px", color: "var(--admin-text-muted)" }}>
                    Registration review for Municipal Agriculture Office
                  </span>
                </div>
              </div>
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6b7770",
                }}
                onClick={() => setReviewRequest(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                padding: "16px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
                marginBottom: "20px",
                fontSize: "13px",
              }}
            >
              <div>
                <span
                  style={{
                    color: "#6b7280",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Applicant Name
                </span>
                <p style={{ margin: "4px 0 0 0", fontWeight: 600, color: "#111827" }}>
                  {reviewRequest.name}
                </p>
              </div>

              <div>
                <span
                  style={{
                    color: "#6b7280",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Email Address
                </span>
                <p style={{ margin: "4px 0 0 0", fontWeight: 500, color: "#111827" }}>
                  {reviewRequest.email}
                </p>
              </div>

              <div>
                <span
                  style={{
                    color: "#6b7280",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Requested Role
                </span>
                <p style={{ margin: "4px 0 0 0" }}>
                  <span className="admin-pill admin-pill--role">
                    {reviewRequest.role}
                  </span>
                </p>
              </div>

              <div>
                <span
                  style={{
                    color: "#6b7280",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Status
                </span>
                <p style={{ margin: "4px 0 0 0" }}>
                  <span className={`admin-pill ${getPillClass(reviewRequest.status)}`}>
                    {reviewRequest.status}
                  </span>
                </p>
              </div>

              {reviewRequest.registrationDate && (
                <div style={{ gridColumn: "span 2" }}>
                  <span
                    style={{
                      color: "#6b7280",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    Requested On
                  </span>
                  <p style={{ margin: "4px 0 0 0", color: "#374151" }}>
                    {reviewRequest.registrationDate}
                  </p>
                </div>
              )}

              {reviewRequest.notes && (
                <div style={{ gridColumn: "span 2" }}>
                  <span
                    style={{
                      color: "#6b7280",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    Registration Details / Notes
                  </span>
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      color: "#374151",
                      lineHeight: "1.5",
                      backgroundColor: "#ffffff",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    {reviewRequest.notes}
                  </p>
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                borderTop: "1px solid #f3f4f6",
                paddingTop: "16px",
              }}
            >
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => setReviewRequest(null)}
              >
                Close
              </button>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="admin-btn-danger"
                  onClick={() => handleOpenDeclineModal(reviewRequest)}
                >
                  <XCircle size={16} />
                  <span>Decline</span>
                </button>
                <button
                  type="button"
                  className="admin-btn-primary"
                  onClick={() => handleApprove(reviewRequest)}
                >
                  <Check size={16} />
                  <span>Approve MAO Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decline Feedback Modal */}
      {declineTarget && (
        <div
          className="admin-modal-overlay"
          style={{ zIndex: 1000 }}
          onClick={() => setDeclineTarget(null)}
        >
          <div
            className="admin-modal"
            style={{ maxWidth: "480px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "14px",
              }}
            >
              <h2
                className="admin-modal__title"
                style={{ margin: 0, color: "#b91c1c" }}
              >
                Decline MAO Account Request
              </h2>
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6b7770",
                }}
                onClick={() => setDeclineTarget(null)}
              >
                <X size={20} />
              </button>
            </div>

            <p
              style={{
                fontSize: "13px",
                color: "var(--admin-text-muted)",
                lineHeight: "1.5",
                margin: "0 0 16px 0",
              }}
            >
              Provide an update or message explaining why this request for{" "}
              <strong>{declineTarget.name}</strong> ({declineTarget.email}) is
              being declined. This message will serve as an update if there is
              missing or incomplete information required.
            </p>

            <form onSubmit={handleConfirmDecline}>
              <div className="admin-form-group">
                <label className="admin-form-label">
                  Decline Reason / Required Information <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <textarea
                  className="admin-form-input"
                  rows={4}
                  required
                  placeholder="e.g. Official government ID or endorsement letter from the Municipal Agriculturist is missing. Please re-submit with the signed endorsement."
                  value={declineReason}
                  onChange={(e) => {
                    setDeclineReason(e.target.value);
                    if (declineError) setDeclineError("");
                  }}
                  style={{
                    width: "100%",
                    resize: "vertical",
                    fontFamily: "inherit",
                    padding: "10px",
                    borderColor: declineError ? "#dc2626" : undefined,
                  }}
                />
                {declineError && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "12px",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {declineError}
                  </p>
                )}
              </div>

              <div className="admin-modal__actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setDeclineTarget(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-danger">
                  Submit Decline &amp; Send Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-modal__title">
              {editingUser ? "Edit MAO Account" : "Add MAO Account"}
            </h2>
            <form onSubmit={handleSave}>
              <div className="admin-form-group">
                <label className="admin-form-label">Full Name</label>
                <input
                  type="text"
                  className="admin-form-input"
                  required
                  placeholder="e.g. Elena Reyes"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Email Address</label>
                <input
                  type="email"
                  className="admin-form-input"
                  required
                  placeholder="e.g. elena@agriprice.local"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Status</label>
                <select
                  className="admin-select"
                  style={{ width: "100%", maxWidth: "580px" }}
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>

              <div className="admin-modal__actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {editingUser ? "Save changes" : "Create account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
