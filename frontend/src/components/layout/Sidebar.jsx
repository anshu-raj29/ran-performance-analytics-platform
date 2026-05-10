const items = [
  { id: "dashboard", label: "RAN Overview", icon: "M4 12h16M12 4v16" },
  { id: "tower", label: "Tower Details", icon: "M12 20V7m0 0 5 13M12 7 7 20M8 7h8" },
];

export default function Sidebar({ activeView, onChange }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950/60 px-4 py-5 backdrop-blur-xl lg:block">
      <div className="mb-8">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg border border-cyanline/40 bg-cyanline/10 shadow-glow">
          <span className="text-lg font-bold text-cyanline">R</span>
        </div>
        <h1 className="text-lg font-semibold leading-tight text-white">RAN Analytics</h1>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cyanline/80">Network Operations</p>
      </div>

      <nav className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`nav-button ${activeView === item.id ? "nav-button-active" : ""}`}
            title={item.label}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.04] p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Model</p>
        <p className="mt-2 text-sm font-medium text-white">Isolation Forest</p>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          KPI scoring across RSRP, SINR, PRB, latency, and packet loss.
        </p>
      </div>
    </aside>
  );
}
