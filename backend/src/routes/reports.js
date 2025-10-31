const express = require("express");
const router = express.Router();
const {
  dashboard,
  invoicePDF,
  salesReportPDF,
} = require("../controllers/reportsController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/dashboard", verifyToken, dashboard);
router.get("/invoice/:saleId", verifyToken, invoicePDF);
router.get("/sales-pdf", verifyToken, salesReportPDF);

module.exports = router;
