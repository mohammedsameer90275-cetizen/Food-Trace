import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import styles from "./Signup.module.css";
import { api } from "../../utils/api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    role: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, _setShowPassword] = useState(false);
  const [showConfirmPassword, _setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // Full Name: only letters and spaces
    if (name === "fullname") {
      newValue = value.replace(/[^A-Za-z ]/g, "");
    }

    // Phone Number
    if (name === "phone") {
      newValue = value.replace(/\D/g, "");

      // First digit must be 6-9
      if (newValue.length === 1 && !/[6-9]/.test(newValue)) {
        return;
      }

      // Maximum 10 digits
      newValue = newValue.slice(0, 10);
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Full Name
    if (!form.fullname.trim()) {
      newErrors.fullname = "Full Name is required.";
    } else if (!/^[A-Za-z ]{3,50}$/.test(form.fullname)) {
      newErrors.fullname =
        "Only letters and spaces (minimum 3 characters).";
    }

    // Email
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    // Phone
    if (!form.phone) {
      newErrors.phone = "Phone Number is required.";
    } else if (!/^[6-9]\d{9}$/.test(form.phone)) {
      newErrors.phone =
        "Phone number must start with 6-9 and contain exactly 10 digits.";
    }

    // Role
    if (!form.role) {
      newErrors.role = "Please select a role.";
    }

    // Username
    if (!form.username.trim()) {
      newErrors.username = "Username is required.";
    } else if (!/^[A-Za-z0-9_]{4,20}$/.test(form.username)) {
      newErrors.username =
        "Username must be 4-20 characters (letters, numbers, underscore).";
    }

    // Password
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
        form.password
      )
    ) {
      newErrors.password =
        "Minimum 8 characters with uppercase, lowercase, number & special character.";
    }

    // Confirm Password
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = () => {
    let score = 0;

    if (form.password.length >= 8) score++;
    if (/[A-Z]/.test(form.password)) score++;
    if (/[a-z]/.test(form.password)) score++;
    if (/\d/.test(form.password)) score++;
    if (/[@$!%*?&]/.test(form.password)) score++;

    if (score <= 2) return "Weak";
    if (score <= 4) return "Medium";
    return "Strong";
  };

  const signup = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const data = await api.post("/auth/signup", form, {
        auth: false,
      });

      alert(data.message || "Account Created Successfully!");

      setForm({
        fullname: "",
        email: "",
        phone: "",
        role: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});

      navigate("/login");
    } catch (err) {
      alert(err.message || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Left Banner */}
        <div className={styles.left}></div>

        {/* Right Form */}
        <div className={styles.right}>

          <img
            src={logo}
            className={styles.logo}
            alt="FoodTrace Logo"
          />

          <h2>User Registration</h2>

        <input
  type="text"
  name="fullname"
  placeholder="Full Name"
  value={form.fullname}
  onChange={handleChange}
  className={errors.fullname ? styles.inputError : ""}
/>

{errors.fullname && (
  <p className={styles.error}>{errors.fullname}</p>
)}

          <input
  type="email"
  name="email"
  placeholder="Email"
  value={form.email}
  onChange={handleChange}
  className={errors.email ? styles.inputError : ""}
/>

{errors.email && (
  <p className={styles.error}>{errors.email}</p>
)}

         <input
  type="tel"
  name="phone"
  placeholder="Phone Number"
  value={form.phone}
  onChange={handleChange}
  maxLength={10}
  className={errors.phone ? styles.inputError : ""}
/>

{errors.phone && (
  <p className={styles.error}>{errors.phone}</p>
)}

          <select
  name="role"
  value={form.role}
  onChange={handleChange}
  className={errors.role ? styles.inputError : ""}
>
  <option value="">Select Role</option>

  <option value="Farmer">
    Farmer
  </option>

  <option value="Distributor">
    Distributor
  </option>

  <option value="Retailer">
    Retailer
  </option>

  <option value="Consumer">
    Consumer
  </option>

</select>

{errors.role && (
  <p className={styles.error}>
    {errors.role}
  </p>
)}

          <input
  type="text"
  name="username"
  placeholder="Username"
  value={form.username}
  onChange={handleChange}
  className={errors.username ? styles.inputError : ""}
/>

{errors.username && (
  <p className={styles.error}>{errors.username}</p>
)}
         <input
  type={showPassword ? "text" : "password"}
  name="password"
  placeholder="Password"
  value={form.password}
  onChange={handleChange}
  className={errors.password ? styles.inputError : ""}
/>

{errors.password && (
  <p className={styles.error}>{errors.password}</p>
)}

<p className={styles.strength}>
  Password Strength: <b>{getPasswordStrength()}</b>
</p>
<input
  type={showConfirmPassword ? "text" : "password"}
  name="confirmPassword"
  placeholder="Confirm Password"
  value={form.confirmPassword}
  onChange={handleChange}
  className={errors.confirmPassword ? styles.inputError : ""}
/>

{errors.confirmPassword && (
  <p className={styles.error}>
    {errors.confirmPassword}
  </p>
)}

       <button
  onClick={signup}
  disabled={loading}
>
  {loading ? "Creating Account..." : "Create Account"}
</button>

          <p className={styles.loginText}>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>
              Login
            </span>
          </p>


        </div>

      </div>
    </div>
  );
}
