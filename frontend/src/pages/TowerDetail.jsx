import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiGet } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import MetricCard from "../components/layout/MetricCard.jsx";
import StatusPill from "../components/layout/StatusPill.jsx";

export default function TowerDetail({ towerId, onSelectTower }) {
  const { token } = useAuth();
  const [tower, setTower] = useState(null);
  const [towers, setTowers] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const [detail, list] = await Promise.all([
        apiGet(`/tower/${towerId}`, token),
        apiGet("/tower", token),
      ]);
      if (mounted) {
        setTower(detail);
        setTowers(list.items);
      }
    }
    load();
    const interval = setInterval(load, 6000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [token, towerId]);

  if (!tower) {
    return <div className="glass-card p-8 text-slate-300">Loading tower details...</div>;
  }

  const current = tower.current;

  return (
    <div className="space-y-5">
      <section className="glass-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow text-cyanline">Cell Site Details</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">{tower.tower.name}</h2>
            <p className="mt-2 text-slate-400">{tower.tower.region} | Bands {tower.tower.bands.join(", ")} | {tower.tower.cells} active cells</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={towerId} onChange={(event) => onSelectTower(event.target.value)} className="field-input max-w-xs">
              {towers.map((item) => <option key={item.id} value={item.id}>{item.id} - {item.region}</option>)}
            </select>
            <StatusPill status={current.status} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="RSRP" value={current.rsrp} suffix=" dBm" detail="Signal power" />
        <MetricCard label="SINR" value={current.sinr} suffix=" dB" tone="purple" detail="Signal quality" />
        <MetricCard label="Throughput" value={current.throughput_mbps} suffix=" Mbps" tone="green" detail="Downlink" />
        <MetricCard label="Latency" value={current.latency_ms} suffix=" ms" tone="amber" detail="Round trip" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="chart-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">KPI History</p>
              <h3>{towerId} Performance Trend</h3>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tower.history}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#081626", border: "1px solid rgba(255,255,255,.14)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="health_score" stroke="#00f5a0" strokeWidth={3} dot={false} name="Health score" />
                <Line type="monotone" dataKey="latency_ms" stroke="#f6c85f" strokeWidth={3} dot={false} name="Latency" />
                <Line type="monotone" dataKey="sinr" stroke="#21d4fd" strokeWidth={3} dot={false} name="SINR" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Operations Notes</p>
              <h3>Current Review</h3>
            </div>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <p className="rounded-lg bg-white/[0.04] p-3">RF: review SINR, RSRQ, and RSRP movement.</p>
            <p className="rounded-lg bg-white/[0.04] p-3">Capacity: monitor PRB utilization and throughput.</p>
            <p className="rounded-lg bg-white/[0.04] p-3">Mobility: check handover success rate trend.</p>
            <p className="rounded-lg bg-cyanline/10 p-3 text-cyanline">Action: verify alarms, neighboring cells, and transport latency.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
