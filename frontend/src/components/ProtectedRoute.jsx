import { Navigate } from "react-router-dom";
import { isLoggedIn, getUserRole } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;

  const role = getUserRole();
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
