import { Navigate, Outlet } from "react-router";
import { getToken } from "../../utils";

export default function ProtectedRoute() {
  return getToken() ? <Outlet /> : <Navigate to="login" />;
}
