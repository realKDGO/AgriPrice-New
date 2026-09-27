const toneFor = (status = "") => { const s = status.toLowerCase(); if (["active","approved","validated"].includes(s)) return "success"; if (["pending","review"].includes(s)) return "warning"; if (s.includes("returned") || ["inactive","rejected"].includes(s)) return "danger"; return "neutral"; };
function StatusBadge({ status }) { return <span className={`status-badge status-${toneFor(status)}`}>{status}</span>; }
export default StatusBadge;
