import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

import styles from "./FreshnessChart.module.css";

export default function FreshnessChart({ products = [] }) {

    const fresh = products.filter(
        p => p.status === "Fresh"
    ).length;

    const warning = products.filter(
        p => p.status === "Warning"
    ).length;

    const expired = products.filter(
        p => p.status === "Expired"
    ).length;

    const data = [

        {
            name: "Fresh",
            value: fresh,
            color: "#22C55E"
        },

        {
            name: "Warning",
            value: warning,
            color: "#F59E0B"
        },

        {
            name: "Expired",
            value: expired,
            color: "#EF4444"
        }

    ];

    return (

        <div className={styles.card}>

            <h2>📊 Product Status</h2>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={5}
                    >

                        {

                            data.map((item, index) => (

                                <Cell
                                    key={index}
                                    fill={item.color}
                                />

                            ))

                        }

                    </Pie>

                    <Tooltip />

                    <Legend />

                </PieChart>

            </ResponsiveContainer>

        </div>

    );

}