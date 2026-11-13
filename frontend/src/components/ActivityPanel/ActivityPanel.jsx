import {
    PackagePlus,
    Truck,
    QrCode,
    CircleCheckBig,
    AlertTriangle
} from "lucide-react";

import styles from "./ActivityPanel.module.css";

export default function ActivityPanel() {

    const activities = [

        {
            icon: PackagePlus,
            title: "Tomato Added",
            description: "Farmer Ravi added 500 Kg Tomato",
            time: "2 mins ago",
            color: "#22C55E"
        },

        {
            icon: Truck,
            title: "Shipment Started",
            description: "Batch BT20260012 left warehouse",
            time: "25 mins ago",
            color: "#2563EB"
        },

        {
            icon: QrCode,
            title: "QR Code Scanned",
            description: "Consumer verified FT20260001",
            time: "1 hour ago",
            color: "#7C3AED"
        },

        {
            icon: CircleCheckBig,
            title: "Retail Delivery",
            description: "Mango delivered successfully",
            time: "3 hours ago",
            color: "#16A34A"
        },

        {
            icon: AlertTriangle,
            title: "Expiry Alert",
            description: "Banana expires within 2 days",
            time: "5 hours ago",
            color: "#F59E0B"
        }

    ];

    return (

        <div className={styles.card}>

            <h2>📋 Recent Activity</h2>

            <div className={styles.timeline}>

                {

                    activities.map((activity,index)=>{

                        const Icon = activity.icon;

                        return(

                            <div
                                className={styles.item}
                                key={index}
                            >

                                <div
                                    className={styles.icon}
                                    style={{
                                        background:activity.color
                                    }}
                                >

                                    <Icon size={18}/>

                                </div>

                                <div className={styles.content}>

                                    <h4>

                                        {activity.title}

                                    </h4>

                                    <p>

                                        {activity.description}

                                    </p>

                                    <small>

                                        {activity.time}

                                    </small>

                                </div>

                            </div>

                        );

                    })

                }

            </div>

        </div>

    );

}