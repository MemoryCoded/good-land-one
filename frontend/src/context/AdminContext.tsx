import { createContext, useContext } from "react";

export interface AdminContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// 1. Create the context
export const AdminContext = createContext<AdminContextType>({
  token: null,
  login: () => {},
  logout: () => {},
});

// 2. Export the hook here
export const useAdmin = () => useContext(AdminContext);
