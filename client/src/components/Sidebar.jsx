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
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">
              {user.name}
            </p>
            <div className="sidebar-user-meta">
              <span className={`sidebar-role-badge role-${user.role}`}>
                {user.role}
              </span>
              <span className="sidebar-user-email">
                {user.email}
              </span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="sidebar-logout-btn"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
