import { PageSkeleton } from "./UI";
export function QueryState({ query, children }) {
  if (query.loading) return <PageSkeleton />;
  if (query.error)
    return (
      <div className="notice" role="alert">
        <p>{query.error}</p>
        <button className="button secondary" onClick={query.reload}>
          Try Again
        </button>
      </div>
    );
  return children;
}
export function Pagination({ data, onPage }) {
  if (!data) return null;
  return (
    <nav className="pagination" aria-label="Record pages">
      <button
        className="button secondary small"
        disabled={data.page <= 1}
        onClick={() => onPage(data.page - 1)}
      >
        Previous
      </button>
      <span>
        Page {data.page} of {Math.max(data.pages, 1)} · {data.total} records
      </span>
      <button
        className="button secondary small"
        disabled={data.page >= data.pages}
        onClick={() => onPage(data.page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
