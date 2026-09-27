import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, Store } from "lucide-react";
import { Panel, Badge, Change } from "../../components/common/UI";
import { QueryState } from "../../components/common/Async";
import PriceChart from "../../components/common/PriceChart";
import { useApp } from "../../hooks/useApp";
import { useQuery } from "../../hooks/useQuery";
import { priceService } from "../../services/priceService";
import { marketService } from "../../services/marketService";
import { money, movement } from "../../utils/format";
export default function Home() {
  const { data, session } = useApp();
  const crop =
    data.crops.find(
      (c) => c.id === data.settings.defaultCrop && c.status === "Active",
    ) || data.crops.find((c) => c.status === "Active");
  const query = useQuery(async () => {
    if (!crop) return null;
    const result = await marketService.compare({
      cropId: crop.id,
      quantity: 100,
      otherExpenses: 0,
    });
    const best = result[0];
    if (!best) return null;
    const history = await priceService.history({
      cropId: crop.id,
      marketId: best.marketId,
      dateFrom: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
      limit: 100,
    });
    return { best, history: history.items.reverse() };
  }, [crop?.id]);
  const best = query.data?.best;
  return (
    <>
      <section className="dashboard-welcome">
        <h2>Welcome back, {session.firstName}</h2>
        <p>Review the latest available market information.</p>
      </section>
      <QueryState query={query}>
        {best ? (
          <>
            <Panel className="featured-card">
              <div className="featured-crop">
                <Badge>FEATURED CROP UPDATE</Badge>
                <div className="featured-ident">
                  <img src={crop.image} alt={`${crop.name} crop`} />
                  <div>
                    <h2>{crop.name}</h2>
                    <p className="muted">{best.market.name}</p>
                  </div>
                </div>
                <small>UPDATED {best.date.slice(0, 10)}</small>
                <strong>
                  {money(best.price)}
                  <span>/kg</span>
                </strong>
                {best.previousPrice && (
                  <Change
                    value={movement(
                      Number(best.price),
                      Number(best.previousPrice),
                    )}
                  />
                )}
              </div>
              <div className="trend-card">
                <h3>30-DAY TREND</h3>
                {query.data.history.length ? (
                  <PriceChart
                    data={query.data.history.map((r) => ({
                      ...r,
                      price: Number(r.price),
                      label: r.date.slice(5, 10),
                    }))}
                    compact
                  />
                ) : (
                  <p>No verified records in the past 30 days.</p>
                )}
                <Link className="button" to="/farmer/forecast">
                  View Forecast <ArrowRight size={17} />
                </Link>
              </div>
            </Panel>
            <Panel className="market-insight">
              <span className="quick-icon">
                <Lightbulb size={22} />
              </span>
              <div>
                <h2>Market Insight</h2>
                <p>
                  Compare prices and transportation before choosing where to
                  sell.
                </p>
                <Link className="button secondary small" to="/farmer/markets">
                  Compare Markets <ArrowRight size={16} />
                </Link>
              </div>
            </Panel>
            <Panel className="best-market">
              <div>
                <span className="quick-icon">
                  <Store size={22} />
                </span>
                <div>
                  <small>Best Available Market · 100 kg of {crop.name}</small>
                  <h2>{best.market.name}</h2>
                </div>
              </div>
              <div className="market-metrics">
                <div>
                  <strong>{money(best.net)}</strong>
                  <span>Estimated Net Return</span>
                </div>
                <div>
                  <strong>
                    {best.market.distanceKm === null
                      ? "Not recorded"
                      : `${best.market.distanceKm} km`}
                  </strong>
                  <span>Distance</span>
                </div>
                <div>
                  <strong>{money(best.transport)}</strong>
                  <span>Transportation</span>
                </div>
              </div>
              <Link className="button w-full" to="/farmer/markets">
                View Market <ArrowRight size={17} />
              </Link>
            </Panel>
          </>
        ) : (
          <Panel>
            <h2>No verified crop prices yet</h2>
            <p>Price updates will appear after MAO verification.</p>
          </Panel>
        )}
      </QueryState>
    </>
  );
}
