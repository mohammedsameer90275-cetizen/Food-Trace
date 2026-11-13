import styles from "./Notifications.module.css";
import {
    Bell,
    AlertTriangle,
    Package,
    CheckCircle
} from "lucide-react";

export default function Notifications({ products = [] }) {

    const notifications = [];

    products.forEach(product => {

        if (product.status === "Expired") {

            notifications.push({

                type: "danger",

                icon: <AlertTriangle size={20}/>,

                title: `${product.product_name} has expired.`

            });

        }

        else if (product.status === "Warning") {

            notifications.push({

                type: "warning",

                icon: <Package size={20}/>,

                title: `${product.product_name} should be dispatched soon.`

            });

        }

    });

    if (notifications.length === 0) {

        notifications.push({

            type: "success",

            icon: <CheckCircle size={20}/>,

            title: "Everything looks good. No alerts."

        });

    }

    return (

        <div className={styles.card}>

            <div className={styles.header}>

                <Bell size={24}/>

                <h2>Notifications</h2>

            </div>

            {

                notifications.map((item,index)=>(

                    <div
                        key={index}
                        className={`${styles.item} ${styles[item.type]}`}
                    >

                        {item.icon}

                        <span>{item.title}</span>

                    </div>

                ))

            }

        </div>

    );

}