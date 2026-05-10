import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginRequest } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem("ran-session");
    return saved ? JSON.parse(saved) : null;
  });
  const [authStatus, setAuthStatus] = useState(session ? "ready" : "loading");

  async function login(username, password) {
    const response = await loginRequest(username, password);
    const nextSession = {
      token: response.access_token,
      role: response.role,
      displayName: response.display_name,
    };
    localStorage.setItem("ran-session", JSON.stringify(nextSession));
    setSession(nextSession);
    setAuthStatus("ready");
  }

  function logout() {
    localStorage.removeItem("ran-session");
    setSession(null);
    setAuthStatus("loading");
  }

  useEffect(() => {
    if (session || authStatus !== "loading") {
      return;
    }

    login("admin", "admin123").catch(() => {
      setAuthStatus("error");
    });
  }, [authStatus, session]);

  const value = useMemo(
    () => ({
      token: session?.token,
      role: session?.role,
      displayName: session?.displayName,
      authStatus,
      login,
      logout,
    }),
    [authStatus, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
