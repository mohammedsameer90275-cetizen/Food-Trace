import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import { api } from "../../utils/api";
import styles from "./Catalog.module.css";

const emptyForm = {
  name: "",
  category: "Vegetable",
  shelf_life_days: 7,
  default_storage_type: "Cold Storage",
  ideal_temperature: 5,
  ideal_humidity: 85,
};

export default function Catalog() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);

  async function loadCatalog() {
    const data = await api.get("/catalog");
    setItems(Array.isArray(data) ? data : []);
  }

  async function saveItem(e) {
    e.preventDefault();
    await api.post("/catalog", form);
    setForm(emptyForm);
    await loadCatalog();
  }

  useEffect(() => {
    loadCatalog().catch(() => setItems([]));
  }, []);

  return (
    <DashboardLayout role={user.role || "Admin"}>
      <main className={styles.page}>
        <section className={styles.header}>
          <div>
            <p>Real 20 item dataset</p>
            <h1>Fruit and Vegetable Catalog</h1>
            <span>Admin can add new produce and define shelf life, storage, temperature, and humidity rules.</span>
          </div>
        </section>

        {user.role === "Admin" && (
          <form className={styles.form} onSubmit={saveItem}>
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option>Vegetable</option>
              <option>Fruit</option>
            </select>
            <input type="number" placeholder="Shelf life days" value={form.shelf_life_days} onChange={(e) => setForm({ ...form, shelf_life_days: e.target.value })} />
            <input placeholder="Storage type" value={form.default_storage_type} onChange={(e) => setForm({ ...form, default_storage_type: e.target.value })} />
            <input type="number" placeholder="Ideal temp" value={form.ideal_temperature} onChange={(e) => setForm({ ...form, ideal_temperature: e.target.value })} />
            <input type="number" placeholder="Ideal humidity" value={form.ideal_humidity} onChange={(e) => setForm({ ...form, ideal_humidity: e.target.value })} />
            <button>Add Produce</button>
          </form>
        )}

        <section className={styles.grid}>
          {items.map((item) => (
            <article key={item.id}>
              <strong>{item.name}</strong>
              <span>{item.category}</span>
              <p>{item.shelf_life_days} days shelf life</p>
              <small>{item.default_storage_type} / {item.ideal_temperature} C / {item.ideal_humidity}% RH</small>
            </article>
          ))}
        </section>
      </main>
    </DashboardLayout>
  );
}
