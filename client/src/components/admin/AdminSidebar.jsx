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
    <aside className="sidebar">
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

        <div className="sidebar-actions-group">
          <Link
            to="/dashboard"
            className="sidebar-switch-btn"
          >
            ← Switch to Student Portal
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="sidebar-logout-btn"
          >
            Log Out
          </button>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
