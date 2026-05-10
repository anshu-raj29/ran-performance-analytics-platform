import { useMemo, useState } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import TowerDetail from "./pages/TowerDetail.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import Header from "./components/layout/Header.jsx";

export default function App() {
  const { token } = useAuth();
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
    return <Login />;
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
