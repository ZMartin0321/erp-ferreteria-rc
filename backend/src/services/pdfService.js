const PDFDocument = require("pdfkit");
const { Sale, SaleItem, Product } = require("../models");

/**
 * Genera un PDF de factura para una venta
 */
const generateInvoicePDF = async (saleId, res) => {
  let doc;

  try {
    // Buscar la venta con sus items y productos
    const sale = await Sale.findByPk(saleId, {
      include: [
        {
          model: SaleItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              required: false, // Permitir items sin producto
            },
          ],
        },
      ],
    });

    if (!sale) {
      return res.status(404).json({
        message: "Venta no encontrada",
        saleId: saleId,
      });
    }

    if (!sale.items || sale.items.length === 0) {
      return res.status(400).json({
        message: "La venta no tiene items",
        saleId: saleId,
      });
    }

    // Crear documento PDF
    doc = new PDFDocument({ margin: 50 });

    // Configurar headers para descarga
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=factura-${saleId}.pdf`
    );

    // Pipe del documento al response
    doc.pipe(res);

    // === HEADER CON LOGO ===
    const headerY = 50;

    // Logo circular azul con las letras "RC"
    // Círculo azul de fondo
    doc
      .fillColor("#3b82f6")
      .circle(110, headerY + 40, 35)
      .fill();

    // Letras "RC" en blanco
    doc.fillColor("#ffffff");
    doc
      .fontSize(28)
      .font("Helvetica-Bold")
      .text("RC", 93, headerY + 26);

    // Nombre de la empresa junto al logo
    doc.fillColor("#1e40af");
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("Ferretería RC", 160, headerY + 20);
    doc.fillColor("#6b7280");
    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Sistema de Gestión Empresarial", 160, headerY + 48);

    // Información de la factura en la derecha
    doc.fillColor("#000000");
    doc
      .fontSize(32)
      .font("Helvetica-Bold")
      .text("FACTURA", 350, headerY, { align: "right", width: 200 });
    doc.fontSize(12).font("Helvetica");
    doc.fillColor("#666666");
    doc.text(`No. ${String(sale.id).padStart(6, "0")}`, 350, headerY + 40, {
      align: "right",
      width: 200,
    });
    doc.text(
      `Fecha: ${new Date(sale.createdAt).toLocaleDateString("es-ES")}`,
      350,
      headerY + 58,
      { align: "right", width: 200 }
    );

    doc.moveDown(5);

    // Información del cliente en recuadro
    const clientY = doc.y;
    doc.fillColor("#f3f4f6").rect(50, clientY, 500, 60).fill();
    doc.fillColor("#000000");
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("CLIENTE:", 60, clientY + 10);
    doc
      .fontSize(11)
      .font("Helvetica")
      .text(sale.clientName || "Cliente General", 60, clientY + 28);

    // Estado de pago
    const statusText =
      sale.status === "paid"
        ? "✓ PAGADA"
        : sale.status === "draft"
        ? "○ BORRADOR"
        : "⏱ PENDIENTE";
    const statusColor =
      sale.status === "paid"
        ? "#10b981"
        : sale.status === "draft"
        ? "#6b7280"
        : "#f59e0b";
    doc.fillColor(statusColor).fontSize(11).font("Helvetica-Bold");
    doc.text(statusText, 400, clientY + 28, { align: "right", width: 140 });

    doc.fillColor("#000000");
    doc.moveDown(3);

    // Línea separadora elegante
    doc.strokeColor("#e5e7eb").lineWidth(2);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Tabla de items - Encabezados con diseño profesional
    doc.fontSize(14).font("Helvetica-Bold").fillColor("#1e40af");
    doc.text("Detalle de Productos", 50, doc.y);
    doc.moveDown(0.8);

    const tableTop = doc.y;
    const itemX = 50;
    const qtyX = 320;
    const priceX = 400;
    const totalX = 480;

    // Fondo del encabezado
    doc
      .fillColor("#1e40af")
      .rect(50, tableTop - 5, 500, 25)
      .fill();

    // Texto del encabezado en blanco
    doc.fontSize(10).font("Helvetica-Bold").fillColor("#ffffff");
    doc
      .text("Producto", itemX + 5, tableTop + 3, { width: 250 })
      .text("Cant.", qtyX + 5, tableTop + 3, { width: 60 })
      .text("Precio", priceX + 5, tableTop + 3, { width: 70 })
      .text("Total", totalX + 5, tableTop + 3, { width: 65 });

    doc.fillColor("#000000").font("Helvetica");
    doc.moveDown(1.2);

    // Items de la venta con filas alternadas
    let yPos = doc.y;
    let grandTotal = 0;
    let rowIndex = 0;

    for (const item of sale.items) {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const discount = parseFloat(item.discount) || 0;

      const subtotal = quantity * unitPrice;
      const discountAmount = (subtotal * discount) / 100;
      const itemTotal = subtotal - discountAmount;

      grandTotal += itemTotal;

      // Obtener nombre del producto de forma segura
      const productName =
        item.product?.name || `Producto ID: ${item.productId}`;

      // Verificar si necesitamos una nueva página
      if (yPos > 700) {
        doc.addPage();
        yPos = 50;
        rowIndex = 0;
      }

      // Fila alternada con fondo gris claro
      const rowHeight = discount > 0 ? 35 : 25;
      if (rowIndex % 2 === 0) {
        doc
          .fillColor("#f9fafb")
          .rect(50, yPos - 3, 500, rowHeight)
          .fill();
      }

      doc.fillColor("#000000");
      doc.fontSize(9).font("Helvetica");
      doc.text(productName, itemX + 5, yPos, { width: 250 });
      doc.text(quantity.toString(), qtyX + 5, yPos, { width: 60 });
      doc.text(`$${unitPrice.toFixed(2)}`, priceX + 5, yPos, { width: 70 });

      // Total en negrita
      doc.font("Helvetica-Bold");
      doc.text(`$${itemTotal.toFixed(2)}`, totalX + 5, yPos, { width: 65 });
      doc.font("Helvetica");

      if (discount > 0) {
        yPos += 13;
        doc.fontSize(8).fillColor("#666");
        doc.text(`  Descuento aplicado: ${discount}%`, itemX + 5, yPos, {
          width: 250,
        });
        doc.fillColor("#000");
      }

      yPos += discount > 0 ? 22 : 25;
      rowIndex++;
    }

    // Línea separadora antes del total
    doc.moveDown();
    doc.strokeColor("#1e40af").lineWidth(2);
    doc.moveTo(350, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Total en recuadro destacado
    const totalBoxY = doc.y;
    doc.fillColor("#1e40af").rect(350, totalBoxY, 200, 40).fill();

    doc.fillColor("#ffffff").fontSize(12).font("Helvetica");
    doc.text("TOTAL A PAGAR:", 360, totalBoxY + 8, { width: 180 });

    doc.fontSize(18).font("Helvetica-Bold");
    doc.text(`$${grandTotal.toFixed(2)}`, 360, totalBoxY + 22, {
      align: "right",
      width: 180,
    });

    // Footer profesional (relativo, no absoluto)
    doc.moveDown(3);
    doc.fillColor("#000000");

    // Línea decorativa en el footer
    doc.strokeColor("#e5e7eb").lineWidth(1);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    doc.fontSize(10).font("Helvetica-Bold").fillColor("#1e40af");
    doc.text("Ferretería RC", 50, doc.y, {
      align: "center",
      width: 500,
    });
    doc.moveDown(0.3);

    doc.fontSize(8).font("Helvetica").fillColor("#666666");
    doc.text("Gracias por su compra", 50, doc.y, {
      align: "center",
      width: 500,
    });
    doc.moveDown(0.3);

    doc.text(
      `Documento generado el ${new Date().toLocaleString("es-ES")}`,
      50,
      doc.y,
      { align: "center", width: 500 }
    );

    // Finalizar el documento
    doc.end();
  } catch (error) {
    console.error("❌ Error generando PDF de factura:", error);
    console.error("Stack:", error.stack);

    // Si el documento ya fue creado, intentar cerrarlo
    if (doc) {
      try {
        doc.end();
      } catch (endError) {
        console.error("Error cerrando documento:", endError);
      }
    }

    // Solo enviar respuesta de error si no se han enviado headers
    if (!res.headersSent) {
      return res.status(500).json({
        message: "Error al generar el PDF de la factura",
        error: error.message,
        saleId: saleId,
      });
    }
  }
};

/**
 * Genera reporte de ventas en PDF
 */
const generateSalesReportPDF = async (filters, res) => {
  try {
    const sales = await Sale.findAll({
      include: [
        {
          model: SaleItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=sales-report.pdf`
    );

    doc.on("error", (err) => {
      console.error("Error en PDFDocument de reporte:", err);
    });

    doc.pipe(res);

    doc.fontSize(20).text("REPORTE DE VENTAS", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(10)
      .text(`Fecha de generación: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    let total = 0;
    sales.forEach((sale) => {
      doc.fontSize(12).text(`Venta #${sale.id} - ${sale.clientName}`);
      doc
        .fontSize(10)
        .text(
          `Fecha: ${new Date(
            sale.createdAt
          ).toLocaleDateString()} | Total: $${parseFloat(sale.total).toFixed(
            2
          )}`
        );
      doc.moveDown(0.5);
      total += parseFloat(sale.total);
    });

    doc.moveDown();
    doc
      .fontSize(14)
      .text(`TOTAL GENERAL: $${total.toFixed(2)}`, { align: "right" });

    doc.end();
  } catch (error) {
    console.error("Error generando reporte de ventas:", error);
    throw error;
  }
};

module.exports = {
  generateInvoicePDF,
  generateSalesReportPDF,
};
