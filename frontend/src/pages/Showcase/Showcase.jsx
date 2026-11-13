import { useEffect, useState } from "react";
import {
  Boxes,
  CheckCircle2,
  Cloud,
  Database,
  FileText,
  LockKeyhole,
  QrCode,
  Route,
  Sparkles,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import { api } from "../../utils/api";
import styles from "./Showcase.module.css";

export default function Showcase() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role || "Admin";
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/showcase").then(setData).catch(() => setData(null));
  }, []);

  const highlights = data?.project?.examinerHighlights || [];
  const cloudReady = data?.project?.cloudReady || [];
  const stats = data?.stats || {};

  const modules = [
    { title: "JWT Authentication", icon: LockKeyhole, text: "Custom Django user model with Admin, Farmer, Distributor, Retailer, and Consumer roles." },
    { title: "QR Safety Certificate", icon: QrCode, text: "Each product has a generated product ID, batch ID, and QR route for consumer verification." },
    { title: "Tracking Timeline", icon: Route, text: "Every movement creates a tracking record with actor, role, location, temperature, humidity, and timestamp." },
    { title: "AI Freshness Logic", icon: Sparkles, text: "Freshness score and status are calculated automatically from harvest date, shelf life, and remaining days." },
    { title: "Notifications", icon: CheckCircle2, text: "Near expiry, expired, temperature breach, shipment, and low-stock risks are surfaced automatically." },
    { title: "Cloud Path", icon: Cloud, text: "The code is split cleanly for future PostgreSQL, media storage, and cloud deployment." },
  ];

  return (
    <DashboardLayout role={role}>
      <main className={styles.page}>
        <section className={styles.hero}>
          <p>Final project proof page</p>
          <h1>{data?.project?.title || "FoodTrace Project Showcase"}</h1>
          <span>
            This page is built for the examiner: it explains what was built,
            what makes it technical, and why it is ready to demo locally now
            and deploy to the cloud later.
          </span>
        </section>

        <section className={styles.stats}>
          <div><Boxes /><strong>{stats.products || 0}</strong><span>Products</span></div>
          <div><Route /><strong>{stats.tracking || 0}</strong><span>Tracking Events</span></div>
          <div><Database /><strong>{stats.inventory || 0}</strong><span>Inventory Items</span></div>
          <div><FileText /><strong>{stats.notifications || 0}</strong><span>Notifications</span></div>
        </section>

        <section className={styles.grid}>
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <article key={module.title}>
                <Icon />
                <h2>{module.title}</h2>
                <p>{module.text}</p>
              </article>
            );
          })}
        </section>

        <section className={styles.columns}>
          <article>
            <h2>Examiner Highlights</h2>
            {highlights.map((item) => <p key={item}>{item}</p>)}
          </article>
          <article>
            <h2>Cloud Ready Notes</h2>
            {cloudReady.map((item) => <p key={item}>{item}</p>)}
          </article>
          <article>
            <h2>Demo Logins</h2>
            {(data?.demoAccounts || []).map((account) => (
              <p key={account.username}>
                <strong>{account.role}</strong> - {account.username} / {account.password}
              </p>
            ))}
          </article>
        </section>
      </main>
    </DashboardLayout>
  );
}
