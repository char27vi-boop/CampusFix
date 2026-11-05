import { useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "../services/api";
import { AuthContext } from "./authContextDef";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("campusfix_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("campusfix_token") || null;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Logout callback
  const logout = useCallback(() => {
    localStorage.removeItem("campusfix_token");
    localStorage.removeItem("campusfix_user");
    setToken(null);
    setUser(null);
  }, []);

  // Login callback
  const login = useCallback((newToken, newUser) => {
    localStorage.setItem("campusfix_token", newToken);
    localStorage.setItem("campusfix_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  // Verify stored token on initial app load
  useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      const storedToken = localStorage.getItem("campusfix_token");
      if (!storedToken) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const freshUser = await getCurrentUser(storedToken);
        if (isMounted) {
          setUser(freshUser);
          localStorage.setItem("campusfix_user", JSON.stringify(freshUser));
        }
      } catch (err) {
        console.warn("Session verification failed, logging out:", err.message);
        if (isMounted) {
          logout();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [logout]);

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === "admin",
    isStaff: user?.role === "staff",
    isStudent: user?.role === "student"
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
