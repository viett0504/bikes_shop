import { Navigate } from "react-router-dom";
import { useAuth } from "../../../helpers/authContext";

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <div className="p-6">403 - Forbidden</div>;
  return children;
}
