import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./About.module.css";

export default function About() {
  return (
    <>
      <Navbar />

      <div className={styles.about}>
        <h1>About FoodTrace</h1>

        <p>
          <strong>FoodTrace</strong> is a Food Supply Traceability and Safety
          Monitoring System designed to improve transparency, quality, and
          safety throughout the food supply chain. The platform allows
          administrators, suppliers, and users to monitor food products from
          production to the final consumer.
        </p>

        <h2>Project Objectives</h2>

        <ul>
          <li>Track food products from farm to consumer.</li>
          <li>Monitor food safety and quality standards.</li>
          <li>Reduce food fraud and improve transparency.</li>
          <li>Maintain complete product history.</li>
          <li>Generate reports for monitoring and analysis.</li>
        </ul>

        <h2>Key Features</h2>

        <ul>
          <li>Secure Admin and User Login</li>
          <li>Product Management</li>
          <li>Farmer Management</li>
          <li>Food Tracking System</li>
          <li>Safety Monitoring</li>
          <li>Reports & Analytics</li>
          <li>User Profile Management</li>
          <li>Settings and Notifications</li>
        </ul>

        <h2>Technology Stack</h2>

        <ul>
          <li>Frontend : React.js</li>
          <li>Styling : CSS Modules</li>
          <li>Routing : React Router DOM</li>
          <li>Backend : Django (Integration Phase)</li>
          <li>Database : MySQL</li>
        </ul>

        <h2>System Workflow</h2>

        <p>
          Farmers register products with batch details. The products are then
          monitored through every stage of the supply chain. Administrators can
          verify quality, monitor safety status, and generate reports. End users
          can track products and verify their authenticity.
        </p>

        <h2>Future Enhancements</h2>

        <ul>
          <li>QR Code based Product Verification</li>
          <li>AI-based Food Quality Prediction</li>
          <li>IoT Sensor Integration</li>
          <li>Real-time Notifications</li>
          <li>Blockchain-based Traceability</li>
        </ul>

        <h2>Project Vision</h2>

        <p>
          Our vision is to build a transparent, secure, and intelligent food
          supply chain that ensures consumer trust, improves food safety, and
          reduces food wastage through modern digital technologies.
        </p>
      </div>

      <Footer />
    </>
  );
}