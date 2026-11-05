import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        <h1>CampusFix</h1>
        <p>Campus Maintenance Portal</p>
      </div>

      <nav className="menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "menu-item menu-item-active" : "menu-item"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/submit"
          className={({ isActive }) =>
            isActive ? "menu-item menu-item-active" : "menu-item"
          }
        >
          Submit Complaint
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? "menu-item menu-item-active" : "menu-item"
            }
          >
            🛡️ Admin Portal
          </NavLink>
        )}
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
                background: user.role === "admin" ? "#f59e0b" : "#3b82f6",
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

        <button
          type="button"
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "9px 12px",
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
    </aside>
  );
}

export default Sidebar;
