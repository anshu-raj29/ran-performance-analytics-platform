import { createContext, useContext, useMemo, useState } from "react";
import { loginRequest } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem("ran-session");
    return saved ? JSON.parse(saved) : null;
  });

  async function login(username, password) {
    const response = await loginRequest(username, password);
    const nextSession = {
      token: response.access_token,
      role: response.role,
      displayName: response.display_name,
    };
    localStorage.setItem("ran-session", JSON.stringify(nextSession));
    setSession(nextSession);
  }

  function logout() {
    localStorage.removeItem("ran-session");
    setSession(null);
  }

  const value = useMemo(
    () => ({
      token: session?.token,
      role: session?.role,
      displayName: session?.displayName,
      login,
      logout,
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
