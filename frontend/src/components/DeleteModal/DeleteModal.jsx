import styles from "./DeleteModal.module.css";
import { TriangleAlert } from "lucide-react";

export default function DeleteModal({

    open,

    product,

    onClose,

    onDelete

}) {

    if (!open) return null;

    return (

        <div className={styles.overlay}>

            <div className={styles.modal}>

                <TriangleAlert
                    size={70}
                    color="#DC2626"
                />

                <h2>

                    Delete Product?

                </h2>

                <p>

                    Are you sure you want to delete

                    <strong>

                        {" "}
                        {product?.product_name}

                    </strong>

                    ?

                </p>

                <div className={styles.buttons}>

                    <button
                        className={styles.cancel}
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className={styles.delete}
                        onClick={onDelete}
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>

    );

}
