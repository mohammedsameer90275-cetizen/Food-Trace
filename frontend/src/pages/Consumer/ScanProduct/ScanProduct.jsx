import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ScanProduct.module.css";

export default function ScanProduct() {

    const navigate = useNavigate();

    const [productId, setProductId] = useState("");

    function handleSearch() {

        if (!productId.trim()) {

            alert("Enter Product ID");

            return;

        }

        navigate(`/product/${productId.trim()}`);

    }

    return (

        <div className={styles.container}>

            <div className={styles.card}>

                <h1>📱 Product Verification</h1>

                <p>

                    Enter Product ID or scan QR code.

                </p>

                <input

                    placeholder="Product ID"

                    value={productId}

                    onChange={(e)=>setProductId(e.target.value)}

                />

                <button onClick={handleSearch}>

                    Verify Product

                </button>

            </div>

        </div>

    );

}
