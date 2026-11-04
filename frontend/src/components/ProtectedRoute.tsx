import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAdmin();

  //If no token exists, redirect to login page
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  //if token exists
  return <>{children}</>;
}
