import { QRCodeCanvas } from "qrcode.react";
import styles from "./ProductQRCode.module.css";

export default function ProductQRCode({ product }) {

    const qrValue =
        `${window.location.origin}/product/${product.product_id || product.id}`;

    return (

        <div className={styles.card}>

            <h2>Product QR Code</h2>

            <QRCodeCanvas

                value={qrValue}

                size={220}

                includeMargin

            />

            <p>

                Scan to view product details

            </p>

            <button
                onClick={() => window.print()}
            >
                Download / Print QR
            </button>

        </div>

    );

}
