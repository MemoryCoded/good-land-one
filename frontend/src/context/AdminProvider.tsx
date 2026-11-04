import { useState } from "react";
import { AdminContext } from "./AdminContext";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem("admin_token"),
  );

  const login = (newToken: string) => {
    sessionStorage.setItem("admin_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    sessionStorage.removeItem("admin_token");
    setToken(null);
  };

  return (
    <AdminContext.Provider value={{ token, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}
