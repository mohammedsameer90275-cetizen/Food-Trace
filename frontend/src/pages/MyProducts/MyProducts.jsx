import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, QrCode } from "lucide-react";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { api } from "../../utils/api";
import styles from "./MyProducts.module.css";

export default function MyProducts() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {

        loadProducts();

    }, []);

    async function loadProducts() {

        try {

            const data = await api.get("/products");

            setProducts(Array.isArray(data) ? data : data.products || []);

        }

        catch (err) {

            console.log(err);

        }

    }

    function exportProducts() {
        const rows = [
            [
                "Product ID",
                "Batch ID",
                "Product Name",
                "Category",
                "Quantity",
                "Freshness",
                "Status",
                "Harvest Date",
                "Expiry Date"
            ]
        ];

        products.forEach((product) => {
            rows.push([
                product.product_id || "",
                product.batch_id || "",
                product.product_name || "",
                product.category || "",
                product.quantity != null ? product.quantity : "",
                product.freshness_score != null ? product.freshness_score : "",
                product.status || "",
                product.harvest_date || "",
                product.expiry_date || ""
            ]);
        });

        const csvContent = rows
            .map((row) => row
                .map((value) => {
                    const text = String(value).replace(/"/g, '""');
                    return `"${text}"`;
                })
                .join(",")
            )
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "products.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    async function deleteProduct(id) {
        try {
            await api.delete(`/products/${id}`);
            loadProducts();
        }
        catch (err) {
            alert(err.message);
        }
    }

    const filteredProducts = products.filter((product) => {

        const keyword = search.toLowerCase();

        const matchSearch =
            product.product_id?.toLowerCase().includes(keyword) ||
            product.batch_id?.toLowerCase().includes(keyword) ||
            product.product_name?.toLowerCase().includes(keyword) ||
            product.category?.toLowerCase().includes(keyword);

        const matchCategory =
            category === "" || product.category === category;

        const matchStatus =
            status === "" || product.status === status;

        return matchSearch && matchCategory && matchStatus;

    });

    return (

        <div className={styles.container}>

            {/* Header */}

            <div className={styles.topBar}>

                <h1>📦 Product Management</h1>

                <div className={styles.actions}>

                    <button
                        onClick={exportProducts}
                    >
                        Export Products
                    </button>

                    <button
                        onClick={() => navigate("/add-product")}
                    >
                        + Add Product
                    </button>

                </div>

            </div>

            {/* Search */}

            <div className={styles.toolbar}>

                <input
                    type="text"
                    placeholder="Search Products..."
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                />

                <select
                    value={category}
                    onChange={(e)=>setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option>Vegetable</option>
                    <option>Fruit</option>
                    <option>Grain</option>
                    <option>Dairy</option>
                </select>

                <select
                    value={status}
                    onChange={(e)=>setStatus(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option>Fresh</option>
                    <option>Warning</option>
                    <option>Expired</option>
                </select>

            </div>

            {/* Dashboard Cards */}

            <div className={styles.cards}>

                <div className={styles.card}>

                    <h2>{products.length}</h2>

                    <p>Total Products</p>

                </div>

                <div className={styles.card}>

                    <h2>

                        {products.filter(p => p.status === "Fresh").length}

                    </h2>

                    <p>Fresh</p>

                </div>

                <div className={styles.card}>

                    <h2>

                        {products.filter(p => p.status === "Warning").length}

                    </h2>

                    <p>Warning</p>

                </div>

                <div className={styles.card}>

                    <h2>

                        {products.filter(p => p.status === "Expired").length}

                    </h2>

                    <p>Expired</p>

                </div>

            </div>

            {/* Product Table */}

            <table className={styles.table}>

                <thead>

                    <tr>

                        <th>Product ID</th>

                        <th>Batch ID</th>

                        <th>Product</th>

                        <th>Category</th>

                        <th>Quantity</th>

                        <th>Expiry</th>

                        <th>Freshness</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        filteredProducts.length === 0 ?

                            (

                                <tr>

                                    <td colSpan="9">

                                        No Products Found

                                    </td>

                                </tr>

                            )

                            :

                            (

                                filteredProducts.map((product) => (

                                    <tr key={product.id}>

                                        <td>{product.product_id}</td>

                                        <td>{product.batch_id}</td>

                                        <td>{product.product_name}</td>

                                        <td>{product.category}</td>

                                        <td>{product.quantity} {product.unit}</td>

                                        <td>{product.expiry_date}</td>

                                        <td>{product.freshness_score}%</td>

                                        <td>

                                            <span className={`${styles.status} ${styles[product.status?.toLowerCase()]}`}>

                                                {product.status}

                                            </span>

                                        </td>

                                        <td>

                                            <button title="View" onClick={() => navigate(`/products/${product.id}`)}>
                                                <Eye size={16} />
                                            </button>

                                            <button title="Edit" onClick={() => navigate(`/products/edit/${product.id}`)}>
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                title="Delete"
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setDeleteOpen(true);
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                            <button title="QR Code">
                                                <QrCode size={16} />
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )

                    }

                </tbody>

            </table>

            <DeleteModal
                open={deleteOpen}
                product={selectedProduct}
                onClose={() => setDeleteOpen(false)}
                onDelete={async () => {
                    await deleteProduct(selectedProduct.id);
                    setDeleteOpen(false);
                }}
            />

        </div>

    );

}
