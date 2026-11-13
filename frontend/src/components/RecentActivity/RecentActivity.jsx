import styles from "./RecentActivity.module.css";

export default function RecentActivity({ activities = [] }) {

    if (activities.length === 0) {

        activities = [

            {
                type: "add",
                message: "Tomato added by Farmer Ravi",
                time: "2 min ago"
            },

            {
                type: "dispatch",
                message: "Mango dispatched to Distributor",
                time: "10 min ago"
            },

            {
                type: "warning",
                message: "Banana expires in 2 days",
                time: "30 min ago"
            },

            {
                type: "scan",
                message: "QR Code scanned by Consumer",
                time: "1 hour ago"
            }

        ];

    }

    return (

        <div className={styles.card}>

            <h2>📋 Recent Activity</h2>

            {

                activities.map((item, index) => (

                    <div key={index} className={styles.item}>

                        <div>

                            <strong>{item.message}</strong>

                            <small>{item.time}</small>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}