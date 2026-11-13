import styles from "./ExportButtons.module.css";

export default function ExportButtons({

    onCSV,

    onPDF,

    onExcel

}){

    return(

        <div className={styles.exportButtons}>

            <button onClick={onCSV}>

                Export CSV

            </button>

            <button onClick={onPDF}>

                Export PDF

            </button>

            <button onClick={onExcel}>

                Export Excel

            </button>

        </div>

    );

}
