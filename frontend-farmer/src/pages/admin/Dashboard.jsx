import { Users, UserCog, Shield, Activity } from "lucide-react";
import {
  PageHead,
  Panel,
  Stat,
  Records,
  Badge,
  SectionHead,
} from "../../components/common/UI";
import { QueryState } from "../../components/common/Async";
import { useQuery } from "../../hooks/useQuery";
import { get } from "../../services/api";
export default function Dashboard() {
  const query = useQuery(async () => ({
    summary: await get("/admin/dashboard"),
    health: await get("/admin/monitoring"),
  }));
  const s = query.data?.summary;
  return (
    <>
      <PageHead
        title="System Overview"
        description="Manage accounts, review activity, and monitor the application."
      />
      <QueryState query={query}>
        <div className="stats-grid four">
          {[
            [Users, "Total Users", s?.total],
            [Users, "Active Farmers", s?.activeFarmers],
            [UserCog, "Active MAO Accounts", s?.activeMao],
            [Shield, "Suspended Accounts", s?.suspended],
          ].map(([icon, label, value]) => (
            <Stat key={label} icon={icon} label={label} value={value} />
          ))}
        </div>
        <Panel>
          <SectionHead
            title="Service Status"
            to="/admin/monitoring"
            label="View Details"
          />
          {query.data?.health.services.map((s) => (
            <div className="status-row" key={s.name}>
              <strong>{s.name}</strong>
              <Badge>{s.status}</Badge>
            </div>
          ))}
        </Panel>
        <Panel>
          <SectionHead
            title="Recent System Activity"
            to="/admin/activity"
            label="All Audit Logs"
          />
          <Records
            rows={s?.recent || []}
            columns={[
              { key: "action", label: "Activity" },
              {
                key: "actor",
                label: "Account",
                render: (r) =>
                  r.actor
                    ? `${r.actor.firstName} ${r.actor.lastName}`
                    : "System / Unknown",
              },
              {
                key: "createdAt",
                label: "Date",
                render: (r) => new Date(r.createdAt).toLocaleString(),
              },
              { key: "status", label: "Result" },
            ]}
          />
        </Panel>
      </QueryState>
    </>
  );
}
