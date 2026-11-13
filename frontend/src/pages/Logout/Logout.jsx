import { useNavigate } from "react-router-dom";
import styles from "./Logout.module.css";

export default function Logout() {

    const navigate = useNavigate();

    function logout() {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("isLoggedIn");

        alert("Logged Out Successfully");

        navigate("/login", {
            replace: true
        });

    }

    function cancel() {

        const user = JSON.parse(
            localStorage.getItem("user") || "{}"
        );

        switch (user.role) {

            case "Admin":
                navigate("/admin");
                break;

            case "Farmer":
                navigate("/dashboard");
                break;

            case "Distributor":
                navigate("/distributor");
                break;

            case "Retailer":
                navigate("/retailer");
                break;

            case "Consumer":
                navigate("/consumer");
                break;

            default:
                navigate("/");

        }

    }

    return (

        <div className={styles.page}>

            <div className={styles.logoutBox}>

                <h1>Logout</h1>

                <p>

                    Are you sure you want to logout?

                </p>

                <div className={styles.buttons}>

                    <button

                        className={styles.yes}

                        onClick={logout}

                    >

                        Yes, Logout

                    </button>

                    <button

                        className={styles.no}

                        onClick={cancel}

                    >

                        Cancel

                    </button>

                </div>

            </div>

        </div>

    );

}
