import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function TowerComparison({ data }) {
  return (
    <div className="chart-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Tower Comparison</p>
          <h3>Throughput by Cell Site</h3>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="tower_id" stroke="#94a3b8" tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "#081626", border: "1px solid rgba(255,255,255,.14)", borderRadius: 8 }} />
            <Bar dataKey="throughput_mbps" name="Throughput Mbps" fill="#7c5cff" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
