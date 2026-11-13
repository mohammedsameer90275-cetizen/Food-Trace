import { useState } from "react";
import {
    UserCircle,
    User,
    Settings,
    LogOut,
    ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./ProfileMenu.module.css";

export default function ProfileMenu() {

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    function logout() {

        localStorage.clear();

        navigate("/login");

    }

    return (

        <div className={styles.profile}>

            <button

                className={styles.trigger}

                onClick={() => setOpen(!open)}

            >

                <UserCircle size={40} />

                <div>

                    <strong>

                        {user.fullname || "Anbu"}

                    </strong>

                    <small>

                        {user.role || "Farmer"}

                    </small>

                </div>

                <ChevronDown size={18} />

            </button>

            {

                open && (

                    <div className={styles.menu}>

                        <button

                            onClick={() => navigate("/profile")}

                        >

                            <User size={18} />

                            Profile

                        </button>

                        <button

                            onClick={() => navigate("/settings")}

                        >

                            <Settings size={18} />

                            Settings

                        </button>

                        <button

                            className={styles.logout}

                            onClick={logout}

                        >

                            <LogOut size={18} />

                            Logout

                        </button>

                    </div>

                )

            }

        </div>

    );

}