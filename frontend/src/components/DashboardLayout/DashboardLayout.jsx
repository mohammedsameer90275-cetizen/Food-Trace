import styles from "./DashboardLayout.module.css";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

export default function DashboardLayout({
  role,
  children,
}) {
  return (
    <div className={styles.container}>

      <Navbar role={role} />

      <div className={styles.body}>

        <Sidebar role={role} />

        <main className={styles.content}>
          {children}
        </main>

      </div>

    </div>
  );
}