import { NavLink, useNavigate } from "react-router-dom";
import {
    BarChart3,
    BookOpen,
    Database,
    LayoutDashboard,
    LogOut,
    MapPinned,
    Package,
    Settings,
    Store,
    Tractor,
    Truck,
    UserCircle,
    Users
} from "lucide-react";
import styles from "./Sidebar.module.css";

export default function Sidebar({ role }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const menus = {
        Admin: [
            { icon: LayoutDashboard, name: "Dashboard", path: "/admin" },
            { icon: BookOpen, name: "Project Summary", path: "/showcase" },
            { icon: Database, name: "Dataset", path: "/catalog" },
            { icon: Users, name: "Users", path: "/users" },
            { icon: Tractor, name: "Farmers", path: "/farmers" },
            { icon: Truck, name: "Products", path: "/products" },
            { icon: Store, name: "Tracking", path: "/tracking" },
            { icon: Settings, name: "Settings", path: "/settings" }
        ],
        Farmer: [
            { icon: LayoutDashboard, name: "Dashboard", path: "/dashboard" },
            { icon: Package, name: "Add Product", path: "/add-product" },
            { icon: Package, name: "My Products", path: "/my-products" },
            { icon: Database, name: "Dataset", path: "/catalog" },
            { icon: MapPinned, name: "Tracking", path: "/tracking" },
            { icon: Settings, name: "Settings", path: "/settings" }
        ],
        Distributor: [
            { icon: LayoutDashboard, name: "Dashboard", path: "/distributor" },
            { icon: Package, name: "Incoming", path: "/products" },
            { icon: Truck, name: "Dispatch", path: "/products" },
            { icon: MapPinned, name: "Tracking", path: "/tracking" }
        ],
        Retailer: [
            { icon: LayoutDashboard, name: "Dashboard", path: "/retailer" },
            { icon: Store, name: "Inventory", path: "/products" },
            { icon: Package, name: "Sales", path: "/products" },
            { icon: MapPinned, name: "Tracking", path: "/tracking" }
        ],
        Consumer: [
            { icon: LayoutDashboard, name: "Dashboard", path: "/consumer" },
            { icon: Package, name: "Scan QR", path: "/scan" },
            { icon: BarChart3, name: "Tracking", path: "/tracking" },
            { icon: BookOpen, name: "Project Summary", path: "/showcase" }
        ]
    };

    return (
        <aside className={styles.sidebar}>
            <div>
                <h2 className={styles.logo}>FoodTrace</h2>
                <div className={styles.menu}>
                    {menus[role]?.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    isActive ? `${styles.link} ${styles.active}` : styles.link
                                }
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            <div className={styles.footer}>
                <div className={styles.user}>
                    <UserCircle size={36} />
                    <div>
                        <strong>{user.fullname || user.username || "User"}</strong>
                        <small>{role}</small>
                    </div>
                </div>

                <button
                    className={styles.logout}
                    onClick={() => {
                        localStorage.clear();
                        navigate("/login");
                    }}
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
