import "./App.css";
import Sidebar from "./components/Sidebar";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  // The Admin Dashboard is shown at /admin.
  // Every other address shows the Student Dashboard, exactly as before.
  const path = window.location.pathname;
  const isAdminPage = path === "/admin" || path.startsWith("/admin/");

  if (isAdminPage) {
    return <AdminDashboard />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <StudentDashboard />
    </div>
  );
}

export default App;
