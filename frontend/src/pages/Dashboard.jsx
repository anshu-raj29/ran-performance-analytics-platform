import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import MetricCard from "../components/layout/MetricCard.jsx";
import StatusPill from "../components/layout/StatusPill.jsx";
import KpiLineChart from "../components/charts/KpiLineChart.jsx";
import HealthDonut from "../components/charts/HealthDonut.jsx";
import TowerComparison from "../components/charts/TowerComparison.jsx";
import AnomalyHeatmap from "../components/charts/AnomalyHeatmap.jsx";
import NetworkTopology from "../components/network/NetworkTopology.jsx";
import { severityClass } from "../utils/formatters.js";

export default function Dashboard({ onOpenTower }) {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [dashboard, networkHealth] = await Promise.all([
          apiGet("/dashboard", token),
          apiGet("/network-health", token),
        ]);
        if (mounted) {
          setData(dashboard);
          setHealth(networkHealth);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [token]);

  const summary = data?.summary;
  const liveKpis = data?.live_kpis || [];
  const alerts = data?.alerts || [];

  const topCells = useMemo(
    () => [...liveKpis].sort((a, b) => a.health_score - b.health_score).slice(0, 5),
    [liveKpis]
  );

  if (loading) {
    return <div className="glass-card p-8 text-slate-300">Loading RAN telemetry...</div>;
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="Total Towers" value={summary?.total_towers} detail="Tracked cell sites" />
        <MetricCard label="Active Towers" value={summary?.active_towers} tone="green" detail="Operational sites" />
        <MetricCard label="Down Towers" value={summary?.down_towers} tone="red" detail="Unavailable sites" />
        <MetricCard label="Critical Alerts" value={summary?.critical_alerts} tone="amber" detail="Open incidents" />
        <MetricCard label="Health Score" value={summary?.network_health_score} suffix="%" tone="purple" detail="KPI index" />
        <MetricCard label="SLA Compliance" value={summary?.sla_compliance} suffix="%" tone="green" detail="Current window" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <NetworkTopology towers={liveKpis} onOpenTower={onOpenTower} />
        <div className="chart-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Alerts</p>
              <h3>Incident Queue</h3>
            </div>
          </div>
          <div className="space-y-3">
            {alerts.length === 0 && <p className="rounded-lg bg-signal/10 p-4 text-sm text-signal">No critical alerts in the current window.</p>}
            {alerts.slice(0, 6).map((alert) => (
              <article key={alert.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{alert.title}</p>
                  <span className={`rounded-full border px-2 py-1 text-[11px] uppercase ${severityClass(alert.severity)}`}>{alert.severity}</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{alert.message}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {alert.root_cause_tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.75fr]">
        <KpiLineChart data={liveKpis} />
        <HealthDonut distribution={health?.distribution} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="chart-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Risk Ranking</p>
              <h3>Cells Requiring Attention</h3>
            </div>
          </div>
          <div className="space-y-3">
            {topCells.map((cell) => (
              <button key={cell.tower_id} onClick={() => onOpenTower(cell.tower_id)} className="risk-row">
                <div>
                  <p className="font-medium text-white">{cell.tower_id}</p>
                  <p className="text-sm text-slate-400">SINR {cell.sinr} dB, PRB {cell.prb_utilization_pct}%</p>
                </div>
                <div className="text-right">
                  <StatusPill status={cell.status} />
                  <p className="mt-2 text-sm text-slate-300">{cell.health_score}%</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <TowerComparison data={liveKpis} />
      </section>

      <AnomalyHeatmap data={liveKpis} />
    </div>
  );
}
