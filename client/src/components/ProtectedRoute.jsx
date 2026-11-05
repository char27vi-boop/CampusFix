import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import UnauthorizedPage from "../pages/UnauthorizedPage";

/**
 * ProtectedRoute Component with Role-Based Access Control (RBAC).
 *
 * Props:
 * - allowedRoles: Optional array of string roles (e.g. ['admin'], ['student', 'admin'])
 * - children: Component to render if checks pass
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        color: "#64748b",
        fontSize: "16px",
        fontFamily: "system-ui, sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "36px",
            height: "36px",
            border: "3px solid #e2e8f0",
            borderTopColor: "#2563eb",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 12px"
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          Loading CampusFix...
        </div>
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, verify user's role
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (user?.role || "").toLowerCase();
    const hasPermission = allowedRoles.some(
      (role) => role.toLowerCase() === userRole
    );

    if (!hasPermission) {
      return <UnauthorizedPage />;
    }
  }

  return children;
}
