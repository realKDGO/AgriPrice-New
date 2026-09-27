import { useState } from "react";
import {
  PageHead,
  Panel,
  Records,
  Badge,
  Tabs,
  Modal,
  Field,
} from "../../components/common/UI";
import { QueryState, Pagination } from "../../components/common/Async";
import { useQuery } from "../../hooks/useQuery";
import { useApp } from "../../hooks/useApp";
import { priceService } from "../../services/priceService";
import { errorMessage } from "../../services/api";
import { money } from "../../utils/format";
export default function Validation() {
  const { notify } = useApp();
  const [tab, setTab] = useState("PENDING"),
    [page, setPage] = useState(1),
    [review, setReview] = useState(null),
    [note, setNote] = useState(""),
    [busy, setBusy] = useState(false);
  const query = useQuery(
    () => priceService.list({ status: tab, page }),
    [tab, page],
  );
  async function decide(approved) {
    setBusy(true);
    try {
      await priceService.review(review.id, approved, note);
      setReview(null);
      query.reload();
      notify(approved ? "Price approved." : "Price rejected.");
    } catch (e) {
      notify(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHead
        title="Price Validation"
        description="Review quotations before they appear to farmers."
      />
      <Tabs
        items={["PENDING", "VERIFIED", "REJECTED"]}
        value={tab}
        onChange={(v) => {
          setTab(v);
          setPage(1);
        }}
      />
      <QueryState query={query}>
        <Panel>
          <Records
            rows={query.data?.items || []}
            columns={[
              { key: "crop", label: "Crop", render: (r) => r.crop.name },
              { key: "market", label: "Market", render: (r) => r.market.name },
              {
                key: "price",
                label: "Price / kg",
                render: (r) => money(r.price),
              },
              { key: "source", label: "Source" },
              {
                key: "status",
                label: "Status",
                render: (r) => <Badge>{r.status}</Badge>,
              },
            ]}
            actions={(r) => (
              <button
                className="button secondary small"
                onClick={() => {
                  setReview(r);
                  setNote(r.reviewNote || "");
                }}
              >
                {r.status === "PENDING" ? "Review" : "View"}
              </button>
            )}
          />
        </Panel>
        <Pagination data={query.data} onPage={setPage} />
      </QueryState>
      {review && (
        <Modal title="Review Price" onClose={() => setReview(null)}>
          <h3>
            {review.crop.name} · {money(review.price)}/kg
          </h3>
          <p>{review.market.name}</p>
          <p>Date: {review.date.slice(0, 10)}</p>
          <p>Source: {review.source}</p>
          {review.status === "PENDING" ? (
            <>
              <Field
                label="Review Note"
                hint="A reason is required when rejecting a price."
              >
                <textarea
                  value={note}
                  maxLength={1000}
                  onChange={(e) => setNote(e.target.value)}
                />
              </Field>
              <div className="row-actions mt-5">
                <button
                  disabled={busy}
                  className="button"
                  onClick={() => decide(true)}
                >
                  Approve Price
                </button>
                <button
                  disabled={busy || !note.trim()}
                  className="button danger"
                  onClick={() => decide(false)}
                >
                  Reject Price
                </button>
              </div>
            </>
          ) : (
            <>
              <p>{note || "No review note."}</p>
              <p>
                Reviewed by{" "}
                {review.reviewer
                  ? `${review.reviewer.firstName} ${review.reviewer.lastName}`
                  : "Not recorded"}{" "}
                {review.reviewedAt &&
                  `on ${new Date(review.reviewedAt).toLocaleString()}`}
              </p>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
