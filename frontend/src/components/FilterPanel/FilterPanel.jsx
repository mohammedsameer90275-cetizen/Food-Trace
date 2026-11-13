import styles from "./FilterPanel.module.css";

export default function FilterPanel({

    category,

    setCategory,

    status,

    setStatus,

    fromDate,

    setFromDate,

    toDate,

    setToDate,

    onReset

}) {

    return (

        <div className={styles.container}>

            <div className={styles.group}>

                <label>Category</label>

                <select
                    value={category}
                    onChange={(e)=>setCategory(e.target.value)}
                >

                    <option value="">All Categories</option>

                    <option>Vegetable</option>

                    <option>Fruit</option>

                    <option>Grains</option>

                    <option>Dairy</option>

                    <option>Spices</option>

                </select>

            </div>

            <div className={styles.group}>

                <label>Status</label>

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

            <div className={styles.group}>

                <label>From</label>

                <input

                    type="date"

                    value={fromDate}

                    onChange={(e)=>setFromDate(e.target.value)}

                />

            </div>

            <div className={styles.group}>

                <label>To</label>

                <input

                    type="date"

                    value={toDate}

                    onChange={(e)=>setToDate(e.target.value)}

                />

            </div>

            <button

                className={styles.reset}

                onClick={onReset}

            >

                Reset Filters

            </button>

        </div>

    );

}