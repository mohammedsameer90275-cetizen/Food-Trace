import { LoaderCircle } from "lucide-react";
import styles from "./Loading.module.css";

export default function Loading({

    text = "Loading..."

}) {

    return (

        <div className={styles.overlay}>

            <div className={styles.loaderBox}>

                <LoaderCircle

                    size={60}

                    className={styles.spinner}

                />

                <h2>FoodTrace ERP</h2>

                <p>{text}</p>

            </div>

        </div>

    );

}