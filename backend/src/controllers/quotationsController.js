const { Quotation, QuotationItem, Product, Customer } = require("../models");

/**
 * Genera número de cotización automático
 */
const generateQuotationNumber = async () => {
  const lastQuotation = await Quotation.findOne({
    order: [["id", "DESC"]],
  });

  const year = new Date().getFullYear();
  const nextNumber = lastQuotation ? lastQuotation.id + 1 : 1;
  return `COT-${year}-${String(nextNumber).padStart(5, "0")}`;
};

/**
 * Lista todas las cotizaciones
 * @route GET /api/quotations
 */
const list = async (req, res, next) => {
  try {
    const { status, customerId, startDate, endDate } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (startDate) {
      where.createdAt = { [Op.gte]: new Date(startDate) };
    }

    if (endDate) {
      where.createdAt = {
        ...where.createdAt,
        [Op.lte]: new Date(endDate),
      };
    }

    const quotations = await Quotation.findAll({
      where,
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["id", "name", "phone", "email"],
        },
        {
          model: QuotationItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "sku"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "Cotizaciones obtenidas exitosamente",
      count: quotations.length,
      data: quotations,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Obtiene una cotización por ID
 * @route GET /api/quotations/:id
 */
const getById = async (req, res, next) => {
  try {
    const quotation = await Quotation.findByPk(req.params.id, {
      include: [
        {
          model: Customer,
          as: "customer",
        },
        {
          model: QuotationItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    });

    if (!quotation) {
      return res.status(404).json({
        error: "Cotización no encontrada",
        message: `No existe una cotización con el ID ${req.params.id}`,
      });
    }

    res.json({
      message: "Cotización obtenida exitosamente",
      data: quotation,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Crea una nueva cotización
 * @route POST /api/quotations
 */
const create = async (req, res, next) => {
  try {
    const { items, ...quotationData } = req.body;

    // Generar número de cotización
    if (!quotationData.quotationNumber) {
      quotationData.quotationNumber = await generateQuotationNumber();
    }

    // Calcular totales
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    const processedItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({
          error: "Producto no encontrado",
          message: `El producto con ID ${item.productId} no existe`,
        });
      }

      const itemSubtotal =
        item.quantity * item.unitPrice - (item.discount || 0);
      const itemTax = itemSubtotal * ((item.tax || 0) / 100);

      processedItems.push({
        ...item,
        productName: product.name,
        subtotal: itemSubtotal + itemTax,
      });

      subtotal += itemSubtotal;
      totalTax += itemTax;
      totalDiscount += item.discount || 0;
    }

    quotationData.subtotal = subtotal;
    quotationData.tax = totalTax;
    quotationData.discount = totalDiscount;
    quotationData.total = subtotal + totalTax;

    // Crear cotización
    const quotation = await Quotation.create(quotationData);

    // Crear items
    for (const item of processedItems) {
      await QuotationItem.create({
        ...item,
        quotationId: quotation.id,
      });
    }

    // Obtener cotización completa
    const fullQuotation = await Quotation.findByPk(quotation.id, {
      include: [
        {
          model: Customer,
          as: "customer",
        },
        {
          model: QuotationItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    res.status(201).json({
      message: "Cotización creada exitosamente",
      data: fullQuotation,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Actualiza el estado de una cotización
 * @route PATCH /api/quotations/:id/status
 */
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const quotation = await Quotation.findByPk(req.params.id);

    if (!quotation) {
      return res.status(404).json({
        error: "Cotización no encontrada",
        message: `No existe una cotización con el ID ${req.params.id}`,
      });
    }

    await quotation.update({ status });

    res.json({
      message: "Estado de cotización actualizado",
      data: quotation,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Convierte cotización a venta
 * @route POST /api/quotations/:id/convert-to-sale
 */
const convertToSale = async (req, res, next) => {
  try {
    const quotation = await Quotation.findByPk(req.params.id, {
      include: [
        {
          model: QuotationItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!quotation) {
      return res.status(404).json({
        error: "Cotización no encontrada",
        message: `No existe una cotización con el ID ${req.params.id}`,
      });
    }

    if (quotation.status !== "accepted") {
      return res.status(400).json({
        error: "Estado inválido",
        message: "Solo se pueden convertir cotizaciones aceptadas",
      });
    }

    // Aquí se integraría con el controlador de ventas
    // Por ahora solo devolvemos la información

    res.json({
      message: "Cotización lista para convertir a venta",
      data: {
        quotation,
        saleData: {
          customerId: quotation.customerId,
          clientName: quotation.clientName,
          subtotal: quotation.subtotal,
          tax: quotation.tax,
          discount: quotation.discount,
          total: quotation.total,
          items: quotation.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            tax: item.tax,
          })),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Eliminar cotización
 * @route DELETE /api/quotations/:id
 */
const deleteQuotation = async (req, res, next) => {
  try {
    const quotation = await Quotation.findByPk(req.params.id);

    if (!quotation) {
      return res.status(404).json({
        error: "Cotización no encontrada",
        message: `No existe una cotización con el ID ${req.params.id}`,
      });
    }

    await quotation.destroy();

    res.json({
      message: "Cotización eliminada exitosamente",
      data: { id: req.params.id },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  list,
  getById,
  create,
  updateStatus,
  convertToSale,
  deleteQuotation,
};
