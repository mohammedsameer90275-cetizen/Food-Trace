import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

import styles from "./DashboardCharts.module.css";

export default function DashboardCharts({ products }) {

    const categoryData = {};

    products.forEach(product => {
        categoryData[product.category] =
            (categoryData[product.category] || 0) + 1;
    });

    const barData = Object.keys(categoryData).map(key => ({
        name: key,
        value: categoryData[key]
    }));

    const pieData = [

        {
            name: "Fresh",
            value: products.filter(p => p.status === "Fresh").length
        },

        {
            name: "Warning",
            value: products.filter(p => p.status === "Warning").length
        },

        {
            name: "Expired",
            value: products.filter(p => p.status === "Expired").length
        }

    ];

    const COLORS = [
        "#2E7D32",
        "#FF9800",
        "#D32F2F"
    ];

    return (

        <div className={styles.grid}>

            <div className={styles.card}>

                <h3>Products by Category</h3>

                <ResponsiveContainer
                    width="100%"
                    height={320}
                >

                    <BarChart data={barData}>

                        <XAxis dataKey="name"/>

                        <YAxis/>

                        <Tooltip/>

                        <Bar
                            dataKey="value"
                            fill="#2E7D32"
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

            <div className={styles.card}>

                <h3>Freshness Distribution</h3>

                <ResponsiveContainer
                    width="100%"
                    height={320}
                >

                    <PieChart>

                        <Pie
                            data={pieData}
                            dataKey="value"
                            outerRadius={110}
                            label
                        >

                            {

                                pieData.map((entry,index)=>(
                                    <Cell
                                        key={index}
                                        fill={COLORS[index]}
                                    />
                                ))

                            }

                        </Pie>

                        <Tooltip/>

                    </PieChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}
