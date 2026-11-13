import styles from "./ProductToolbar.module.css";
import { Search, Plus } from "lucide-react";

export default function ProductToolbar({

    search,

    setSearch,

    category,

    setCategory,

    status,

    setStatus,

    navigate

}) {

    return (

        <div className={styles.toolbar}>

            <div className={styles.searchBox}>

                <Search size={18}/>

                <input

                    placeholder="Search Product..."

                    value={search}

                    onChange={(e)=>

                        setSearch(e.target.value)

                    }

                />

            </div>

            <select

                value={category}

                onChange={(e)=>

                    setCategory(e.target.value)

                }

            >

                <option value="">All Categories</option>

                <option>Vegetable</option>

                <option>Fruit</option>

                <option>Grain</option>

                <option>Dairy</option>

            </select>

            <select

                value={status}

                onChange={(e)=>

                    setStatus(e.target.value)

                }

            >

                <option value="">All Status</option>

                <option>Fresh</option>

                <option>Warning</option>

                <option>Expired</option>

            </select>

            <button

                onClick={()=>

                    navigate("/add-product")

                }

            >

                <Plus size={18}/>

                Add Product

            </button>

        </div>

    );

}
