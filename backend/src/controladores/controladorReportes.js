const { Product, Purchase, Sale } = require("../modelos");
const {
  generateInvoicePDF,
  generateSalesReportPDF,
} = require("../servicios/servicioPdf");

const dashboard = async (req, res, next) => {
  try {
    // Minimal KPIs: counts and totals
    const productsCount = await Product.count();
    const purchasesCount = await Purchase.count();
    const salesCount = await Sale.count();

    res.json({ productsCount, purchasesCount, salesCount });
  } catch (err) {
    next(err);
  }
};

const invoicePDF = async (req, res, next) => {
  try {
    const { saleId } = req.params;

    console.log(`📄 Generando PDF para venta ID: ${saleId}`);

    if (!saleId || isNaN(saleId)) {
      return res.status(400).json({
        message: "ID de venta inválido",
        receivedId: saleId,
      });
    }

    await generateInvoicePDF(parseInt(saleId), res);

    console.log(`✅ PDF generado exitosamente para venta ID: ${saleId}`);
  } catch (err) {
    console.error("❌ Error generando PDF:", err);
    console.error("Stack completo:", err.stack);

    if (!res.headersSent) {
      return res.status(500).json({
        message: "Error al generar PDF",
        error: err.message,
        detail: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    } else {
      console.error(
        "⚠️ No se puede enviar respuesta de error - headers ya enviados"
      );
    }
  }
};

const salesReportPDF = async (req, res, next) => {
  try {
    await generateSalesReportPDF(req.query, res);
  } catch (err) {
    console.error("Error generando reporte:", err);
    if (!res.headersSent) {
      return res.status(500).json({
        message: "Error al generar reporte",
        error: err.message,
      });
    }
  }
};

module.exports = { dashboard, invoicePDF, salesReportPDF };
