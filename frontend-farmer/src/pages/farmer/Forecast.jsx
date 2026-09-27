import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { PageHead, Panel, Select, Records } from "../../components/common/UI";
import { QueryState } from "../../components/common/Async";
import PriceChart from "../../components/common/PriceChart";
import { useApp } from "../../hooks/useApp";
import { useQuery } from "../../hooks/useQuery";
import { forecastService } from "../../services/forecastService";
import { errorMessage } from "../../services/api";
import { money } from "../../utils/format";
export default function Forecast() {
  const { data, session, notify } = useApp();
  const [cropId, setCrop] = useState(data.settings.defaultCrop || ""),
    [marketId, setMarket] = useState(data.markets[0]?.id || ""),
    [horizon, setHorizon] = useState(1),
    [busy, setBusy] = useState(false);
  const query = useQuery(
    () =>
      cropId && marketId
        ? forecastService.get({ cropId, marketId, horizonMonths: horizon })
        : Promise.resolve({ items: [] }),
    [cropId, marketId, horizon],
  );
  const rows = query.data?.items || [];
  const crop = data.crops.find((c) => c.id === cropId);
  const end = rows.at(-1);
  return (
    <>
      <PageHead
        title={session.role === "MAO" ? "Forecast Information" : "Forecasting"}
      />
      <Panel className="forecast-controls">
        <Select
          label="Crop"
          value={cropId}
          onChange={setCrop}
          options={data.crops.filter((c) => c.status === "Active")}
        />
        <Select
          label="Market"
          value={marketId}
          onChange={setMarket}
          options={data.markets.filter((m) => m.status === "Active")}
        />
        <div>
          <span className="field-label">Forecast Period</span>
          <div className="period-buttons">
            {[1, 3, 6].map((month) => (
              <button
                key={month}
                aria-pressed={horizon === month}
                className={horizon === month ? "active" : ""}
                onClick={() => setHorizon(month)}
              >
                {month} Month{month > 1 ? "s" : ""}
              </button>
            ))}
          </div>
        </div>
      </Panel>
      {session.role === "MAO" && (
        <button
          className="button"
          disabled={busy || !cropId || !marketId}
          onClick={async () => {
            setBusy(true);
            try {
              await forecastService.generate({
                cropId,
                marketId,
                horizonMonths: horizon,
              });
              query.reload();
              notify("Forecast generated.");
            } catch (e) {
              notify(errorMessage(e));
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Generating…" : "Generate Forecast"}
        </button>
      )}
      <QueryState query={query}>
        {rows.length ? (
          <>
            <div className="forecast-grid">
              <Panel>
                <h2>Forecast Chart · {crop?.name}</h2>
                <PriceChart
                  forecast
                  data={rows.map((r) => ({
                    ...r,
                    price: Number(r.predictedPrice),
                    label: new Date(r.targetDate).toLocaleDateString("en-PH", {
                      month: "short",
                      year: "2-digit",
                    }),
                  }))}
                />
              </Panel>
              <Panel className="forecast-summary">
                <h2>Forecast Summary</h2>
                <div>
                  <span>Predicted Price</span>
                  <strong>{money(end.predictedPrice)}/kg</strong>
                </div>
                <div className="summary-amber">
                  <span>Forecast Period</span>
                  <strong>
                    {horizon} Month{horizon > 1 ? "s" : ""}
                  </strong>
                </div>
                <div className="summary-neutral">
                  <span>Trend</span>
                  <strong>{query.data.trend||"Not available"}</strong>
                  <span>Method</span>
                  <strong>Monthly Trend</strong>
                  <small>
                    Historical monthly averages. No calibrated confidence
                    interval.
                  </small>
                </div>
              </Panel>
            </div>
            <Panel>
              <h2>Forecast Table</h2>
              <Records
                rows={rows}
                columns={[
                  {
                    key: "targetDate",
                    label: "Target Month",
                    render: (r) =>
                      new Date(r.targetDate).toLocaleDateString("en-PH", {
                        month: "long",
                        year: "numeric",
                      }),
                  },
                  {
                    key: "horizonMonths",
                    label: "Period",
                    render: (r) => `Month ${r.horizonMonths}`,
                  },
                  {
                    key: "predictedPrice",
                    label: "Predicted Price",
                    render: (r) => money(r.predictedPrice),
                  },
                ]}
              />
            </Panel>
            <Panel className="forecast-insight">
              <Lightbulb />
              <div>
                <h2>Forecast Insight</h2>
                <p>{query.data.note}</p>
                <p>
                  Generated {new Date(end.generatedAt).toLocaleDateString()}.
                  {session.role === "MAO" &&
                    ` Model: ${end.modelVersion}. Input records: ${end.inputCount}.`}
                </p>
              </div>
            </Panel>
          </>
        ) : (
          <Panel>
            <h2>No forecast available</h2>
            <p>
              A forecast needs at least three months of verified records for the
              selected crop and market. MAO can generate an outlook when enough
              records are available.
            </p>
          </Panel>
        )}
      </QueryState>
    </>
  );
}
