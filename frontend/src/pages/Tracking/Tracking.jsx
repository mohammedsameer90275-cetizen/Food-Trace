import { useState } from "react";
import { MapPin, PackageCheck, Search, Thermometer, Truck, Waves } from "lucide-react";
import Layout from "../../components/Layout/Layout";
import { useRequireAuth } from "../../utils/auth";
import { api } from "../../utils/api";
import styles from "./Tracking.module.css";

export default function Tracking() {
  useRequireAuth();

  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tracking, setTracking] = useState([]);
  const [searched, setSearched] = useState(false);

  async function loadTracking(product) {
    const data = await api.get(`/tracking?search=${encodeURIComponent(product.product_id)}`);
    setTracking(Array.isArray(data) ? data : data.results || []);
  }

  const trackProduct = async () => {
    const term = query.trim();
    if (!term) {
      alert("Enter a full Product ID or Product Name");
      return;
    }

    try {
      const found = await api.get(`/products/search?q=${encodeURIComponent(term)}`);
      setSearched(true);
      setMatches(found);
      const first = found.length === 1 ? found[0] : null;
      setSelected(first);
      setTracking([]);
      if (first) await loadTracking(first);
      if (found.length === 0) alert("Product Not Found");
    } catch (err) {
      alert(err.message || "Product Not Found");
      setSearched(true);
      setMatches([]);
      setSelected(null);
      setTracking([]);
    }
  };

  async function chooseProduct(product) {
    setSelected(product);
    await loadTracking(product);
  }

  return (
    <Layout>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div>
            <p>Traceability lookup</p>
            <h1>Search by full Product ID</h1>
            <span>Enter the full generated ID, such as FT20260712ABC123, to show clear tracking details and every supply-chain movement.</span>
          </div>
          <div className={styles.searchBox}>
            <Search />
            <input
              type="text"
              placeholder="Enter full Product ID or Product Name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && trackProduct()}
            />
            <button onClick={trackProduct}>Track</button>
          </div>
        </section>

        {matches.length > 1 && (
          <section className={styles.matches}>
            <h2>Multiple products found</h2>
            <div className={styles.matchList}>
              {matches.map((product) => (
                <button
                  key={product.id}
                  className={selected?.id === product.id ? styles.activeMatch : ""}
                  onClick={() => chooseProduct(product)}
                >
                  <strong>{product.product_id}</strong>
                  <span>{product.productName || product.product_name} / {product.farmer}</span>
                  <em>{product.status}</em>
                </button>
              ))}
            </div>
          </section>
        )}

        {searched && matches.length === 0 && (
          <section className={styles.empty}>No products available for this search.</section>
        )}

        {selected && (
          <>
            <section className={styles.details}>
              <div>
                <p>Product ID</p>
                <h2>{selected.product_id}</h2>
                <span>{selected.productName || selected.product_name} / Batch {selected.batch || selected.batch_id}</span>
              </div>
              <div className={styles.detailCards}>
                <article><PackageCheck /><strong>{selected.status}</strong><span>Status</span></article>
                <article><MapPin /><strong>{selected.location || "Latest location pending"}</strong><span>Current Location</span></article>
                <article><Truck /><strong>{selected.stage || "Produced"}</strong><span>Stage</span></article>
              </div>
            </section>

            <section className={styles.timelinePanel}>
              <h2>End-to-End Supply Chain Timeline</h2>
              <div className={styles.timeline}>
                {tracking.length === 0 && <p>No tracking records yet.</p>}
                {tracking.map((record, index) => (
                  <article key={record.id} className={styles.event}>
                    <div className={styles.marker}>{index + 1}</div>
                    <div>
                      <strong>{record.status}</strong>
                      <p>{record.role} - {record.actor_name || "System"} - {record.location || "Location not set"}</p>
                      <small>{new Date(record.timestamp).toLocaleString()}</small>
                    </div>
                    <div className={styles.conditions}>
                      <span><Thermometer size={16} /> {record.temperature ?? "-"} C</span>
                      <span><Waves size={16} /> {record.humidity ?? "-"}% RH</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </Layout>
  );
}
