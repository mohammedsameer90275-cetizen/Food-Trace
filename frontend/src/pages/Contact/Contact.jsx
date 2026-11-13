import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <>
      <Navbar />

      <div className={styles.contact}>
        <h1>Contact Us</h1>

        <p className={styles.subtitle}>
          We'd love to hear from you! Feel free to contact us for any queries,
          suggestions, or support regarding the Food Supply Traceability &
          Safety Monitoring System.
        </p>

        <div className={styles.container}>
          {/* Contact Information */}

          <div className={styles.info}>
            <h2>Contact Information</h2>

            <p><strong>Company:</strong> FoodTrace Solutions Pvt Ltd</p>

            <p><strong>Address:</strong> Chennai, Tamil Nadu, India</p>

            <p><strong>Email:</strong> support@foodtrace.com</p>

            <p><strong>Phone:</strong> +91 9876543210</p>

            <p><strong>Working Hours:</strong> Monday - Saturday</p>

            <p><strong>Timing:</strong> 9:00 AM - 7:00 PM</p>

            <h3>Why Contact Us?</h3>

            <ul>
              <li>Product Tracking Support</li>
              <li>Food Safety Queries</li>
              <li>Supplier Registration</li>
              <li>Technical Assistance</li>
              <li>Project Demonstration</li>
            </ul>
          </div>

          {/* Contact Form */}

          <div className={styles.formBox}>
            <h2>Send a Message</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message Sent Successfully!");
                e.target.reset();
              }}
            >
              <input
                type="text"
                placeholder="Your Name"
                required
              />

              <input
                type="email"
                placeholder="Your Email"
                required
              />

              <input
                type="text"
                placeholder="Subject"
                required
              />

              <textarea
                rows="6"
                placeholder="Enter your message..."
                required
              ></textarea>

              <button type="submit">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}