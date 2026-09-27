import { Link } from "react-router-dom";

export default function PlaceholderPage({ title }) {
  return (
    <div className="portal-placeholder">
      <div className="portal-placeholder-card">
        <h1>{title}</h1>
        <p>This page is reserved for the {title} module.</p>
        <Link to="/market-management">Back to Market Management</Link>
      </div>
    </div>
  );
}
