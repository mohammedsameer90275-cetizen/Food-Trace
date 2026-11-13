import {
  Eye,
  Pencil,
  Trash2,
  QrCode,
  Search
} from "lucide-react";
import styles from "./ProductTable.module.css";

export default function ProductTable({

  products = [],

  search,

  setSearch,

  onView,

  onEdit,

  onDelete,

  onQR

}) {

  const filteredProducts = products.filter((product) => {

    const keyword = search.toLowerCase();

    return (

      product.product_id?.toLowerCase().includes(keyword) ||

      product.batch_id?.toLowerCase().includes(keyword) ||

      product.product_name?.toLowerCase().includes(keyword) ||

      product.category?.toLowerCase().includes(keyword)

    );

  });

  return (

    <div className={styles.container}>

      <div className={styles.header}>

        <h2>📦 Product Management</h2>

        <div className={styles.searchBox}>

          <Search size={18} />

          <input
            type="text"
            placeholder="Search Product ID, Batch ID, Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

      <table className={styles.table}>

        <thead>

          <tr>

            <th>ID</th>

            <th>Batch</th>

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

                  No Products Available

                </td>

              </tr>

            )

            :

            (

              filteredProducts.map(product => (

                <tr key={product.id}>

                  <td>{product.product_id}</td>

                  <td>{product.batch_id}</td>

                  <td>{product.product_name}</td>

                  <td>{product.category}</td>

                  <td>{product.quantity} {product.unit}</td>

                  <td>{product.expiry_date}</td>

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
                      onClick={() => onView(product)}
                    />

                    <Pencil
                      size={18}
                      onClick={() => onEdit(product)}
                    />

                    <Trash2
                      size={18}
                      onClick={() => onDelete(product)}
                    />

                    <QrCode
                      size={18}
                      onClick={() => onQR(product)}
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