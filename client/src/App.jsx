import { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import StudentDashboard from "./pages/StudentDashboard";
import ComplaintForm from "./components/ComplaintForm";

function App() {
  // Track active page route based on URL hash (#dashboard or #submit)
  const [currentRoute, setCurrentRoute] = useState(
    window.location.hash || "#dashboard"
  );

  useEffect(() => {
    // Sync active view when user clicks sidebar menu links
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || "#dashboard");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

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
