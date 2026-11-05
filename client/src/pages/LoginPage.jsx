import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { loginUser } from "../services/api";
import "../styles/auth.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await loginUser({ email: email.trim(), password });
      login(data.token, data.user);

      // Redirect based on role or original destination
      if (from) {
        navigate(from, { replace: true });
      } else if (data.user?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Failed to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">CF</div>
          <h1>Sign in to CampusFix</h1>
          <p>Campus Maintenance & Facility Management</p>
        </div>

        {error && <div className="auth-alert auth-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-field">
            <label htmlFor="login-email">Campus Email</label>
            <input
              id="login-email"
              type="email"
              placeholder="e.g., student@campusfix.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-demo-box">
          <div className="auth-demo-title">Quick Demo Login</div>
          <div className="auth-demo-buttons">
            <button
              type="button"
              className="auth-demo-btn"
              onClick={() => handleFillDemo("student@campusfix.edu", "student123")}
            >
              🎓 Student Demo
            </button>
            <button
              type="button"
              className="auth-demo-btn"
              onClick={() => handleFillDemo("admin@campusfix.edu", "admin123")}
            >
              🛡️ Admin Demo
            </button>
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Create one here</Link>
        </div>
      </div>
    </div>
  );
}
