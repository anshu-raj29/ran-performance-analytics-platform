import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function KpiLineChart({ data }) {
  return (
    <div className="chart-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Live KPI Drift</p>
          <h3>Signal Quality and Latency</h3>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="tower_id" stroke="#94a3b8" tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "#081626", border: "1px solid rgba(255,255,255,.14)", borderRadius: 8 }} />
            <Line type="monotone" dataKey="sinr" stroke="#21d4fd" strokeWidth={3} dot={false} name="SINR dB" />
            <Line type="monotone" dataKey="latency_ms" stroke="#f6c85f" strokeWidth={3} dot={false} name="Latency ms" />
            <Line type="monotone" dataKey="packet_loss_pct" stroke="#ff4d6d" strokeWidth={3} dot={false} name="Packet loss %" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
