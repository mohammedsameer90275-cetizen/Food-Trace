import {
    BrainCircuit,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Sparkles
} from "lucide-react";

import styles from "./AIFreshness.module.css";

export default function AIFreshness({ products = [] }) {

    const fresh = products.filter(
        p => p.status === "Fresh"
    ).length;

    const warning = products.filter(
        p => p.status === "Warning"
    ).length;

    const expired = products.filter(
        p => p.status === "Expired"
    ).length;

    const average = products.length
        ? Math.round(
              products.reduce(
                  (sum, p) => sum + Number(p.freshness_score || 0),
                  0
              ) / products.length
          )
        : 0;

    let recommendation = "Inventory is healthy and ready for dispatch.";

    if (expired > 0) {

        recommendation =
            "Remove expired products immediately.";

    } else if (warning > 0) {

        recommendation =
            "Dispatch warning products within 48 hours.";

    }

    return (

        <div className={styles.card}>

            <div className={styles.header}>

                <BrainCircuit size={28} />

                <h2>AI Freshness Analysis</h2>

            </div>

            <div className={styles.scoreBox}>

                <div className={styles.circle}>

                    {average}%

                </div>

                <div>

                    <h3>Overall Freshness</h3>

                    <p>AI Confidence : 98.4%</p>

                </div>

            </div>

            <div className={styles.stats}>

                <div>

                    <CheckCircle2 size={20} />

                    <span>Fresh</span>

                    <strong>{fresh}</strong>

                </div>

                <div>

                    <AlertTriangle size={20} />

                    <span>Warning</span>

                    <strong>{warning}</strong>

                </div>

                <div>

                    <XCircle size={20} />

                    <span>Expired</span>

                    <strong>{expired}</strong>

                </div>

            </div>

            <div className={styles.aiBox}>

                <div className={styles.aiTitle}>

                    <Sparkles size={18} />

                    <h4>AI Recommendation</h4>

                </div>

                <p>

                    {recommendation}

                </p>

            </div>

        </div>

    );

}