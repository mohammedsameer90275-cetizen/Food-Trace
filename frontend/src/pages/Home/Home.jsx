import Layout from "../../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import {
    ShieldCheck,
    ScanLine,
    Leaf,
    BrainCircuit,
    ChartColumnIncreasing,
    PackageCheck,
    Truck,
    Tractor,
    Store,
    Users
} from "lucide-react";

import banner from "../../assets/images/banner1.png";

export default function Home() {

    const navigate = useNavigate();

    const features = [

    {
        icon: Leaf,
        title: "Farm to Consumer",
        desc: "Track every product from harvesting to the consumer with complete transparency."
    },

    {
        icon: BrainCircuit,
        title: "AI Freshness Analysis",
        desc: "AI predicts freshness, quality and expiry before products reach customers."
    },

    {
        icon: ScanLine,
        title: "QR Code Tracking",
        desc: "Instantly verify product origin, batch details and complete journey."
    },

    {
        icon: ShieldCheck,
        title: "Food Safety",
        desc: "Ensure compliance with food safety standards and regulations."

    },

    {
        icon: Truck,
        title: "Supply Chain",
        desc: "Monitor live movement across farmers, distributors and retailers."

    },

    {
        icon: PackageCheck,
        title: "Smart Inventory",
        desc: "Manage stock levels with intelligent expiry and freshness alerts."

    }

];

    const stats = [

        {
            value:"20+",
            title:"Products"
        },

        {
            value:"5",
            title:"Supply Chain Roles"
        },

        {
            value:"98%",
            title:"AI Accuracy"
        },

        {
            value:"24/7",
            title:"Monitoring"
        }

    ];


    return (

        <Layout>

            <section className={styles.hero}>

                <div>

                    <span className={styles.badge}>

                        AI Powered Food Supply Chain

                    </span>

                    <h1>

                        Smart Food Supply Traceability Platform

                    </h1>

                    <p>

                        FoodTrace connects Farmers,
                        Distributors,
                        Retailers
                        and Consumers using AI,
                        QR Codes and
                        Real-Time Traceability.

                    </p>

                    <div className={styles.highlights}>

                        <div>

                            <Leaf size={22}/>

                            <span>Farm to Consumer</span>

                        </div>

                        <div>

                            <ShieldCheck size={22}/>

                            <span>Safe & Transparent</span>

                        </div>

                        <div>

                            <ChartColumnIncreasing size={22}/>

                            <span>Real-time Monitoring</span>

                        </div>

                    </div>

                </div>

                <div className={styles.heroImage}>

                    <img
                        src={banner}
                        alt="FoodTrace"
                    />

                    <div className={styles.roles}>

                        <div>
                            <Tractor size={30}/>
                            <span>Farmer</span>
                        </div>

                        <div>
                            <Truck size={30}/>
                            <span>Distributor</span>
                        </div>

                        <div>
                            <Store size={30}/>
                            <span>Retailer</span>
                        </div>

                        <div>
                            <Users size={30}/>
                            <span>Consumer</span>
                        </div>

                    </div>

                </div>

            </section>

            <section className={styles.stats}>

                {

                    stats.map((item,index)=>(

                        <div
                            key={index}
                            className={styles.stat}
                        >

                            <h2>{item.value}</h2>

                            <p>{item.title}</p>

                        </div>

                    ))

                }

            </section>

            <section className={styles.features}>

                <h2>

                    Why Choose FoodTrace?

                </h2>

                <div className={styles.grid}>

                    {

                        features.map((item,index)=>{

                            const Icon=item.icon;

                            return(

                                <div
                                    key={index}
                                    className={styles.card}
                                >

                                    <div className={styles.icon}>

                                        <Icon size={38}/>

                                    </div>

                                    <h3>

                                        {item.title}

                                    </h3>

                                    <p>

                                        {item.desc}

                                    </p>

                                </div>

                            );

                        })

                    }

                </div>

            </section>

            <section className={styles.why}>

                <div className={styles.leftWhy}>

                    <span className={styles.tag}>
                        WHY FOODTRACE ERP
                    </span>

                    <h2>

                        One Platform.

                        Complete Food Supply

                        Chain Management.

                    </h2>

                    <p>

                        FoodTrace ERP integrates AI, QR technology,
                        inventory management and real-time tracking
                        into a single intelligent platform for every
                        stakeholder.

                    </p>

                </div>

                <div className={styles.rightWhy}>

                    <div className={styles.whyCard}>

                        <h1>99.8%</h1>

                        <span>Traceability Accuracy</span>

                    </div>

                    <div className={styles.whyCard}>

                        <h1>24/7</h1>

                        <span>Live Monitoring</span>

                    </div>

                    <div className={styles.whyCard}>

                        <h1>AI</h1>

                        <span>Freshness Prediction</span>

                    </div>

                    <div className={styles.whyCard}>

                        <h1>100%</h1>

                        <span>QR Verification</span>

                    </div>

                </div>

            </section>

            <section className={styles.process}>

                <span className={styles.tag}>
                    HOW IT WORKS
                </span>

                <h2>

                    Track Every Product

                    From Farm To Fork

                </h2>

                <p className={styles.processDesc}>

                    Every product is securely tracked through every stage
                    using AI analysis, QR verification and real-time updates.

                </p>

                <div className={styles.timeline}>

                    <div className={styles.step}>

                        <div className={styles.circle}>
                            <Leaf size={34}/>
                        </div>

                        <h3>Farmer</h3>

                        <p>Harvest & Upload</p>

                    </div>

                    <div className={styles.line}></div>

                    <div className={styles.step}>

                        <div className={styles.circle}>
                            <PackageCheck size={34}/>
                        </div>

                        <h3>Processing</h3>

                        <p>Quality Check</p>

                    </div>

                    <div className={styles.line}></div>

                    <div className={styles.step}>

                        <div className={styles.circle}>
                            <Truck size={34}/>
                        </div>

                        <h3>Distributor</h3>

                        <p>Transportation</p>

                    </div>

                    <div className={styles.line}></div>

                    <div className={styles.step}>

                        <div className={styles.circle}>
                            <ChartColumnIncreasing size={34}/>
                        </div>

                        <h3>Retailer</h3>

                        <p>Inventory</p>

                    </div>

                    <div className={styles.line}></div>

                    <div className={styles.step}>

                        <div className={styles.circle}>
                            <ScanLine size={34}/>
                        </div>

                        <h3>Consumer</h3>

                        <p>QR Verification</p>

                    </div>

                </div>

            </section>

            <section className={styles.dashboardPreview}>

                <div className={styles.previewLeft}>

                    <span className={styles.tag}>

                        LIVE DASHBOARD

                    </span>

                    <h2>

                        Everything You Need

                        In One Dashboard

                    </h2>

                    <p>

                        Manage products, monitor freshness,
                        scan QR codes, generate reports and
                        track every product in real-time with
                        one intelligent dashboard.

                    </p>

                    <ul>

                        <li>✔ Product Management</li>

                        <li>✔ AI Freshness Analysis</li>

                        <li>✔ QR Code Generation</li>

                        <li>✔ Supply Chain Tracking</li>

                        <li>✔ Reports & Analytics</li>

                    </ul>

                </div>

                <div className={styles.previewRight}>

                    <div className={styles.previewCard}>

                        <h3>Dashboard Overview</h3>

                        <div className={styles.previewStats}>

                            <div>
                                <h2>245</h2>
                                <span>Products</span>
                            </div>

                            <div>
                                <h2>98%</h2>
                                <span>Freshness</span>
                            </div>

                            <div>
                                <h2>15</h2>
                                <span>Alerts</span>
                            </div>

                            <div>
                                <h2>58</h2>
                                <span>QR Scans</span>
                            </div>

                        </div>

                    </div>

                </div>

            </section>

            <section className={styles.cta}>

                <div className={styles.ctaBox}>

                    <span className={styles.tag}>

                        READY TO START?

                    </span>

                    <h2>

                        Transform Your Food Supply Chain
                        With FoodTrace ERP

                    </h2>

                    <p>

                        Join farmers, distributors, retailers and consumers
                        using AI-powered food traceability to ensure
                        transparency, safety and quality.

                    </p>

                    <div className={styles.ctaButtons}>

                        <button
                            onClick={() => navigate("/signup")}
                            className={styles.primaryBtn}
                        >
                            Create Free Account
                        </button>

                        <button
                            onClick={() => navigate("/login")}
                            className={styles.secondaryBtn}
                        >
                            Login
                        </button>

                    </div>

                </div>

            </section>

        </Layout>

    );

}