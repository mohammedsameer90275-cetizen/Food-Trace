import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  BellRing,
  Boxes,
  Cloud,
  Database,
  KeyRound,
  QrCode,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import DashboardLayout from "../../../components/DashboardLayout/DashboardLayout";
import { api } from "../../../utils/api";
import styles from "./Dashboard.module.css";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#38bdf8", "#a3e635"];

export default function AdminDashboard() {
  const [showcase, setShowcase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  async function loadShowcase() {
    try {
      const data = await api.get("/showcase");
      setShowcase(data);
    } finally {
      setLoading(false);
    }
  }

  async function seedDemo() {
    setSeeding(true);
    try {
      const data = await api.post("/demo/seed", {});
      alert(data.message || "Premium demo data is ready.");
      await loadShowcase();
    } catch (err) {
      alert(err.message || "Demo seed failed");
    } finally {
      setSeeding(false);
    }
  }

  useEffect(() => {
    loadShowcase();
  }, []);

  const stats = showcase?.stats || {};
  const charts = showcase?.charts || { status: [], categories: [], tracking: [] };
  const accounts = showcase?.demoAccounts || [];
  const activities = showcase?.recentActivities || [];
  const alerts = showcase?.alerts || [];

  const statCards = [
    { label: "Users", value: stats.users || 0, icon: Users },
    { label: "Products", value: stats.products || 0, icon: Boxes },
    { label: "Tracking Events", value: stats.tracking || 0, icon: Activity },
    { label: "Open Alerts", value: stats.notifications || 0, icon: BellRing },
  ];

  return (
    <DashboardLayout role="Admin">
      <div className={styles.page}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Examiner command center</p>
            <h1>FoodTrace Premium Demo</h1>
            <p className={styles.heroText}>
              A complete farm-to-consumer traceability system with JWT auth,
              Django APIs, QR safety certificates, freshness intelligence, and
              cloud-ready architecture.
            </p>
            <div className={styles.actions}>
              <button onClick={seedDemo} disabled={seeding}>
                <Sparkles size={18} />
                {seeding ? "Creating demo..." : "Seed Premium Demo"}
              </button>
              <a href="/showcase">Open Project Summary</a>
            </div>
          </div>

          <div className={styles.heroPanel}>
            <ShieldCheck size={42} />
            <strong>Viva-ready proof</strong>
            <span>20-item dataset, role accounts, real tracking timeline, alerts, inventory, and safety QR flow.</span>
          </div>
        </section>

        {loading ? (
          <div className={styles.empty}>Loading command center...</div>
        ) : (
          <>
            <section className={styles.statGrid}>
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article key={card.label} className={styles.statCard}>
                    <Icon size={24} />
                    <span>{card.label}</span>
                    <strong>{card.value}</strong>
                  </article>
                );
              })}
            </section>

            <section className={styles.chartGrid}>
              <article className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2>Freshness Distribution</h2>
                  <span>AI status mix</span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={charts.status} dataKey="value" nameKey="name" innerRadius={58} outerRadius={94}>
                      {charts.status.map((_entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </article>

              <article className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2>Product Categories</h2>
                  <span>20 item catalog usage</span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={charts.categories}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </article>

              <article className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2>Supply Chain Events</h2>
                  <span>Movement history</span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={charts.tracking}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#38bdf8" fill="#38bdf855" />
                  </AreaChart>
                </ResponsiveContainer>
              </article>
            </section>

            <section className={styles.split}>
              <article className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2>Role Demo Accounts</h2>
                  <span>Password: Demo@123</span>
                </div>
                <div className={styles.accounts}>
                  {accounts.map((account) => (
                    <div key={account.username} className={styles.account}>
                      <KeyRound size={18} />
                      <div>
                        <strong>{account.role}</strong>
                        <span>{account.username}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2>Recent Activities</h2>
                  <span>Audit log preview</span>
                </div>
                <div className={styles.timeline}>
                  {activities.length === 0 && <p className={styles.empty}>Seed demo data to see activities.</p>}
                  {activities.map((item, index) => (
                    <div key={`${item.title}-${index}`} className={styles.activity}>
                      <span />
                      <div>
                        <strong>{item.title}</strong>
                        <small>{item.meta}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className={styles.split}>
              <article className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2>Notification Center</h2>
                  <span>Risk intelligence</span>
                </div>
                <div className={styles.alerts}>
                  {alerts.length === 0 && <p className={styles.empty}>No active alerts yet.</p>}
                  {alerts.map((alert, index) => (
                    <div key={`${alert.message}-${index}`} className={styles.alert}>
                      <BellRing size={18} />
                      <div>
                        <strong>{alert.type}</strong>
                        <span>{alert.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2>Cloud Launch Readiness</h2>
                  <span>Future deployment path</span>
                </div>
                <div className={styles.cloudGrid}>
                  <div><Database size={22} /> PostgreSQL-ready schema</div>
                  <div><Cloud size={22} /> Frontend/backend split</div>
                  <div><QrCode size={22} /> QR routes work by product ID</div>
                  <div><ShieldCheck size={22} /> JWT and role permissions</div>
                </div>
              </article>
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
