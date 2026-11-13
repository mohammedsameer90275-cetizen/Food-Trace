import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useRequireAuth } from "../../utils/auth";
import { api } from "../../utils/api";
import styles from "./Profile.module.css";

export default function Profile() {
  useRequireAuth();

  const [profile, setProfile] = useState({
    fullname: "",
    email: "",
    phone: "",
    username: "",
    role: "User",
  });

  useEffect(() => {
    api
      .get("/users/me")
      .then((user) =>
        setProfile({
          fullname: user.fullname || "",
          email: user.email || "",
          phone: user.phone || "",
          username: user.username || "",
          role: user.role || "User",
        })
      )
      .catch((err) => alert(err.message || "Failed to load profile"));
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async () => {
    try {
      const updated = await api.put("/users/me", profile);
      localStorage.setItem("username", updated.username);
      localStorage.setItem("user", JSON.stringify(updated));
      alert("Profile Updated Successfully");
    } catch (err) {
      alert(err.message || "Failed to update profile");
    }
  };

  return (
    <Layout>
      <div className={styles.page}>

        <h1>My Profile</h1>

        <div className={styles.card}>

          <div className={styles.avatar}>
            <i className="fa-solid fa-user"></i>
          </div>

          <div className={styles.info}>

            <label>Full Name</label>

            <input
              type="text"
              name="fullname"
              value={profile.fullname}
              onChange={handleChange}
            />

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />

            <label>Phone Number</label>

            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
            />

            <label>Username</label>

            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
            />

            <label>Role</label>

            <input
              type="text"
              value={profile.role}
              disabled
            />

            <button onClick={saveProfile}>
              Update Profile
            </button>

          </div>

        </div>

      </div>
    </Layout>
  );
}