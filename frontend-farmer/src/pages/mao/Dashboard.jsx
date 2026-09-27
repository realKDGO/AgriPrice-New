import { Link } from "react-router-dom";
import { Sprout, Store, ShieldCheck, Tags } from "lucide-react";
import { PageHead, Panel, Stat, Records } from "../../components/common/UI";
import { QueryState } from "../../components/common/Async";
import { useQuery } from "../../hooks/useQuery";
import { reportService } from "../../services/reportService";
import { priceService } from "../../services/priceService";
import { money } from "../../utils/format";
export default function Dashboard() {
  const query = useQuery(async () => ({
    summary: await reportService.dashboard("MAO"),
    pending: await priceService.list({ status: "PENDING", limit: 10 }),
  }));
  const s = query.data?.summary;
  return (
    <>
      <PageHead
        title="Agricultural Overview"
        description="Manage crop and market information across monitored markets."
        action={
          <Link className="button" to="/mao/prices">
            Record a Price
          </Link>
        }
      />
      <QueryState query={query}>
        <div className="stats-grid four">
          {[
            [Sprout, "Active Crops", s?.activeCrops],
            [Store, "Monitored Markets", s?.activeMarkets],
            [Tags, "Verified Price Records", s?.verified],
            [ShieldCheck, "Awaiting Validation", s?.pending],
          ].map(([icon, label, value]) => (
            <Stat key={label} icon={icon} label={label} value={value} />
          ))}
        </div>
        <Panel>
          <h2>Prices Needing Attention</h2>
          <Records
            rows={query.data?.pending.items || []}
            columns={[
              { key: "crop", label: "Crop", render: (r) => r.crop.name },
              { key: "market", label: "Market", render: (r) => r.market.name },
              {
                key: "price",
                label: "Submitted Price",
                render: (r) => money(r.price),
              },
            ]}
            actions={() => (
              <Link className="button secondary small" to="/mao/validation">
                Review Price
              </Link>
            )}
          />
        </Panel>
        <Panel>
          <h2>Recent Agricultural Activity</h2>
          <Records
            rows={s?.recent || []}
            columns={[
              { key: "action", label: "Action" },
              {
                key: "actor",
                label: "Account",
                render: (r) =>
                  r.actor
                    ? `${r.actor.firstName} ${r.actor.lastName}`
                    : "System",
              },
              {
                key: "createdAt",
                label: "Date",
                render: (r) => new Date(r.createdAt).toLocaleString(),
              },
            ]}
          />
        </Panel>
      </QueryState>
    </>
  );
}
