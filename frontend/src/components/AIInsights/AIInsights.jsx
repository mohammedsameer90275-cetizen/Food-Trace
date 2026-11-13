import styles from "./AIInsights.module.css";
import {
    BrainCircuit,
    AlertTriangle,
    CheckCircle,
    TrendingUp
} from "lucide-react";

export default function AIInsights({ products = [] }) {

    const fresh = products.filter(p => p.status === "Fresh").length;
    const warning = products.filter(p => p.status === "Warning").length;
    const expired = products.filter(p => p.status === "Expired").length;

    let message = "Inventory is healthy.";

    if (expired > 0) {
        message = `⚠ ${expired} expired product(s) require immediate attention.`;
    } else if (warning > 0) {
        message = `⚠ ${warning} product(s) should be dispatched soon.`;
    }

    return (
        <div className={styles.card}>

            <div className={styles.header}>
                <BrainCircuit size={26} />
                <h2>AI Business Insights</h2>
            </div>

            <div className={styles.grid}>

                <div className={styles.box}>
                    <TrendingUp size={30}/>
                    <h3>{fresh}</h3>
                    <p>Healthy Products</p>
                </div>

                <div className={styles.box}>
                    <AlertTriangle size={30}/>
                    <h3>{warning}</h3>
                    <p>Need Attention</p>
                </div>

                <div className={styles.box}>
                    <CheckCircle size={30}/>
                    <h3>{expired}</h3>
                    <p>Expired Items</p>
                </div>

            </div>

            <div className={styles.message}>
                <h4>AI Recommendation</h4>
                <p>{message}</p>
            </div>

        </div>
    );
}
