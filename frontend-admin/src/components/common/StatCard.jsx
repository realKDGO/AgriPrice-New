function StatCard({ label, value, helper, icon: Icon }) {
  return <article className="stat-card"><div className="stat-head"><span className="stat-label">{label}</span>{Icon ? <span className="stat-icon"><Icon /></span> : null}</div><div className="stat-value">{value}</div>{helper ? <div className="stat-helper">{helper}</div> : null}</article>;
}
export default StatCard;
