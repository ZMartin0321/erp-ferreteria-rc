const express = require("express");
const router = express.Router();
const {
  dashboard,
  invoicePDF,
  salesReportPDF,
} = require("../controladores/controladorReportes");
const { verifyToken } = require("../intermediarios/middlewareAutenticacion");

router.get("/dashboard", verifyToken, dashboard);
router.get("/invoice/:saleId", verifyToken, invoicePDF);
router.get("/sales-pdf", verifyToken, salesReportPDF);

module.exports = router;
