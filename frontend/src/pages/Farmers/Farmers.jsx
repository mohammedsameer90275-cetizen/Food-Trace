import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useRequireAuth } from "../../utils/auth";
import { api } from "../../utils/api";
import { getRole, getPermissions, getCurrentUser, ROLES } from "../../utils/roles";
import styles from "./Farmers.module.css";

const emptyForm = {
  name: "",
  village: "",
  phone: "",
  product: "",
};

export default function Farmers() {
  useRequireAuth();

  const role = getRole();
  const me = getCurrentUser();
  const perm = getPermissions(role);
  const isAdmin = role === ROLES.ADMIN;
  const isFarmer = role === ROLES.FARMER;

  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  const loadFarmers = async () => {
    try {
      const data = await api.get("/farmers");
      setFarmers(data);
    } catch (err) {
      alert(err.message || "Failed to load farmers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  const openForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(false);
  };

  const saveFarmer = async () => {
    const { name, village, phone, product } = form;

    if (
      !name.trim() ||
      !village.trim() ||
      !phone.trim() ||
      !product.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editing !== null) {
        await api.put(`/farmers/${farmers[editing].id}`, {
          name: name.trim(),
          village: village.trim(),
          phone: phone.trim(),
          product: product.trim(),
        });
      } else {
        await api.post("/farmers", {
          name: name.trim(),
          village: village.trim(),
          phone: phone.trim(),
          product: product.trim(),
        });
      }

      await loadFarmers();
      closeForm();
    } catch (err) {
      alert(err.message || "Failed to save farmer");
    }
  };

  const editFarmer = (index) => {
    const farmer = farmers[index];

    setForm({
      name: farmer.name,
      village: farmer.village,
      phone: farmer.phone,
      product: farmer.product,
    });

    setEditing(index);
    setShowForm(true);
  };

  const deleteFarmer = async (index) => {
    if (window.confirm("Delete this farmer?")) {
      try {
        await api.delete(`/farmers/${farmers[index].id}`);
        await loadFarmers();
      } catch (err) {
        alert(err.message || "Failed to delete farmer");
      }
    }
  };

  const filtered = farmers.filter((f) =>
    `${f.id} ${f.name} ${f.village} ${f.phone} ${f.product}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const canEdit = (farmer) => isAdmin || (isFarmer && me && farmer.created_by === me.id);
  const showActionsColumn = perm.canAddFarmer || perm.canDeleteFarmer;

  return (
  <Layout>
    <div className={styles.page}>

      <div className={styles.topbar}>
        <h1>{isFarmer ? "Production Details" : "Farmers Management"}</h1>

        {perm.canAddFarmer && (
          <button onClick={openForm}>
            + Add Farmer
          </button>
        )}
      </div>

      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search Farmer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Village</th>
            <th>Phone</th>
            <th>Product</th>
            {showActionsColumn && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>

          {loading ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No Farmers Found
              </td>
            </tr>
          ) : (

            filtered.map((farmer) => {

              const realIndex = farmers.indexOf(farmer);

              return (

                <tr key={farmer.id}>

                  <td>{farmer.id}</td>

                  <td>{farmer.name}</td>

                  <td>{farmer.village}</td>

                  <td>{farmer.phone}</td>

                  <td>{farmer.product}</td>

                  {showActionsColumn && (
                    <td>

                      {canEdit(farmer) && (
                        <button
                          className={styles.edit}
                          onClick={() => editFarmer(realIndex)}
                        >
                          Edit
                        </button>
                      )}

                      {perm.canDeleteFarmer && (
                        <button
                          className={styles.delete}
                          onClick={() => deleteFarmer(realIndex)}
                        >
                          Delete
                        </button>
                      )}

                    </td>
                  )}

                </tr>

              );

            })

          )}

        </tbody>

      </table>

    </div>
          {showForm && (
        <div className={styles.popup}>
          <div className={styles.form}>

            <h2>
              {editing !== null ? "Update Farmer" : "Add Farmer"}
            </h2>

            <input
              placeholder="Farmer Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <input
              placeholder="Village"
              value={form.village}
              onChange={(e) =>
                setForm({
                  ...form,
                  village: e.target.value,
                })
              }
            />

            <input
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
            />

            <input
              placeholder="Product"
              value={form.product}
              onChange={(e) =>
                setForm({
                  ...form,
                  product: e.target.value,
                })
              }
            />

            <div className={styles.buttons}>

              <button onClick={saveFarmer}>
                {editing !== null ? "Update" : "Save"}
              </button>

              <button onClick={closeForm}>
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

    </Layout>
  );
}
