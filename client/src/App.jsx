
import { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ComplaintForm from "./components/ComplaintForm";

function App() {
  // Handle Admin Dashboard routing
  const path = window.location.pathname;
  const isAdminPage = path === "/admin" || path.startsWith("/admin/");

  // Track active page using URL hash
  const [currentRoute, setCurrentRoute] = useState(
    window.location.hash || "#dashboard"
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || "#dashboard");
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Render Admin Dashboard independently
  if (isAdminPage) {
    return <AdminDashboard />;
  }

  // Render Student Dashboard or Complaint Form
  return (
    <div className="app-layout">
      <Sidebar />

      {currentRoute === "#submit" ? (
        <ComplaintForm
          onCancel={() => {
            window.location.hash = "#dashboard";
          }}
        />
      ) : (
        <StudentDashboard />
      )}
    </div>
  );
}

export default App;
