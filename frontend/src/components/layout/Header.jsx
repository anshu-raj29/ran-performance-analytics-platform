export default function Header() {
  return (
    <header className="mb-5 flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-cyanline">5G RAN Performance</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">Network Overview</h2>
      </div>
    </header>
  );
}
