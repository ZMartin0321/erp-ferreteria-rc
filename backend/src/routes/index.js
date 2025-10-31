const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const productsRoutes = require("./products");
const categoriesRoutes = require("./categories");
const suppliersRoutes = require("./suppliers");
const customersRoutes = require("./customers");
const purchasesRoutes = require("./purchases");
const salesRoutes = require("./sales");
const quotationsRoutes = require("./quotations");
const reportsRoutes = require("./reports");

router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/suppliers", suppliersRoutes);
router.use("/customers", customersRoutes);
router.use("/purchases", purchasesRoutes);
router.use("/sales", salesRoutes);
router.use("/quotations", quotationsRoutes);
router.use("/reports", reportsRoutes);

router.get("/", (req, res) =>
  res.json({
    message: "ERP Ferretería RC API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      categories: "/api/categories",
      suppliers: "/api/suppliers",
      customers: "/api/customers",
      purchases: "/api/purchases",
      sales: "/api/sales",
      quotations: "/api/quotations",
      reports: "/api/reports",
    },
  })
);

module.exports = router;
