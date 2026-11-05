import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      alignItems: "center",
      justifyContent: "center",
      background: "#f1f5f9",
      padding: "24px",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{
        background: "#ffffff",
        padding: "40px 32px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        maxWidth: "480px",
        width: "100%",
        textAlign: "center"
      }}>
        <div style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "#fee2e2",
          color: "#dc2626",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
          margin: "0 auto 20px"
        }}>
          🛡️
        </div>

        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
          Access Denied
        </h1>

        <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.5", marginBottom: "24px" }}>
          You are signed in as <strong>{user?.name || "Student"}</strong> ({user?.role || "student"}),
          which does not have administrative permissions to view this portal.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link
            to="/dashboard"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              background: "#2563eb",
              color: "#ffffff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "14px"
            }}
          >
            Go to Student Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
