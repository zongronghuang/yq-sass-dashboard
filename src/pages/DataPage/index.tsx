import { Navigate } from "react-router";
import { getToken } from "../../utils";

export default function DataPage() {
  // private route
  if (!getToken()) return <Navigate to="/login" />;

  return <div>data page</div>;
}
