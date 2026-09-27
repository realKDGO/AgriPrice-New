import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Calculator, RotateCcw } from "lucide-react";
import { PageHead, Panel, Select, Field } from "../../components/common/UI";
import { useApp } from "../../hooks/useApp";
import { marketService } from "../../services/marketService";
import { priceService } from "../../services/priceService";
import { errorMessage } from "../../services/api";
import { money } from "../../utils/format";
export default function Profit() {
  const { data, notify } = useApp();
  const [params] = useSearchParams();
  const [crop, setCrop] = useState(
      data.crops.some((c) => c.id === params.get("crop"))
        ? params.get("crop")
        : data.settings.defaultCrop || "",
    ),
    [market, setMarket] = useState(
      data.markets.some((m) => m.id === params.get("market"))
        ? params.get("market")
        : data.markets[0]?.id || "",
    ),
    [quantity, setQuantity] = useState(params.get("quantity") || "100"),
    [price, setPrice] = useState(""),
    [expenses, setExpenses] = useState("0"),
    [result, setResult] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    setPrice("");
    if (crop && market)
      priceService
        .current({ cropId: crop, marketId: market })
        .then((r) => {
          if (active) setPrice(r.items[0]?.price || "");
        })
        .catch((e) => {
          if (active) {
            const message = errorMessage(e);
            setError(message);
            notify(message);
          }
        });
    return () => {
      active = false;
    };
  }, [crop, market]);
  useEffect(() => {
    let active = true;
    setResult(null);
    setError("");
    setBusy(false);
    if (
      !crop ||
      !market ||
      !quantity ||
      price === "" ||
      Number(quantity) <= 0 ||
      Number(price) <= 0 ||
      Number(expenses) < 0
    )
      return;
    setBusy(true);
    const timer = setTimeout(
      () =>
        marketService
          .profit({
            cropId: crop,
            marketId: market,
            quantity: Number(quantity),
            sellingPrice: Number(price),
            otherExpenses: Number(expenses),
          })
          .then((r) => {
            if (active) setResult(r);
          })
          .catch((e) => {
            if (active) {
              const message = errorMessage(e);
              setError(message);
              notify(message);
            }
          })
          .finally(() => {
            if (active) setBusy(false);
          }),
      300,
    );
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [crop, market, quantity, price, expenses]);
  const validationMessage =
    !crop
      ? "Select a crop to estimate earnings."
      : !market
        ? "Select a market to estimate earnings."
        : quantity === ""
          ? "Enter a quantity."
          : !Number.isFinite(Number(quantity)) || Number(quantity) <= 0
            ? "Quantity must be greater than 0 kg."
            : price === ""
              ? "Enter a selling price."
              : !Number.isFinite(Number(price)) || Number(price) <= 0
                ? "Selling price must be greater than ₱0."
                : expenses !== "" &&
                    (!Number.isFinite(Number(expenses)) || Number(expenses) < 0)
                  ? "Other expenses cannot be negative."
                  : "";
  const showValidationToast = () => {
    if (validationMessage) notify(validationMessage);
  };
  return (
    <>
      <PageHead
        title="Profit Estimation"
        description="Review sale details and expenses to estimate net earnings."
      />
      <div className="calculator-grid">
        <Panel>
          <h2>Sale &amp; Expense Details</h2>
          <div className="form-grid mt-6">
            <Select
              label="Crop"
              value={crop}
              onChange={setCrop}
              options={data.crops.filter((c) => c.status === "Active")}
            />
            <Field label="Quantity (kg)">
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                onBlur={showValidationToast}
              />
            </Field>
            <Field label="Selling Price / kg">
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onBlur={showValidationToast}
              />
            </Field>
            <Field label="Other Expenses (₱)">
              <input
                type="number"
                min="0"
                step="0.01"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                onBlur={showValidationToast}
              />
            </Field>
            <Select
              label="Market"
              value={market}
              onChange={setMarket}
              options={data.markets.filter((m) => m.status === "Active")}
            />
          </div>
          <p className="muted mt-4">
            Transportation is estimated separately. Include packaging, labor,
            and other sale costs under Other Expenses.
          </p>
          <button
            className="button secondary mt-6"
            onClick={() => {
              setQuantity("100");
              setExpenses("0");
              setCrop(data.crops[0]?.id || "");
              setMarket(data.markets[0]?.id || "");
              notify("Profit inputs reset.");
            }}
          >
            <RotateCcw size={16} />
            Reset Inputs
          </button>
        </Panel>
        <Panel className="calculator-result">
          <span className="quick-icon">
            <Calculator size={22} />
          </span>
          <h2>Estimated Net Earnings</h2>
          {error ? (
            <p role="alert">{error}</p>
          ) : result ? (
            <>
              <dl className="result-lines">
                {[
                  ["Gross Sales", result.revenue],
                  ["Transportation Cost", result.transport],
                  ["Other Expenses", result.expenses],
                  ["Total Expenses", result.totalExpenses],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{money(value)}</dd>
                  </div>
                ))}
              </dl>
              <div className="net-result">
                <small>Estimated Net Earnings</small>
                <strong className={Number(result.net) < 0 ? "negative" : ""}>
                  {money(result.net)}
                </strong>
              </div>
              <div className="profit-margin">
                <span>Profit Margin</span>
                <strong>
                  {result.margin === null
                    ? "Not applicable"
                    : `${result.margin}%`}
                </strong>
              </div>
              <p className="fine-print">
                Margin = estimated net earnings ÷ gross revenue × 100.
              </p>
            </>
          ) : (
            <p role="status">
              {busy
                ? "Calculating…"
                : validationMessage ||
                  "Enter valid sale details to calculate earnings."}
            </p>
          )}
        </Panel>
      </div>
    </>
  );
}
