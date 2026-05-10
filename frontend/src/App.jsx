import { useMemo, useState } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import TowerDetail from "./pages/TowerDetail.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import Header from "./components/layout/Header.jsx";

export default function App() {
  const { token, authStatus } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedTower, setSelectedTower] = useState("CELL-102");

  const view = useMemo(() => {
    if (activeView === "tower") {
      return <TowerDetail towerId={selectedTower} onSelectTower={setSelectedTower} />;
    }
    return <Dashboard onOpenTower={(towerId) => {
      setSelectedTower(towerId);
      setActiveView("tower");
    }} />;
  }, [activeView, selectedTower]);

  if (!token) {
    return (
      <div className="min-h-screen bg-ink p-6 text-slate-100">
        <div className="glass-card mx-auto mt-16 max-w-lg p-6 text-slate-300">
          {authStatus === "error" ? "Unable to connect to the backend API." : "Loading network dashboard..."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <div className="app-shell">
        <Sidebar activeView={activeView} onChange={setActiveView} />
        <main className="min-w-0 flex-1 px-4 py-4 lg:px-7">
          <Header />
          {view}
        </main>
      </div>
    </div>
  );
}
