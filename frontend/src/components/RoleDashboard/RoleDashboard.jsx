import { useEffect, useState } from "react";
import { AlertTriangle, Boxes, CheckCircle2, QrCode, Route, Search, Truck } from "lucide-react";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { api } from "../../utils/api";
import styles from "./RoleDashboard.module.css";

const copy = {
  Distributor: {
    title: "Distributor Cold-Chain Control",
    subtitle: "Receive products, update shipment state, record location, temperature, and humidity.",
    cards: ["Assigned products", "In transit loads", "Temperature alerts", "Delivered batches"],
  },
  Retailer: {
    title: "Retailer Inventory Desk",
    subtitle: "Receive stock, monitor low inventory, mark sold, and report damaged products.",
    cards: ["Inventory items", "Low stock alerts", "Ready for sale", "Damaged stock"],
  },
  Consumer: {
    title: "Consumer Verification Portal",
    subtitle: "Search a full Product ID or scan a QR code to verify freshness and supply-chain history.",
    cards: ["QR verification", "Safety certificate", "Freshness score", "Timeline proof"],
  },
};

export default function RoleDashboard({ role }) {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.get("/products").then((data) => setProducts(Array.isArray(data) ? data : data.results || [])).catch(() => setProducts([]));
    api.get("/inventory").then((data) => setInventory(Array.isArray(data) ? data : data.results || [])).catch(() => setInventory([]));
    api.get("/notifications").then((data) => setAlerts(Array.isArray(data) ? data : data.results || [])).catch(() => setAlerts([]));
  }, []);

  async function updateShipment(product, status) {
    await api.patch(`/products/${product.product_id}/status`, {
      status,
      location: status === "Delivered" ? "FreshMart Retail Hub" : "Cold Chain Route",
      temperature: product.temperature || 6,
      humidity: product.humidity || 84,
    });
    alert(`Shipment marked ${status}`);
  }

  const lowStock = inventory.filter((item) => Number(item.quantity) <= Number(item.low_stock_threshold));
  const damaged = inventory.filter((item) => item.is_damaged);
  const filtered = products.filter((product) => {
    const term = query.toLowerCase();
    return !term || product.product_id?.toLowerCase().includes(term) || product.productName?.toLowerCase().includes(term);
  });
  const cardValues = {
    Distributor: [
      products.length,
      products.filter((product) => product.stage === "In Transit").length,
      alerts.filter((alert) => alert.type === "Temperature Breach").length,
      products.filter((product) => product.stage === "Delivered").length,
    ],
    Retailer: [
      inventory.length,
      lowStock.length,
      inventory.filter((item) => !item.is_sold && !item.is_damaged).length,
      damaged.length,
    ],
    Consumer: [
      products.length,
      products.filter((product) => product.status === "Fresh").length,
      products.filter((product) => product.status === "Warning").length,
      products.filter((product) => product.stage).length,
    ],
  };

  return (
    <DashboardLayout role={role}>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div>
            <p>{role} module</p>
            <h1>{copy[role].title}</h1>
            <span>{copy[role].subtitle}</span>
          </div>
          <div className={styles.search}>
            <Search size={18} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by Product ID or name" />
          </div>
        </section>

        <section className={styles.cards}>
          {copy[role].cards.map((label, index) => (
            <article key={label}>
              {[Boxes, Truck, AlertTriangle, CheckCircle2][index] && (() => {
                const Icon = [Boxes, Truck, AlertTriangle, CheckCircle2][index];
                return <Icon />;
              })()}
              <strong>{cardValues[role][index]}</strong>
              <span>{label}</span>
            </article>
          ))}
        </section>

        {role === "Distributor" && (
          <section className={styles.panel}>
            <h2>Shipment Status Flow</h2>
            <div className={styles.table}>
              {filtered.slice(0, 8).map((product) => (
                <div key={product.id} className={styles.row}>
                  <strong>{product.product_id}</strong>
                  <span>{product.productName || product.product_name}</span>
                  <em>{product.stage || "Produced"}</em>
                  <button onClick={() => updateShipment(product, "Collected")}>Collected</button>
                  <button onClick={() => updateShipment(product, "In Transit")}>In Transit</button>
                  <button onClick={() => updateShipment(product, "Delivered")}>Delivered</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {role === "Retailer" && (
          <section className={styles.panel}>
            <h2>Retailer Inventory Flow</h2>
            <div className={styles.table}>
              {inventory.slice(0, 8).map((item) => (
                <div key={item.id} className={styles.row}>
                  <strong>{item.product_id}</strong>
                  <span>{item.product_name}</span>
                  <em>{item.quantity} in stock</em>
                  <b>{Number(item.quantity) <= Number(item.low_stock_threshold) ? "Low Stock" : "Ready"}</b>
                  <b>{item.is_damaged ? "Damaged" : "Healthy"}</b>
                </div>
              ))}
              {inventory.length === 0 && <p>No inventory yet. Seed premium demo data from Admin Dashboard.</p>}
            </div>
          </section>
        )}

        {role === "Consumer" && (
          <section className={styles.panel}>
            <h2>Consumer QR Verification</h2>
            <div className={styles.consumerGrid}>
              <a href="/scan"><QrCode /> Scan or Enter Product ID</a>
              <a href="/tracking"><Route /> View Tracking Timeline</a>
              {filtered.slice(0, 4).map((product) => (
                <a key={product.id} href={`/product/${product.product_id}`}>
                  <CheckCircle2 /> {product.product_id} - {product.status}
                </a>
              ))}
            </div>
          </section>
        )}

        <section className={styles.panel}>
          <h2>Notification Center</h2>
          <div className={styles.alerts}>
            {alerts.length === 0 && <p>No alerts yet.</p>}
            {alerts.slice(0, 6).map((alert) => (
              <article key={alert.id}>
                <AlertTriangle />
                <div>
                  <strong>{alert.type}</strong>
                  <span>{alert.message}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </DashboardLayout>
  );
}
