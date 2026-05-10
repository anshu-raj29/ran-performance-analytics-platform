import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-screen">
      <section className="login-hero">
        <div className="login-orbit" />
        <div className="relative z-10 max-w-2xl">
          <p className="eyebrow text-cyanline">5G RAN Operations</p>
          <h1 className="mt-5 text-5xl font-semibold leading-tight text-white md:text-7xl">
            Intelligent RAN Performance Analytics
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Cell-site KPI monitoring, network health, alerts, and performance trends in one operations dashboard.
          </p>
        </div>
      </section>
      <section className="login-panel">
        <form onSubmit={handleSubmit} className="glass-card w-full max-w-md p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-cyanline">RAN Console</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Operations Sign In</h2>
          <div className="mt-6 space-y-4">
            <label className="field-label">
              Username
              <input value={username} onChange={(event) => setUsername(event.target.value)} className="field-input" />
            </label>
            <label className="field-label">
              Password
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="field-input" />
            </label>
          </div>
          {error && <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">{error}</p>}
          <button type="submit" className="primary-button mt-6 w-full" disabled={loading}>
            {loading ? "Signing in..." : "Open Dashboard"}
          </button>
          <div className="mt-5 grid gap-2 text-xs text-slate-400">
            <p>Admin: admin / admin123</p>
            <p>Analyst: analyst / analyst123</p>
          </div>
        </form>
      </section>
    </main>
  );
}
