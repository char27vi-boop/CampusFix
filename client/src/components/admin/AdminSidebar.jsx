import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const menuItems = [
  { id: "overview", label: "Overview" },
  { id: "complaints", label: "Complaints" },
  { id: "analytics", label: "Analytics" },
];

function AdminSidebar({ activeView, onChangeView }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <h1>CampusFix</h1>
        <p>Campus Maintenance Portal</p>
      </div>

      <nav className="menu" aria-label="Admin navigation">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={
              activeView === item.id ? "menu-item menu-item-active" : "menu-item"
            }
            aria-current={activeView === item.id ? "page" : undefined}
            onClick={() => onChangeView(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        {user && (
          <div style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
            <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "600", color: "#FFFFFF" }}>
              {user.name}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "11px",
                textTransform: "uppercase",
                fontWeight: "700",
                background: "#f59e0b",
                color: "#ffffff"
              }}>
                {user.role}
              </span>
              <span style={{ fontSize: "12px", color: "#DCE3DC" }}>
                {user.email}
              </span>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Link
            to="/dashboard"
            className="sidebar-switch-link"
            style={{
              display: "block",
              textAlign: "center",
              padding: "8px 12px",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "6px",
              color: "#E5EBE5",
              textDecoration: "none",
              fontSize: "13px"
            }}
          >
            Switch to Student Portal
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "8px 12px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "6px",
              color: "#fca5a5",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              textAlign: "center"
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;
