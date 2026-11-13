import { useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import styles from "./AdminLogin.module.css";
import { api } from "../../utils/api";

// Separate admin-only login screen. This page is never linked from the
// public site or the regular user Login page — an admin has to know the
// direct URL (/admin-login) to reach it. Regular users only ever see the
// normal /login screen.
export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (token && user?.role === "Admin") {
      window.location.href = "/admin";
    }
  }, []);

  const login = async () => {
    setError("");

    if (username.trim() === "" || password.trim() === "") {
      setError("Please enter Admin Username and Password");
      return;
    }

    setLoading(true);

    try {
      const data = await api.post("/auth/login", {
        loginType: "admin",
        username: username.trim(),
        password,
      });

      // The backend already refuses this request unless the account's
      // role is "admin" (see loginType === "admin" check in
      // auth.routes.js), so no non-admin account can ever land here.
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", data.access || data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert(data.message);

      window.location.href = "/admin";
    } catch (err) {
      setError(err.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img src={logo} className={styles.logo} alt="FoodTrace Logo" />

        <span className={styles.badge}>
          <i className="fa-solid fa-shield-halved"></i> Admin Access
        </span>

        <h2>Admin Login</h2>
        <p className={styles.subtitle}>
          Full-access sign-in for FoodTrace administrators only.
        </p>

        <input
          type="text"
          placeholder="Admin Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
        />

        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
        />

        <button onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login as Admin"}
        </button>

        <p className={styles.error}>{error}</p>
      </div>
    </div>
  );
}
