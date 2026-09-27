import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Compass } from "lucide-react";
import {
  PageHead,
  Panel,
  Select,
  Field,
  Records,
  Badge,
} from "../../components/common/UI";
import { useApp } from "../../hooks/useApp";
import { marketService } from "../../services/marketService";
import { errorMessage } from "../../services/api";
import { money } from "../../utils/format";
export default function Markets() {
  const { data, session, notify } = useApp();
  const [crop, setCrop] = useState(data.settings.defaultCrop || ""),
    [quantity, setQuantity] = useState("100"),
    [rows, setRows] = useState(null),
    [busy, setBusy] = useState(false);
  const top = rows?.[0];
  async function search(e) {
    e.preventDefault();
    if (!crop) {
      notify("Select a crop before comparing markets.");
      e.currentTarget.querySelector("select")?.focus();
      return;
    }
    if (quantity.trim() === "") {
      notify("Enter a quantity before comparing markets.");
      e.currentTarget.querySelector('input[type="number"]')?.focus();
      return;
    }
    if (!Number.isFinite(Number(quantity)) || Number(quantity) <= 0) {
      notify("Quantity must be greater than 0 kg.");
      e.currentTarget.querySelector('input[type="number"]')?.focus();
      return;
    }
    setBusy(true);
    try {
      const result = await marketService.compare({
        cropId: crop,
        quantity: Number(quantity),
        otherExpenses: 0,
      });
      setRows(result);
      notify(
        result.length
          ? "Market comparison updated."
          : "No verified market prices are available for this crop.",
      );
    } catch (e) {
      notify(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHead
        title="Market Recommendation"
        description="Compare markets using available prices and estimated transport costs."
      />
      <Panel>
        <form className="recommendation-form" onSubmit={search} noValidate>
          <Select
            label="Crop"
            value={crop}
            onChange={(v) => {
              setCrop(v);
              setRows(null);
            }}
            options={[
              { id: "", name: "Select a crop" },
              ...data.crops.filter((c) => c.status === "Active"),
            ]}
          />
          <Field label="Quantity (kg)">
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setRows(null);
              }}
            />
          </Field>
          <button disabled={busy} className="button">
            {busy ? "Comparing…" : "Find Best Market"}
          </button>
        </form>
      </Panel>
      {rows === null ? (
        <div className="recommendation-empty">
          <Compass size={34} />
          <p>Select a crop and quantity to compare markets.</p>
        </div>
      ) : !top ? (
        <div className="notice">
          No verified prices are available for this crop.
        </div>
      ) : (
        <>
          <Panel className="recommendation-result">
            <div className="result-head">
              <span className="quick-icon">
                <CheckCircle2 size={22} />
              </span>
              <div>
                <small>Recommended Market</small>
                <h2>{top.market.name}</h2>
                <Badge>Highest Estimated Net Return</Badge>
              </div>
            </div>
            <div className="recommendation-stats">
              {[
                ["Selling Price / kg", top.price],
                ["Transportation Estimate", top.transport],
                ["Gross Revenue", top.revenue],
                ["Estimated Net Return", top.net],
              ].map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{money(value)}</strong>
                </div>
              ))}
            </div>
            <p className="muted">
              Based on the latest available verified quotation, dated{" "}
              {top.date.slice(0, 10)}. Confirm prices and costs before selling.
            </p>
            <Link
              className="button"
              to={`/${session.role.toLowerCase()}/profit?crop=${crop}&market=${top.marketId}&quantity=${quantity}`}
            >
              Continue to Profit Estimation <ArrowRight size={17} />
            </Link>
          </Panel>
          <Panel>
            <h2>Other Markets</h2>
            <Records
              rows={rows.slice(1)}
              columns={[
                {
                  key: "market",
                  label: "Market",
                  render: (r) => r.market.name,
                },
                {
                  key: "price",
                  label: "Price / kg",
                  render: (r) => money(r.price),
                },
                {
                  key: "transport",
                  label: "Transportation",
                  render: (r) => money(r.transport),
                },
                {
                  key: "revenue",
                  label: "Gross Revenue",
                  render: (r) => money(r.revenue),
                },
                {
                  key: "net",
                  label: "Estimated Net Return",
                  render: (r) => money(r.net),
                },
              ]}
            />
          </Panel>
        </>
      )}
    </>
  );
}
