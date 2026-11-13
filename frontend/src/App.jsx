


import { Routes, Route } from "react-router-dom";
import ProductDetails from "./pages/Consumer/ProductDetails/ProductDetails";
import ScanProduct from "./pages/Consumer/ScanProduct/ScanProduct";
import AdminDashboard from "./pages/Admin/Dashboard/Dashboard";
import ConsumerDashboard from "./pages/Consumer/Dashboard/Dashboard";
import DistributorDashboard from "./pages/Distributor/Dashboard/Dashboard";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import Signup from "./pages/Signup/Signup";
import AddProduct from "./pages/AddProduct/AddProduct";
import MyProducts from "./pages/MyProducts/MyProducts";
import Dashboard from "./pages/Dashboard/Dashboard";
import Users from "./pages/Users/Users";
import Farmers from "./pages/Farmers/Farmers";
import Products from "./pages/Products/Products";
import Tracking from "./pages/Tracking/Tracking";
import Reports from "./pages/Reports/Reports";
import Showcase from "./pages/Showcase/Showcase";
import Catalog from "./pages/Catalog/Catalog";
import RetailerDashboard from "./pages/Retailer/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import Logout from "./pages/Logout/Logout";
import EditProduct from "./pages/EditProduct/EditProduct";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* Public Routes */}

<Route path="/" element={<Home />} />

<Route path="/about" element={<About />} />

<Route path="/contact" element={<Contact />} />

<Route path="/login" element={<Login />} />

<Route path="/admin-login" element={<AdminLogin />} />

<Route path="/signup" element={<Signup />} />



      {/* Protected Routes */}

<Route
    path="/admin"
    element={
        <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/consumer"
    element={
        <ProtectedRoute allowedRoles={["Consumer"]}>
            <ConsumerDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/distributor"
    element={
        <ProtectedRoute allowedRoles={["Distributor"]}>
            <DistributorDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/dashboard"
    element={
        <ProtectedRoute allowedRoles={["Farmer"]}>
            <Dashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/retailer"
    element={
        <ProtectedRoute allowedRoles={["Retailer"]}>
            <RetailerDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/users"
    element={
        <ProtectedRoute allowedRoles={["Admin"]}>
            <Users />
        </ProtectedRoute>
    }
/>

<Route
    path="/farmers"
    element={
        <ProtectedRoute allowedRoles={["Admin"]}>
            <Farmers />
        </ProtectedRoute>
    }
/>

<Route
    path="/products"
    element={
        <ProtectedRoute allowedRoles={["Admin","Farmer"]}>
            <Products />
        </ProtectedRoute>
    }
/>

<Route
    path="/tracking"
    element={
        <ProtectedRoute
            allowedRoles={[
                "Admin",
                "Farmer",
                "Distributor",
                "Retailer",
                "Consumer"
            ]}
        >
            <Tracking />
        </ProtectedRoute>
    }
/>

<Route
    path="/reports"
    element={
        <ProtectedRoute
            allowedRoles={[
                "Admin",
                "Farmer",
                "Distributor",
                "Retailer"
            ]}
        >
            <Reports />
        </ProtectedRoute>
    }
/>

<Route
    path="/profile"
    element={
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
    }
/>

<Route
    path="/settings"
    element={
        <ProtectedRoute>
            <Settings />
        </ProtectedRoute>
    }
/>

<Route
    path="/showcase"
    element={
        <ProtectedRoute>
            <Showcase />
        </ProtectedRoute>
    }
/>

<Route
    path="/catalog"
    element={
        <ProtectedRoute allowedRoles={["Admin","Farmer"]}>
            <Catalog />
        </ProtectedRoute>
    }
/>

<Route
    path="/logout"
    element={
        <ProtectedRoute>
            <Logout />
        </ProtectedRoute>
    }
/>

<Route
    path="/add-product"
    element={
        <ProtectedRoute allowedRoles={["Farmer"]}>
            <AddProduct />
        </ProtectedRoute>
    }
/>

<Route
    path="/my-products"
    element={
        <ProtectedRoute allowedRoles={["Farmer"]}>
            <MyProducts />
        </ProtectedRoute>
    }
/>

<Route
    path="/product/:id"
    element={
        <ProtectedRoute>
            <ProductDetails />
        </ProtectedRoute>
    }
/>

<Route
    path="/products/:id"
    element={
        <ProtectedRoute>
            <ProductDetails />
        </ProtectedRoute>
    }
/>

<Route
    path="/scan"
    element={<ScanProduct />}
/>

<Route
    path="/products/edit/:id"
    element={
        <ProtectedRoute allowedRoles={["Farmer"]}>
            <EditProduct />
        </ProtectedRoute>
    }
/>

    </Routes>
  );
}

export default App;
