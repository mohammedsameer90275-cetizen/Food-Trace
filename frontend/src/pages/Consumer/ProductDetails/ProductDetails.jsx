import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import { CalendarDays, FileDown, MapPin, ShieldCheck, Thermometer, Timer, Waves } from "lucide-react";
import { api } from "../../../utils/api";
import ProductQRCode from "../../../components/ProductQRCode/ProductQRCode";
import styles from "./ProductDetails.module.css";

function explainFreshness(product) {
  const days = Number(product.days_remaining ?? 0);
  const score = Number(product.freshness_score ?? 0);
  const temp = product.temperature ?? "-";
  const humidity = product.humidity ?? "-";
  if (product.status === "Expired") {
    return `Expired because the calculated expiry date has passed. Current score is ${score}%.`;
  }
  if (product.status === "Warning") {
    return `Warning because only ${days} day(s) remain. Keep at ${temp} C and ${humidity}% humidity.`;
  }
  return `Fresh because ${days} day(s) remain and the product is within the expected shelf-life window.`;
}

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    try {
      const data = await api.get(`/products/${id}`);
      const item = data.product || data;
      setProduct(item);
      const trackData = await api.get(`/tracking?search=${encodeURIComponent(item.product_id)}`);
      setTracking(Array.isArray(trackData) ? trackData : trackData.results || []);
    } catch (err) {
      console.log(err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }

  function exportCertificate() {
    if (!product) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("FoodTrace Product Safety Certificate", 18, 22);
    doc.setFontSize(11);
    doc.text(`Product ID: ${product.product_id}`, 18, 38);
    doc.text(`Batch ID: ${product.batch_id}`, 18, 46);
    doc.text(`Product: ${product.product_name}`, 18, 54);
    doc.text(`Farmer: ${product.farmer}`, 18, 62);
    doc.text(`Harvest Date: ${product.harvest_date}`, 18, 70);
    doc.text(`Expiry Date: ${product.expiry_date}`, 18, 78);
    doc.text(`Freshness Score: ${product.freshness_score}%`, 18, 86);
    doc.text(`Status: ${product.status}`, 18, 94);
    doc.text(`AI Explanation: ${explainFreshness(product)}`, 18, 108, { maxWidth: 170 });
    doc.text("Supply Chain Timeline", 18, 126);
    tracking.slice(0, 8).forEach((record, index) => {
      doc.text(`${index + 1}. ${record.status} - ${record.role} - ${record.location || "Location not set"}`, 18, 138 + index * 8);
    });
    doc.save(`${product.product_id}-safety-certificate.pdf`);
  }

  if (loading) return <div className={styles.state}>Loading safety certificate...</div>;
  if (!product) return <div className={styles.state}>Product not found.</div>;

  return (
    <main className={styles.page}>
      <section className={styles.certificate}>
        <div className={styles.visual}>
          {product.image ? <img src={product.image} alt={product.product_name} /> : <div className={styles.placeholder}>{product.product_name?.slice(0, 2)}</div>}
          <span className={`${styles.badge} ${styles[product.status?.toLowerCase()]}`}>{product.status}</span>
        </div>

        <div className={styles.content}>
          <p className={styles.eyebrow}>Consumer safety certificate</p>
          <h1>{product.product_name}</h1>
          <p className={styles.summary}>{explainFreshness(product)}</p>

          <div className={styles.metaGrid}>
            <div><ShieldCheck /><span>Product ID</span><strong>{product.product_id}</strong></div>
            <div><CalendarDays /><span>Harvest</span><strong>{product.harvest_date}</strong></div>
            <div><Timer /><span>Expiry</span><strong>{product.expiry_date}</strong></div>
            <div><Thermometer /><span>Temperature</span><strong>{product.temperature ?? "-"} C</strong></div>
            <div><Waves /><span>Humidity</span><strong>{product.humidity ?? "-"}%</strong></div>
            <div><MapPin /><span>Current Stage</span><strong>{product.stage || "Produced"}</strong></div>
          </div>

          <div className={styles.score}>
            <span>Freshness Score</span>
            <strong>{product.freshness_score}%</strong>
            <div><i style={{ width: `${product.freshness_score}%` }} /></div>
          </div>

          <button className={styles.export} onClick={exportCertificate}>
            <FileDown size={18} />
            Export Safety Certificate PDF
          </button>
        </div>
      </section>

      <section className={styles.lowerGrid}>
        <article className={styles.panel}>
          <h2>Supply Chain History</h2>
          <div className={styles.timeline}>
            {tracking.length === 0 && <p>No tracking records yet.</p>}
            {tracking.map((record) => (
              <div key={record.id} className={styles.event}>
                <span />
                <div>
                  <strong>{record.status}</strong>
                  <p>{record.role} - {record.actor_name || "System"} - {record.location || "Location not set"}</p>
                  <small>{record.temperature ?? "-"} C / {record.humidity ?? "-"}% RH / {new Date(record.timestamp).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        </article>

        <ProductQRCode product={product} />
      </section>
    </main>
  );
}
