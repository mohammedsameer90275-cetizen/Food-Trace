import { useEffect, useState } from "react";
import { Package, ShieldCheck, AlertCircle, Users } from "lucide-react";
import Layout from "../../components/Layout/Layout";
import ReportCards from "../../components/ReportCards/ReportCards";
import DashboardCharts from "../../components/Charts/DashboardCharts";
import ExportButtons from "../../components/ExportButtons/ExportButtons";
import { useRequireAuth } from "../../utils/auth";
import { api } from "../../utils/api";
import useCountUp from "../../utils/useCountUp";
import styles from "./Reports.module.css";

export default function Reports() {
  useRequireAuth();

  const [products, setProducts] = useState([]);
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    api
      .get("/products")
      .then((data) => setProducts(Array.isArray(data) ? data : data.products || []))
      .catch(() => setProducts([]));
    api.get("/farmers").then(setFarmers).catch(() => setFarmers([]));
  }, []);

  const safeProducts = products.filter(
    (p) => p.status !== "Expired"
  );

  const expiredProducts = products.filter(
    (p) => p.status === "Expired"
  );

  const totalProducts = products.length;
  const totalFarmers = farmers.length;
  const safe = safeProducts.length;
  const expired = expiredProducts.length;

  const totalProductsCount = useCountUp(totalProducts);
  const safeCount = useCountUp(safe);
  const expiredCount = useCountUp(expired);
  const farmerCount = useCountUp(totalFarmers);

  // Dynamic Bar Heights
  const reportCards = [
    {
      title: "Total Products",
      value: totalProductsCount,
      icon: <Package />,
    },
    {
      title: "Safe Products",
      value: safeCount,
      icon: <ShieldCheck />,
    },
    {
      title: "Expired Products",
      value: expiredCount,
      icon: <AlertCircle />,
    },
    {
      title: "Farmers",
      value: farmerCount,
      icon: <Users />,
    },
  ];

  const exportCSV = () => {
    const header = ["ID", "Product", "Category", "Farmer", "Status"];
    const rows = products.map((product) => [
      product.id,
      product.productName,
      product.category,
      product.farmer,
      product.status,
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell || "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "FoodTrace_Products.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    const header = ["ID", "Product", "Category", "Farmer", "Status"];
    const rows = products.map((product) => [
      product.id,
      product.productName,
      product.category,
      product.farmer,
      product.status,
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell || "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "FoodTrace_Products.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const html = `
      <html>
        <head>
          <title>FoodTrace Products Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h1 { color: #2e7d32; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #f5f5f5; }
          </style>
        </head>
        <body>
          <h1>FoodTrace Products Report</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Category</th>
                <th>Farmer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${products
                .map(
                  (product) => `
                <tr>
                  <td>${product.id}</td>
                  <td>${product.productName}</td>
                  <td>${product.category}</td>
                  <td>${product.farmer}</td>
                  <td>${product.status}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const downloadReport = () => {
    const report = `
=========================================
          FOODTRACE REPORT
=========================================

Generated On:
${new Date().toLocaleString()}

-----------------------------------------
SUMMARY
-----------------------------------------

Total Products : ${totalProducts}
Safe Products  : ${safe}
Expired        : ${expired}
Farmers        : ${totalFarmers}

-----------------------------------------
PRODUCTS
-----------------------------------------

${products.length === 0
  ? "No Products Added"
  : products
      .map(
        (p) =>
          `${p.id} | ${p.productName} | ${p.category} | ${p.farmer} | ${p.status}`
      )
      .join("\n")}

-----------------------------------------
FARMERS
-----------------------------------------

${farmers.length === 0
  ? "No Farmers Added"
  : farmers
      .map(
        (f) =>
          `${f.id} | ${f.name} | ${f.village} | ${f.product}`
      )
      .join("\n")}

-----------------------------------------
FEATURES
-----------------------------------------

✔ Dashboard
✔ Product Management
✔ Farmer Management
✔ Product Tracking
✔ Safety Monitoring
✔ Reports
✔ Authentication
✔ Admin Panel
✔ Search
✔ Automatic Status Detection

=========================================
Generated by FoodTrace
=========================================
`;

    const blob = new Blob([report], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "FoodTrace_Report.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <Layout>
      <div className={styles.page}>

        <h1>Reports & Analytics</h1>

        <section className={styles.reportTop}>
          <ReportCards cards={reportCards} />
          <ExportButtons
            onCSV={exportCSV}
            onPDF={exportPDF}
            onExcel={exportExcel}
          />
        </section>

        {/* Statistics */}

        <div className={styles.cards}>

          <div className={styles.card}>
            <h2>{totalProductsCount}</h2>
            <p>Total Products</p>
          </div>

          <div className={styles.card}>
            <h2>{safeCount}</h2>
            <p>Safe Products</p>
          </div>

          <div className={styles.card}>
            <h2>{expiredCount}</h2>
            <p>Expired Products</p>
          </div>

          <div className={styles.card}>
            <h2>{farmerCount}</h2>
            <p>Total Farmers</p>
          </div>

        </div>

        <DashboardCharts products={products} />

        {/* Product Table */}

        <div className={styles.tableBox}>

          <h2>Products Report</h2>

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Category</th>
                <th>Farmer</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {products.length === 0 ? (

                <tr>
                  <td colSpan="5">
                    No Products Found
                  </td>
                </tr>

              ) : (

                products.map((p) => (

                  <tr key={p.id}>

                    <td>{p.id}</td>

                    <td>{p.productName}</td>

                    <td>{p.category}</td>

                    <td>{p.farmer}</td>

                    <td
                      className={
                        p.status === "Safe"
                          ? styles.safe
                          : styles.danger
                      }
                    >
                      {p.status}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* Buttons */}

        <div className={styles.buttons}>

          <button onClick={downloadReport}>
            Download Report
          </button>

          <button onClick={printReport}>
            Print Report
          </button>

        </div>

      </div>
    </Layout>
  );
}
