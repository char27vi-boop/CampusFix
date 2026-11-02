
function Sidebar() {
  return (
    <div className="sidebar">

      <div className="logo">
        <h1>CampusFix</h1>
        <p>Campus Maintenance Portal</p>
      </div>

      <div className="menu">
        <a href="#dashboard" className="menu-item">
          Dashboard
        </a>

        <a href="#complaints" className="menu-item">
          My Complaints
        </a>

        <a href="#submit" className="menu-item">
          Submit Complaint
        </a>
      </div>

      <div className="sidebar-bottom">
        <p>Student Portal</p>
      </div>

    </div>
  );
}

export default Sidebar;
