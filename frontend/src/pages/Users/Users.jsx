import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { useRequireAuth } from "../../utils/auth";
import { api } from "../../utils/api";
import { getRole, getCurrentUser, ROLES } from "../../utils/roles";
import styles from "./Users.module.css";

const ROLE_OPTIONS = [
  ROLES.ADMIN,
  ROLES.FARMER,
  ROLES.MANUFACTURER,
  ROLES.SUPPLIER,
  ROLES.RETAILER,
];

const emptyForm = {
  fullname: "",
  email: "",
  phone: "",
  username: "",
  role: ROLES.FARMER,
  password: "",
};

export default function Users() {
  useRequireAuth();
  const navigate = useNavigate();

  const role = getRole();
  const me = getCurrentUser();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [resetTarget, setResetTarget] = useState(null); // user object
  const [newPassword, setNewPassword] = useState("");

  // Only admins may see this page at all.
  useEffect(() => {
    if (role && role !== ROLES.ADMIN) {
      navigate("/dashboard");
    }
  }, [role, navigate]);

  const loadUsers = async () => {
    try {
      const data = await api.get("/users");
      setUsers(data);
    } catch (err) {
      alert(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (user) => {
    setEditingId(user.id);
    setForm({
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      username: user.username,
      role: user.role,
      password: "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const saveUser = async () => {
    const { fullname, email, phone, username, role: formRole, password } = form;

    if (!fullname.trim() || !email.trim() || !phone.trim() || !username.trim() || !formRole.trim()) {
      alert("Please fill all fields");
      return;
    }

    if (editingId === null && !password) {
      alert("Please set a password for the new user");
      return;
    }

    try {
      if (editingId !== null) {
        await api.put(`/users/${editingId}`, {
          fullname: fullname.trim(),
          email: email.trim(),
          phone: phone.trim(),
          username: username.trim(),
          role: formRole.trim(),
        });
      } else {
        await api.post("/users", {
          fullname: fullname.trim(),
          email: email.trim(),
          phone: phone.trim(),
          username: username.trim(),
          role: formRole.trim(),
          password,
        });
      }

      await loadUsers();
      closeForm();
    } catch (err) {
      alert(err.message || "Failed to save user");
    }
  };

  const deleteUser = async (user) => {
    if (user.id === me?.id) {
      alert("You cannot delete your own account.");
      return;
    }
    if (window.confirm(`Delete user "${user.username}"? This cannot be undone.`)) {
      try {
        await api.delete(`/users/${user.id}`);
        await loadUsers();
      } catch (err) {
        alert(err.message || "Failed to delete user");
      }
    }
  };

  const toggleActive = async (user) => {
    if (user.id === me?.id && user.active) {
      alert("You cannot deactivate your own account.");
      return;
    }
    try {
      await api.patch(`/users/${user.id}/status`, { active: !user.active });
      await loadUsers();
    } catch (err) {
      alert(err.message || "Failed to update user status");
    }
  };

  const openReset = (user) => {
    setResetTarget(user);
    setNewPassword("");
  };

  const submitReset = async () => {
    if (!newPassword || newPassword.length < 4) {
      alert("New password must be at least 4 characters.");
      return;
    }
    try {
      await api.patch(`/users/${resetTarget.id}/reset-password`, { newPassword });
      alert(`Password reset for ${resetTarget.username}.`);
      setResetTarget(null);
      setNewPassword("");
    } catch (err) {
      alert(err.message || "Failed to reset password");
    }
  };

  const filtered = users.filter((u) =>
    `${u.fullname} ${u.username} ${u.email} ${u.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (role && role !== ROLES.ADMIN) return null;

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.topbar}>
          <h1>User Management</h1>
          <button onClick={openAdd}>+ Add User</button>
        </div>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>No Users Found</td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id}>
                  <td>{user.fullname}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={styles.roleBadge}>{user.role}</span>
                  </td>
                  <td>
                    <span className={user.active ? styles.badgeActive : styles.badgeInactive}>
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.edit} onClick={() => openEdit(user)}>
                        Edit
                      </button>
                      <button className={styles.reset} onClick={() => openReset(user)}>
                        Reset PW
                      </button>
                      <button
                        className={user.active ? styles.deactivate : styles.activate}
                        onClick={() => toggleActive(user)}
                      >
                        {user.active ? "Deactivate" : "Activate"}
                      </button>
                      <button className={styles.delete} onClick={() => deleteUser(user)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className={styles.popup}>
          <div className={styles.form}>
            <h2>{editingId !== null ? "Edit User" : "Add User"}</h2>

            <input
              placeholder="Full Name"
              value={form.fullname}
              onChange={(e) => setForm({ ...form, fullname: e.target.value })}
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />

            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>

            {editingId === null && (
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            )}

            <div className={styles.buttons}>
              <button onClick={saveUser}>{editingId !== null ? "Update" : "Save"}</button>
              <button onClick={closeForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {resetTarget && (
        <div className={styles.popup}>
          <div className={styles.form}>
            <h2>Reset Password — {resetTarget.username}</h2>

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <div className={styles.buttons}>
              <button onClick={submitReset}>Reset</button>
              <button onClick={() => setResetTarget(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
