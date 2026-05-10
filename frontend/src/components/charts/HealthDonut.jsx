import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#00f5a0", "#f6c85f", "#ff4d6d"];

export default function HealthDonut({ distribution }) {
  const data = [
    { name: "Healthy", value: distribution?.healthy || 0 },
    { name: "Warning", value: distribution?.warning || 0 },
    { name: "Critical", value: distribution?.critical || 0 },
  ];

  return (
    <div className="chart-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Network Health</p>
          <h3>RAN Status Distribution</h3>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={62} outerRadius={92} paddingAngle={4}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#081626", border: "1px solid rgba(255,255,255,.14)", borderRadius: 8 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-300">
        {data.map((item, index) => (
          <div key={item.name} className="rounded-lg bg-white/[0.04] p-2">
            <span className="mx-auto mb-1 block h-2 w-7 rounded-full" style={{ background: COLORS[index] }} />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
