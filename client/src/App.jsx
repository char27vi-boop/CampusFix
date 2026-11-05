import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import StudentDashboard from "./pages/StudentDashboard";
import ComplaintForm from "./components/ComplaintForm";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import "./App.css";

// Shared layout for student views (Sidebar + page content)
function StudentLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      {children}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Student Portal (Accessible by student, admin, and staff) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student", "admin", "staff"]}>
                <StudentLayout>
                  <StudentDashboard />
                </StudentLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/submit"
            element={
              <ProtectedRoute allowedRoles={["student", "admin", "staff"]}>
                <StudentLayout>
                  <ComplaintForm />
                </StudentLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Portal (Strictly protected: admin role only) */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Root redirect to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
