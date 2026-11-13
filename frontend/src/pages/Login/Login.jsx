import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Leaf } from "lucide-react";
import styles from "./Login.module.css";
import { api } from "../../utils/api";

export default function Login() {

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!token || !user) return;

        if (user.role === "Admin") navigate("/admin", { replace: true });
        else if (user.role === "Distributor") navigate("/distributor", { replace: true });
        else if (user.role === "Retailer") navigate("/retailer", { replace: true });
        else if (user.role === "Consumer") navigate("/consumer", { replace: true });
        else navigate("/dashboard", { replace: true });
    }, [navigate]);

    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({

        username: "",

        password: ""

    });

    async function handleSubmit(e) {

    e.preventDefault();

    try {

        const res = await api.post(

            "/auth/login",

            form,

            {

                auth: false

            }

        );

        localStorage.setItem(

            "token",

            res.access || res.token

        );

        localStorage.setItem(

            "isLoggedIn",

            "true"

        );

        localStorage.setItem(

            "user",

            JSON.stringify(res.user)

        );

        localStorage.setItem(

            "role",

            res.user.role

        );

        localStorage.setItem(

            "username",

            res.user.username

        );

        switch (res.user.role) {

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

                navigate("/dashboard");

        }

    }

    catch (err) {

        alert(err.message);

    }

}

    return (

        <div className={styles.container}>

            <div className={styles.card}>

                <div className={styles.logo}>

                    <Leaf size={45} />

                    <h2>FoodTrace ERP</h2>

                    <p>AI Powered Food Traceability</p>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className={styles.inputBox}>

                        <Mail size={18} />

                        <input

                            type="text"

                            placeholder="Username"

                            value={form.username}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    username:e.target.value

                                })

                            }

                        />

                    </div>

                    <div className={styles.inputBox}>

                        <Lock size={18} />

                        <input

                            type={showPassword ? "text" : "password"}

                            placeholder="Password"

                            value={form.password}

                            onChange={(e)=>

                                setForm({

                                    ...form,

                                    password:e.target.value

                                })

                            }

                        />

                        <button

                            type="button"

                            className={styles.eye}

                            onClick={()=>

                                setShowPassword(!showPassword)

                            }

                        >

                            {

                                showPassword ?

                                <EyeOff size={18}/>

                                :

                                <Eye size={18}/>

                            }

                        </button>

                    </div>

                    <button

                        className={styles.loginBtn}

                    >

                        Login

                    </button>

                </form>

                <div className={styles.links}>

                    <Link to="/forgot-password">

                        Forgot Password?

                    </Link>

                    <Link to="/signup">

                        Create Account

                    </Link>

                </div>

            </div>

        </div>

    );

}
