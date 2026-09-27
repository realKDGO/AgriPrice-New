import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useState } from "react";
import {
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Sprout,
} from "lucide-react";
import { PageHead, Panel, Select, Records } from "../../components/common/UI";
import { QueryState, Pagination } from "../../components/common/Async";
import PriceChart from "../../components/common/PriceChart";
import { useApp } from "../../hooks/useApp";
import { useQuery } from "../../hooks/useQuery";
import { reportService } from "../../services/reportService";
import { priceService } from "../../services/priceService";
import { forecastService } from "../../services/forecastService";
import { money, downloadCSV } from "../../utils/format";
export default function Reports() {
  const { data } = useApp();
  const [type, setType] = useState("prices"),
    [crop, setCrop] = useState(""),
    [market, setMarket] = useState(""),
    [page, setPage] = useState(1);
  const summary = useQuery(
    () =>
      reportService.agriculture({
        cropId: crop || undefined,
        marketId: market || undefined,
      }),
    [crop, market],
  );
  const query = useQuery(async () => {
    if (type === "history")
      return priceService.history({
        cropId: crop || undefined,
        marketId: market || undefined,
        page,
      });
    if (type === "forecasts") {
      if (!crop || !market) return { items: [] };
      return forecastService.get({
        cropId: crop,
        marketId: market,
        horizonMonths: 6,
      });
    }
    return priceService.current({
      cropId: crop || undefined,
      marketId: market || undefined,
      page,
    });
  }, [type, crop, market, page]);
  const rows = (query.data?.items || []).map((r) => ({
    id: r.id,
    crop: r.crop?.name || data.crops.find((c) => c.id === r.cropId)?.name,
    market:
      r.market?.name || data.markets.find((m) => m.id === r.marketId)?.name,
    date: (r.date || r.targetDate)?.slice(0, 10),
    price: Number(r.price || r.predictedPrice),
    status: r.status,
    source: r.source || r.modelVersion,
  }));
  const s = summary.data?.summary;
  return (
    <>
      <PageHead
        title="Reports & Analytics"
        action={
          <button
            className="button"
            disabled={!rows.length || query.loading}
            onClick={() => downloadCSV(`agriprice-${type}-page-${page}`, rows)}
          >
            <Download size={17} />
            Export Displayed Records
          </button>
        }
      />
      <div className="stats-grid four report-summary">
        {[
          [TrendingUp, "Highest Price", s?.highest],
          [TrendingDown, "Lowest Price", s?.lowest],
          [BarChart3, "Average Price", s?.average],
          [Sprout, "Monitored Crops", s?.monitoredCrops],
        ].map(([Icon, label, value]) => (
          <Panel key={label}>
            <Icon />
            <strong>
              {value == null
                ? "—"
                : label === "Monitored Crops"
                  ? value
                  : money(value)}
            </strong>
            <span>{label}</span>
          </Panel>
        ))}
      </div>
      {summary.error && <p role="alert">{summary.error}</p>}
      <div className="filter-bar">
        <Select
          label="Report"
          value={type}
          onChange={(v) => {
            setType(v);
            setPage(1);
          }}
          options={[
            { id: "prices", name: "Crop Price Report" },
            { id: "markets", name: "Market Comparison" },
            { id: "history", name: "Historical Trends" },
            { id: "forecasts", name: "Forecast Summary" },
          ]}
        />
        <Select
          label="Crop"
          value={crop}
          onChange={(v) => {
            setCrop(v);
            setPage(1);
          }}
          options={[{ id: "", name: "All crops" }, ...data.crops]}
        />
        <Select
          label="Market"
          value={market}
          onChange={(v) => {
            setMarket(v);
            setPage(1);
          }}
          options={[{ id: "", name: "All markets" }, ...data.markets]}
        />
      </div>
      <QueryState query={query}>
        {type === "forecasts" && (!crop || !market) ? (
          <Panel>
            <p>Choose a crop and market to view forecast results.</p>
          </Panel>
        ) : (
          <>
            {rows.length > 0 && (
              <Panel>
                <h2>
                  {type === "history"
                    ? "Historical Trend"
                    : type === "forecasts"
                      ? "Forecast Summary"
                      : "Market Comparison"}
                </h2>
                <PriceChart
                  forecast={type === "forecasts"}
                  data={[...rows]
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((r) => ({
                      ...r,
                      label: ["history", "forecasts"].includes(type)
                        ? r.date
                        : `${r.crop} · ${r.market}`,
                    }))}
                />
              </Panel>
            )}
            <Panel>
              <h2>Report Records</h2>
              <Records
                rows={rows}
                columns={[
                  { key: "crop", label: "Crop" },
                  { key: "market", label: "Market" },
                  { key: "date", label: "Date" },
                  {
                    key: "price",
                    label: "Price / kg",
                    render: (r) => money(r.price),
                  },
                  { key: "source", label: "Source / Method" },
                ]}
              />
            </Panel>
            {query.data?.page && (
              <Pagination data={query.data} onPage={setPage} />
            )}
          </>
        )}
      </QueryState>
      {summary.data?.monthly?.length > 0 && (
        <Panel>
          <h2>Monthly Price Trend</h2>
          <p className="muted">
            Monthly mean of verified quotations matching the selected crop and
            market. Last 12 months.
          </p>
          <PriceChart
            data={summary.data.monthly.map((r) => ({
              label: r.month,
              price: Number(r.price),
            }))}
          />
        </Panel>
      )}
      {summary.data?.averages?.length > 0 && (
        <Panel>
          <h2>Average Price by Crop</h2>
          <p className="muted">
            Mean of verified historical quotations matching these filters.
          </p>
          <div style={{ height: 280, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={summary.data.averages.map((r) => ({
                  name:
                    data.crops.find((c) => c.id === r.cropId)?.name || "Crop",
                  price: Number(r._avg.price),
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis width={45} />
                <Tooltip formatter={(v) => money(v)} />
                <Bar
                  dataKey="price"
                  name="Average Price"
                  fill="#285c42"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      )}
      <p className="fine-print">
        Summary cards cover current verified quotations. Exports include the
        displayed page. Estimates do not guarantee future prices or earnings.
      </p>
    </>
  );
}
