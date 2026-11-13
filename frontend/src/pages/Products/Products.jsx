import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useRequireAuth } from "../../utils/auth";
import { api } from "../../utils/api";
import { getRole, getPermissions, getCurrentUser, ROLES } from "../../utils/roles";
import styles from "./Products.module.css";

const emptyForm = {
  productName: "",
  category: "",
  farmer: "",
  batch: "",
  expiry: "",
};

const TRANSPORT_STAGES = ["Produced", "In Transit", "Delivered"];
const RETAIL_STAGES = ["Delivered", "In Stock", "Sold"];

export default function Products() {
  useRequireAuth();

  const role = getRole();
  const me = getCurrentUser();
  const perm = getPermissions(role);
  const isAdmin = role === ROLES.ADMIN;
  const isFarmer = role === ROLES.FARMER;
  const isSupplier = role === ROLES.SUPPLIER;
  const isRetailer = role === ROLES.RETAILER;
  const isConsumer = role === ROLES.CONSUMER;

  const pageTitle = isFarmer
    ? "My Products"
    : isSupplier
    ? "Assigned Products"
    : isRetailer
    ? "Received Products"
    : "Product Management";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Full production-details form (Admin, Farmer)
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // Lightweight status form (Supplier, Retailer, Admin)
  const [statusTarget, setStatusTarget] = useState(null);
  const [statusForm, setStatusForm] = useState({ location: "", stage: "" });

  const [search, setSearch] = useState("");

  const loadProducts = async () => {
    try {
      const data = await api.get("/products");
      setProducts(data);
    } catch (err) {
      alert(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const saveProduct = async () => {
    const { productName, category, farmer, batch, expiry } = form;

    if (
      !productName.trim() ||
      !category.trim() ||
      !farmer.trim() ||
      !batch.trim() ||
      !expiry
    ) {
      alert("Please Fill All Fields");
      return;
    }

    const payload = {
      productName: productName.trim(),
      category: category.trim(),
      farmer: farmer.trim(),
      batch: batch.trim(),
      expiry,
    };

    try {
      if (editing !== null) {
        await api.put(`/products/${products[editing].id}`, payload);
      } else {
        await api.post("/products", payload);
      }

      await loadProducts();
      closeForm();
    } catch (err) {
      alert(err.message || "Failed to save product");
    }
  };

  const editProduct = (index) => {
    const item = products[index];

    setForm({
      productName: item.productName,
      category: item.category,
      farmer: item.farmer,
      batch: item.batch,
      expiry: item.expiry,
    });

    setEditing(index);
    setShowForm(true);
  };

  const deleteProduct = async (index) => {
    if (window.confirm("Delete Product?")) {
      try {
        await api.delete(`/products/${products[index].id}`);
        await loadProducts();
      } catch (err) {
        alert(err.message || "Failed to delete product");
      }
    }
  };

  const openStatusForm = (item) => {
    setStatusTarget(item);
    setStatusForm({ location: item.location || "", stage: item.stage || "Produced" });
  };

  const closeStatusForm = () => {
    setStatusTarget(null);
    setStatusForm({ location: "", stage: "" });
  };

  const saveStatus = async () => {
    try {
      const payload = { stage: statusForm.stage };
      if (isSupplier || isAdmin) payload.location = statusForm.location.trim();

      await api.patch(`/products/${statusTarget.id}/status`, payload);
      await loadProducts();
      closeStatusForm();
    } catch (err) {
      alert(err.message || "Failed to update status");
    }
  };

  // Farmers only manage their own production entries; other roles see the
  // full shared list (Assigned / Received / Complete, per their role).
  const visibleProducts =
    isFarmer && me
      ? products.filter((p) => p.created_by === me.id)
      : products;

  const filtered = visibleProducts.filter((p) =>
    `${p.id} ${p.productName} ${p.category} ${p.farmer} ${p.batch} ${p.expiry} ${p.status} ${p.stage || ""} ${p.location || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const canEditFull = (item) => isAdmin || (isFarmer && me && item.created_by === me.id);
  const canEditStatus = isSupplier || isRetailer || isAdmin;
  const showActionsColumn = perm.canAddProduct || canEditStatus || perm.canDeleteProduct || isFarmer;

  const stageOptions = isRetailer ? RETAIL_STAGES : TRANSPORT_STAGES;

  return (
  <Layout>
    <div className={styles.page}>

      <div className={styles.topbar}>
        <h1>{pageTitle}</h1>

        {perm.canAddProduct && (
          <button onClick={openForm}>
            + Add Product
          </button>
        )}
      </div>

      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search Product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Category</th>
            <th>Farmer</th>
            <th>Batch</th>
            <th>Expiry</th>
            <th>Status</th>
            <th>Stage</th>
            <th>Location</th>
            {showActionsColumn && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>

          {loading ? (
            <tr>
              <td colSpan="10" style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan="10" style={{ textAlign: "center" }}>
                No Products Found
              </td>
            </tr>
          ) : (

            filtered.map((item) => {

              const realIndex = products.indexOf(item);

              return (

                <tr key={item.id}>

                  <td>{item.id}</td>

                  <td>{item.productName}</td>

                  <td>{item.category}</td>

                  <td>{item.farmer}</td>

                  <td>{item.batch}</td>

                  <td>{item.expiry}</td>

                  <td
                    className={
                      item.status === "Safe"
                        ? styles.safe
                        : styles.expired
                    }
                  >
                    {item.status}
                  </td>

                  <td>{item.stage || "Produced"}</td>

                  <td>{item.location || "-"}</td>

                  {showActionsColumn && (
                    <td>

                      {canEditFull(item) && (
                        <button
                          className={styles.edit}
                          onClick={() => editProduct(realIndex)}
                        >
                          Edit
                        </button>
                      )}

                      {canEditStatus && (
                        <button
                          className={styles.edit}
                          onClick={() => openStatusForm(item)}
                        >
                          Update Status
                        </button>
                      )}

                      {perm.canDeleteProduct && (
                        <button
                          className={styles.delete}
                          onClick={() => deleteProduct(realIndex)}
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

      {isConsumer && (
        <p style={{ marginTop: 16, color: "#666" }}>
          You have view-only access. Use Tracking to look up a product by ID or QR code.
        </p>
      )}

    </div>

      {/* Full production-details form — Admin, Farmer */}
      {showForm && (
        <div className={styles.popup}>
          <div className={styles.form}>

            <h2>
              {editing !== null ? "Update Product" : "Add Product"}
            </h2>

            <input
              placeholder="Product Name"
              value={form.productName}
              onChange={(e) =>
                setForm({
                  ...form,
                  productName: e.target.value,
                })
              }
            />

            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
            />

            <input
              placeholder="Farmer Name"
              value={form.farmer}
              onChange={(e) =>
                setForm({
                  ...form,
                  farmer: e.target.value,
                })
              }
            />

            <input
              placeholder="Batch Number"
              value={form.batch}
              onChange={(e) =>
                setForm({
                  ...form,
                  batch: e.target.value,
                })
              }
            />

            <input
              type="date"
              value={form.expiry}
              onChange={(e) =>
                setForm({
                  ...form,
                  expiry: e.target.value,
                })
              }
            />

            <div className={styles.buttons}>

              <button onClick={saveProduct}>
                {editing !== null ? "Update" : "Save"}
              </button>

              <button onClick={closeForm}>
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

      {/* Lightweight status form — Supplier (location + transport stage), Retailer (sales stage) */}
      {statusTarget && (
        <div className={styles.popup}>
          <div className={styles.form}>

            <h2>Update Status — {statusTarget.id}</h2>

            {(isSupplier || isAdmin) && (
              <input
                placeholder="Current Location"
                value={statusForm.location}
                onChange={(e) =>
                  setStatusForm({ ...statusForm, location: e.target.value })
                }
              />
            )}

            <select
              value={statusForm.stage}
              onChange={(e) =>
                setStatusForm({ ...statusForm, stage: e.target.value })
              }
              style={{ width: "100%", padding: "12px", margin: "10px 0", borderRadius: "6px", border: "1px solid #ccc" }}
            >
              {stageOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <div className={styles.buttons}>

              <button onClick={saveStatus}>
                Save
              </button>

              <button onClick={closeStatusForm}>
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

    </Layout>
  );
}
