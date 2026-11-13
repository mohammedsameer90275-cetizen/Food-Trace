import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

import styles from "./Charts.module.css";

export default function Charts({ products = [] }) {

    const statusData = [

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

        "#22C55E",

        "#F59E0B",

        "#EF4444"

    ];

    const categoryMap = {};

    products.forEach(product => {

        categoryMap[product.category] =
            (categoryMap[product.category] || 0) + 1;

    });

    const categoryData = Object.keys(categoryMap).map(key => ({

        category: key,

        total: categoryMap[key]

    }));

    return (

        <div className={styles.grid}>

            <div className={styles.card}>

                <h2>📦 Products by Category</h2>

                <ResponsiveContainer width="100%" height={320}>

                    <BarChart data={categoryData}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="category" />

                        <YAxis />

                        <Tooltip />

                        <Bar
                            dataKey="total"
                            fill="#2E7D32"
                            radius={[8,8,0,0]}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

            <div className={styles.card}>

                <h2>📊 Product Status</h2>

                <ResponsiveContainer width="100%" height={320}>

                    <PieChart>

                        <Pie

                            data={statusData}

                            dataKey="value"

                            outerRadius={110}

                            label

                        >

                            {

                                statusData.map((item,index)=>(

                                    <Cell

                                        key={index}

                                        fill={COLORS[index]}

                                    />

                                ))

                            }

                        </Pie>

                        <Legend />

                        <Tooltip />

                    </PieChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}