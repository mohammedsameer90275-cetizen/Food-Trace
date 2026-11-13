import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import DashboardCards from "../../components/DashboardCards/DashboardCards";
import RecentProducts from "../../components/RecentProducts/RecentProducts";
import AIFreshness from "../../components/AIFreshness/AIFreshness";
import RecentActivity from "../../components/RecentActivity/RecentActivity";
import Notifications from "../../components/Notifications/Notifications";
import Charts from "../../components/Charts/Charts";
import AIInsights from "../../components/AIInsights/AIInsights";

import { api } from "../../utils/api";

import styles from "./Dashboard.module.css";

export default function Dashboard() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    useEffect(() => {

        loadProducts();

    }, []);

    async function loadProducts() {

        try {

            const res = await api.get("/products");

            setProducts(Array.isArray(res) ? res : res.products || []);

        }

        catch (err) {

            console.log(err);

        }

    }

    return (

        <DashboardLayout role="Farmer">

            <div className={styles.container}>

                <div className={styles.header}>

                    <div>

                        <h1>🌿 FoodTrace Dashboard</h1>

                        <p>

                            Welcome back! Here's your real-time supply chain overview.

                        </p>

                    </div>

                </div>

                <DashboardCards

                    products={products}

                />

                <div className={styles.topGrid}>

                    <RecentProducts

                        products={products.slice(0,5)}

                        navigate={navigate}

                    />

                    <AIFreshness

                        products={products}

                    />

                </div>

                <Charts

                    products={products}

                />

                <AIInsights products={products} />

                <Notifications products={products} />
                <RecentActivity />

            </div>

        </DashboardLayout>

    );

}
