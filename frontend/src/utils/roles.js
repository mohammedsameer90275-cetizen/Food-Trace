// Central role configuration for FoodTrace.
// Keep the role keys in sync with the options on the Signup page and the
// roles issued by the backend (backend/db.js seeds "admin"; Signup offers
// Farmer / Supplier / Retailer / Consumer).

export const ROLES = {
  ADMIN: "admin",
  FARMER: "farmer",
  MANUFACTURER: "manufacturer",
  SUPPLIER: "supplier", // acts as "distributor" in the role spec
  RETAILER: "retailer",
  CONSUMER: "consumer",
};

// Reads the logged-in user's role from localStorage and normalizes it
// (roles are stored with their original casing, e.g. "Farmer").
export function getRole() {
  const raw = localStorage.getItem("role") || "";
  return raw.toLowerCase();
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

// Links every role sees, appended after the role-specific links below.
const BASE_LINKS = [
  { to: "/profile", icon: "fa-user", label: "Profile" },
  { to: "/settings", icon: "fa-gear", label: "Settings" },
  { to: "/logout", icon: "fa-right-from-bracket", label: "Logout" },
];

const SIDEBAR_BY_ROLE = {
  [ROLES.ADMIN]: [
    { to: "/dashboard", icon: "fa-house", label: "Dashboard" },
    { to: "/users", icon: "fa-users-gear", label: "User Management" },
    { to: "/farmers", icon: "fa-user-group", label: "Farmers" },
    { to: "/products", icon: "fa-box", label: "Products" },
    { to: "/tracking", icon: "fa-location-dot", label: "Tracking" },
  ],
  [ROLES.FARMER]: [
    { to: "/dashboard", icon: "fa-house", label: "Dashboard" },
    { to: "/products", icon: "fa-box", label: "Add Product" },
    { to: "/products", icon: "fa-boxes-stacked", label: "My Products" },
    { to: "/farmers", icon: "fa-seedling", label: "Production Details" },
  ],
  [ROLES.MANUFACTURER]: [
    { to: "/dashboard", icon: "fa-house", label: "Dashboard" },
    { to: "/products", icon: "fa-industry", label: "Processing" },
    { to: "/tracking", icon: "fa-clipboard-check", label: "Quality Check" },
  ],
  [ROLES.SUPPLIER]: [
    { to: "/dashboard", icon: "fa-house", label: "Dashboard" },
    { to: "/products", icon: "fa-truck", label: "Assigned Products" },
    { to: "/tracking", icon: "fa-location-dot", label: "Update Location" },
    { to: "/products", icon: "fa-truck-fast", label: "Delivery Status" },
  ],
  [ROLES.RETAILER]: [
    { to: "/dashboard", icon: "fa-house", label: "Dashboard" },
    { to: "/products", icon: "fa-store", label: "Received Products" },
    { to: "/products", icon: "fa-warehouse", label: "Stock" },
  ],
  [ROLES.CONSUMER]: [
    { to: "/dashboard", icon: "fa-house", label: "Dashboard" },
    { to: "/tracking", icon: "fa-qrcode", label: "Track Product / QR Scan" },
  ],
};

// De-dupes links that point at the same route (some roles list the same
// page twice under different labels, e.g. Farmer's "Add Product" / "My
// Products" both live on /products) while keeping the first label shown.
export function getSidebarLinks(role) {
  const roleLinks = SIDEBAR_BY_ROLE[role] || SIDEBAR_BY_ROLE[ROLES.CONSUMER];
  const seen = new Set();
  const deduped = [];

  for (const link of [...roleLinks, ...BASE_LINKS]) {
    if (seen.has(link.to)) continue;
    seen.add(link.to);
    deduped.push(link);
  }

  return deduped;
}

// Permissions matrix — mirrors the role/permissions table product owners
// asked for. The backend enforces the same rules independently; this copy
// only controls what the UI offers.
export const PERMISSIONS = {
  [ROLES.ADMIN]: {
    label: "Admin",
    dashboardSubtitle: "Complete Dashboard",
    canAddProduct: true,
    canEditProduct: true,
    canDeleteProduct: true,
    canAddFarmer: true,
    canEditFarmer: true,
    canDeleteFarmer: true,
    canUpdateTransportStatus: true,
    canUpdateRetailStatus: true,
    canManageUsers: true,
  },
  [ROLES.FARMER]: {
    label: "Farmer / Manufacturer",
    dashboardSubtitle: "Add Product, My Products, Production Details",
    canAddProduct: true,
    canEditProduct: true, // own products only — enforced via ownership check
    canDeleteProduct: false,
    canAddFarmer: true,
    canEditFarmer: true,
    canDeleteFarmer: false,
    canUpdateTransportStatus: false,
    canUpdateRetailStatus: false,
  },
  [ROLES.SUPPLIER]: {
    label: "Supplier / Distributor",
    dashboardSubtitle: "Assigned Products, Update Location, Delivery Status",
    canAddProduct: false,
    canEditProduct: false,
    canDeleteProduct: false,
    canAddFarmer: false,
    canEditFarmer: false,
    canDeleteFarmer: false,
    canUpdateTransportStatus: true, // transport status only
    canUpdateRetailStatus: false,
  },
  [ROLES.RETAILER]: {
    label: "Retailer",
    dashboardSubtitle: "Received Products, Stock, Sales Status",
    canAddProduct: false,
    canEditProduct: false,
    canDeleteProduct: false,
    canAddFarmer: false,
    canEditFarmer: false,
    canDeleteFarmer: false,
    canUpdateTransportStatus: false,
    canUpdateRetailStatus: true, // retailer status only
  },
  [ROLES.CONSUMER]: {
    label: "Consumer",
    dashboardSubtitle: "Track Product, QR Scan, Product Details",
    canAddProduct: false,
    canEditProduct: false,
    canDeleteProduct: false,
    canAddFarmer: false,
    canEditFarmer: false,
    canDeleteFarmer: false,
    canUpdateTransportStatus: false,
    canUpdateRetailStatus: false, // view only
  },
};

export function getPermissions(role) {
  return PERMISSIONS[role] || PERMISSIONS[ROLES.CONSUMER];
}
