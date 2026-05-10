export default function AnomalyHeatmap({ data }) {
  const metrics = ["rsrp", "rsrq", "sinr", "latency_ms", "packet_loss_pct", "prb_utilization_pct"];

  function intensity(record, metric) {
    const value = Number(record[metric]);
    if (metric === "sinr") return value < 8 ? "critical" : value < 14 ? "warning" : "healthy";
    if (metric === "latency_ms") return value > 65 ? "critical" : value > 45 ? "warning" : "healthy";
    if (metric === "packet_loss_pct") return value > 2.5 ? "critical" : value > 1.2 ? "warning" : "healthy";
    if (metric === "prb_utilization_pct") return value > 88 ? "critical" : value > 76 ? "warning" : "healthy";
    if (metric === "rsrp") return value < -102 ? "critical" : value < -94 ? "warning" : "healthy";
    if (metric === "rsrq") return value < -14 ? "critical" : value < -11 ? "warning" : "healthy";
    return "healthy";
  }

  return (
    <div className="chart-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">KPI Heatmap</p>
          <h3>Cell Quality Matrix</h3>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[620px]">
          <div className="grid grid-cols-[90px_repeat(6,1fr)] gap-2 text-xs text-slate-400">
            <span>Cell</span>
            {metrics.map((metric) => <span key={metric}>{metric.replaceAll("_", " ")}</span>)}
          </div>
          <div className="mt-3 space-y-2">
            {data.map((record) => (
              <div key={record.tower_id} className="grid grid-cols-[90px_repeat(6,1fr)] gap-2">
                <span className="text-sm font-medium text-slate-200">{record.tower_id}</span>
                {metrics.map((metric) => (
                  <span key={metric} className={`heat-cell heat-${intensity(record, metric)}`}>
                    {Number(record[metric]).toFixed(1)}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
