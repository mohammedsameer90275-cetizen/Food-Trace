import { NavLink, useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {

    const navigate = useNavigate();

    return (

        <header className={styles.navbar}>

            <div
                className={styles.logo}
                onClick={() => navigate("/")}
            >

                <Leaf size={34} />

                <h2>FoodTrace ERP</h2>

            </div>

            <nav className={styles.menu}>

                <NavLink to="/">Home</NavLink>

                <NavLink to="/about">About</NavLink>

                <NavLink to="/contact">Contact</NavLink>

            </nav>

            <div className={styles.buttons}>

                <button
                    className={styles.login}
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>

                <button
                    className={styles.signup}
                    onClick={() => navigate("/signup")}
                >
                    Sign Up
                </button>

            </div>

        </header>

    );

}