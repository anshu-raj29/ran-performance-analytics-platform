import { formatNumber } from "../../utils/formatters.js";

export default function MetricCard({ label, value, suffix, tone = "cyan", detail }) {
  return (
    <section className={`metric-card metric-${tone}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{formatNumber(value, suffix)}</p>
        </div>
        <span className="live-dot" />
      </div>
      {detail && <p className="mt-3 text-sm text-slate-300">{detail}</p>}
    </section>
  );
}
