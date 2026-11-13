import styles from "./ReportCards.module.css";

export default function ReportCards({ cards }) {
    return (
        <div className={styles.grid}>
            {cards?.map((card) => (
                <div key={card.title} className={styles.card}>
                    <div className={styles.icon}>{card.icon}</div>
                    <h3>{card.title}</h3>
                    <p>{card.value}</p>
                </div>
            ))}
        </div>
    );
}
