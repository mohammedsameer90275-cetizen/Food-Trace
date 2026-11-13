import styles from "./DashboardCards.module.css";

export default function DashboardCards({ products }) {
    const total = products.length;
    const fresh = products.filter((p) => p.status === "Fresh").length;
    const warning = products.filter((p) => p.status === "Warning").length;
    const expired = products.filter((p) => p.status === "Expired").length;

    return (
        <div className={styles.cards}>
            <div className={styles.card}>
                <div className={styles.icon}>PKG</div>
                <h2>{total}</h2>
                <p>Total Products</p>
            </div>

            <div className={styles.card}>
                <div className={styles.icon}>OK</div>
                <h2>{fresh}</h2>
                <p>Fresh Products</p>
            </div>

            <div className={styles.card}>
                <div className={styles.icon}>WARN</div>
                <h2>{warning}</h2>
                <p>Warning Products</p>
            </div>

            <div className={styles.card}>
                <div className={styles.icon}>EXP</div>
                <h2>{expired}</h2>
                <p>Expired Products</p>
            </div>
        </div>
    );
}
