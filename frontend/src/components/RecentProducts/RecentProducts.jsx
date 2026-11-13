import {
    Eye,
    Pencil,
    Trash2,
    QrCode,
    Package
} from "lucide-react";

import styles from "./RecentProducts.module.css";

export default function RecentProducts({

    products,

    navigate

}) {

    return (

        <div className={styles.container}>

            <div className={styles.header}>

                <div>

                    <h2>📦 Recent Products</h2>

                    <p>Latest products added to FoodTrace</p>

                </div>

                <button

                    onClick={() => navigate("/add-product")}

                >

                    + Add Product

                </button>

            </div>

            <table className={styles.table}>

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Product</th>

                        <th>Category</th>

                        <th>Quantity</th>

                        <th>Freshness</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        products.length === 0 ?

                        (

                            <tr>

                                <td
                                    colSpan="7"
                                    className={styles.empty}
                                >

                                    <Package
                                        size={50}
                                    />

                                    <h3>No Products Found</h3>

                                    <p>

                                        Add your first product to begin tracking.

                                    </p>

                                </td>

                            </tr>

                        )

                        :

                        (

                            products.map(product => (

                                <tr key={product.id}>

                                    <td>

                                        {product.product_id}

                                    </td>

                                    <td>

                                        <strong>

                                            {product.product_name}

                                        </strong>

                                    </td>

                                    <td>

                                        {product.category}

                                    </td>

                                    <td>

                                        {product.quantity} {product.unit}

                                    </td>

                                    <td>

                                        <div className={styles.progress}>

                                            <div

                                                className={styles.fill}

                                                style={{

                                                    width: `${product.freshness_score}%`

                                                }}

                                            />

                                        </div>

                                        {product.freshness_score}%

                                    </td>

                                    <td>

                                        <span

                                            className={`${styles.badge} ${styles[product.status?.toLowerCase()]}`}

                                        >

                                            {product.status}

                                        </span>

                                    </td>

                                    <td className={styles.actions}>

                                        <Eye

                                            size={18}

                                            onClick={() => navigate(`/products/${product.id}`)}

                                        />

                                        <Pencil

                                            size={18}

                                            onClick={() => navigate(`/products/edit/${product.id}`)}

                                        />

                                        <Trash2

                                            size={18}

                                        />

                                        <QrCode

                                            size={18}

                                        />

                                    </td>

                                </tr>

                            ))

                        )

                    }

                </tbody>

            </table>

        </div>

    );

}