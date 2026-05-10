import { useAuth } from "../../context/AuthContext.jsx";

export default function Header() {
  const { displayName, role, logout } = useAuth();

  return (
    <header className="mb-5 flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-cyanline">5G RAN Performance</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">Network Overview</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-white">{displayName}</p>
          <p className="text-xs text-slate-400">{role} access</p>
        </div>
        <button onClick={logout} className="icon-button" title="Sign out">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
