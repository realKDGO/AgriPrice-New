import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { money } from "../../utils/format";
export default function PriceChart({
  data,
  forecast = false,
  compact = false,
}) {
  return (
    <div
      className={compact ? "chart compact" : "chart"}
      role="img"
      aria-label={
        forecast
          ? "Illustrative crop price forecast in pesos per kilogram"
          : "Historical crop prices in pesos per kilogram"
      }
    >
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <ComposedChart
          data={data}
          margin={{ top: 15, right: 10, bottom: 0, left: compact ? -25 : 0 }}
        >
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22845b" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#22845b" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e9eeea" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            minTickGap={25}
            tick={{ fontSize: 12, fill: "#66756d" }}
          />
          <YAxis
            width={48}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#66756d" }}
            tickFormatter={(v) => "₱" + v}
            domain={["auto", "auto"]}
          />
          <Tooltip
            formatter={(v) => money(v) + "/kg"}
            contentStyle={{ borderRadius: 12, border: "1px solid #e0e8e2" }}
          />
          <Area
            type="monotone"
            dataKey="price"
            name={forecast ? "Estimated price" : "Recorded price"}
            stroke="#227a53"
            strokeWidth={2.5}
            dot={data.length === 1 ? { r: 5, fill: "#227a53" } : false}
            fill="url(#priceFill)"
            strokeDasharray={forecast ? "6 4" : undefined}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
