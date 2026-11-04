// Sidebar for the Admin Portal.
// It uses the same CSS classes as the Student sidebar (sidebar, logo, menu,
// menu-item, sidebar-bottom) so both portals look the same.
// Props:
//   activeView   - the id of the page currently shown
//   onChangeView - function called with a page id when a menu item is clicked

const menuItems = [
  { id: "overview", label: "Overview" },
  { id: "complaints", label: "Complaints" },
  { id: "analytics", label: "Analytics" },
];

function AdminSidebar({ activeView, onChangeView }) {
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
        <p>Admin Portal</p>
        <a href="/" className="sidebar-switch-link">
          Switch to Student Portal
        </a>
      </div>
    </div>
  );
}

export default AdminSidebar;
