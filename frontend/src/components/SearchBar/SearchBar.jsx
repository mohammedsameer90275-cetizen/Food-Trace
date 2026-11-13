import { Search, X } from "lucide-react";
import styles from "./SearchBar.module.css";

export default function SearchBar({
  value = "",
  onChange = () => {},
  placeholder = "Search Products, Farmers, Users...",
}) {
  return (
    <div className={styles.searchBar}>
      <Search size={20} className={styles.icon} />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />

      {value && (
        <button className={styles.clear} onClick={() => onChange("")} type="button">
          <X size={18} />
        </button>
      )}
    </div>
  );
}
