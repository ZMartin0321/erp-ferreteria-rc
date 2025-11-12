/**
 * Constantes de configuración de la aplicación frontend
 */

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || "ERP Ferretería RC",
  version: import.meta.env.VITE_APP_VERSION || "1.0.0",
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  environment: import.meta.env.VITE_ENV || "development",
};

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MANAGER: "manager",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/",
  PRODUCTS: "/products",
  SALES: "/sales",
  PURCHASES: "/purchases",
  SUPPLIERS: "/suppliers",
  CATEGORIES: "/categories",
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
  },
  PRODUCTS: {
    LIST: "/products",
    CREATE: "/products",
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
    GET: (id) => `/products/${id}`,
    LOW_STOCK: "/products/low-stock",
  },
  SALES: {
    LIST: "/sales",
    CREATE: "/sales",
    UPDATE: (id) => `/sales/${id}`,
    DELETE: (id) => `/sales/${id}`,
    GET: (id) => `/sales/${id}`,
  },
  PURCHASES: {
    LIST: "/purchases",
    CREATE: "/purchases",
    UPDATE: (id) => `/purchases/${id}`,
    DELETE: (id) => `/purchases/${id}`,
    GET: (id) => `/purchases/${id}`,
  },
  SUPPLIERS: {
    LIST: "/suppliers",
    CREATE: "/suppliers",
    UPDATE: (id) => `/suppliers/${id}`,
    DELETE: (id) => `/suppliers/${id}`,
    GET: (id) => `/suppliers/${id}`,
  },
  CATEGORIES: {
    LIST: "/categories",
    CREATE: "/categories",
    UPDATE: (id) => `/categories/${id}`,
    DELETE: (id) => `/categories/${id}`,
    GET: (id) => `/categories/${id}`,
  },
  REPORTS: {
    SALES: "/reports/sales",
    INVENTORY: "/reports/inventory",
    PDF: "/reports/pdf",
  },
};

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 3,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

export const NOTIFICATION_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000,
};
