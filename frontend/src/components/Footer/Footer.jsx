import styles from "./Footer.module.css";
import {
    Leaf,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Instagram,
    Linkedin
} from "lucide-react";

export default function Footer() {

    return (

        <footer className={styles.footer}>

            <div className={styles.container}>

                <div className={styles.about}>

                    <div className={styles.logo}>

                        <Leaf size={34}/>

                        <h2>FoodTrace ERP</h2>

                    </div>

                    <p>

                        AI Powered Food Traceability Platform
                        connecting Farmers, Distributors,
                        Retailers and Consumers with complete
                        transparency.

                    </p>

                </div>

                <div>

                    <h3>Quick Links</h3>

                    <a href="/">Home</a>

                    <a href="/about">About</a>

                    <a href="/contact">Contact</a>

                </div>

                <div>

                    <h3>Contact</h3>

                    <p><Mail size={16}/> support@foodtrace.com</p>

                    <p><Phone size={16}/> +91 9876543210</p>

                    <p><MapPin size={16}/> Coimbatore, India</p>

                </div>

                <div>

                    <h3>Follow Us</h3>

                    <div className={styles.social}>

                        <Facebook size={22}/>

                        <Instagram size={22}/>

                        <Linkedin size={22}/>

                    </div>

                </div>

            </div>

            <div className={styles.copy}>

                © 2026 FoodTrace ERP | All Rights Reserved

            </div>

        </footer>

    );

}