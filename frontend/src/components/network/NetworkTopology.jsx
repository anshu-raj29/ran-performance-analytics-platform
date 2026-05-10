import StatusPill from "../layout/StatusPill.jsx";

const positions = [
  { x: 12, y: 32 },
  { x: 32, y: 18 },
  { x: 50, y: 40 },
  { x: 68, y: 22 },
  { x: 84, y: 48 },
  { x: 28, y: 66 },
  { x: 54, y: 74 },
  { x: 78, y: 76 },
];

export default function NetworkTopology({ towers, onOpenTower }) {
  return (
    <div className="chart-panel overflow-hidden">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Network Topology</p>
          <h3>RAN Cell Site Map</h3>
        </div>
      </div>
      <div className="topology-grid">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="link" x1="0" x2="1">
              <stop offset="0%" stopColor="#21d4fd" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#7c5cff" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {positions.slice(0, -1).map((point, index) => (
            <line
              key={`${point.x}-${point.y}`}
              x1={point.x}
              y1={point.y}
              x2={positions[index + 1].x}
              y2={positions[index + 1].y}
              stroke="url(#link)"
              strokeWidth="0.7"
            />
          ))}
        </svg>
        {towers.map((tower, index) => {
          const point = positions[index] || positions[0];
          return (
            <button
              key={tower.tower_id}
              type="button"
              onClick={() => onOpenTower(tower.tower_id)}
              className={`tower-node node-${tower.status?.toLowerCase()}`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              title={`${tower.tower_id} ${tower.status}`}
            >
              <span className="tower-pulse" />
              <span className="tower-mast" />
              <span className="mt-2 text-[10px] font-semibold">{tower.tower_id}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {towers.slice(0, 4).map((tower) => (
          <div key={tower.tower_id} className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2">
            <span className="text-sm text-slate-300">{tower.tower_id}</span>
            <StatusPill status={tower.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
