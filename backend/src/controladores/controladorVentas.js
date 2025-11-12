const {
  Sale,
  SaleItem,
  Product,
  Customer,
  InventoryMovement,
  User,
} = require("../modelos");
const { updateStock, checkStock } = require("../servicios/servicioInventario");
const { Op } = require("sequelize");
const sequelize = require("../configuracion/db");

/**
 * Genera número de factura único
 * Formato: SALE-YYYY-00001
 */
const generateSaleNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `SALE-${year}-`;

  const lastSale = await Sale.findOne({
    where: {
      invoiceNumber: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [["createdAt", "DESC"]],
  });

  let nextNumber = 1;
  if (lastSale && lastSale.invoiceNumber) {
    const lastNumber = parseInt(lastSale.invoiceNumber.split("-")[2]);
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${String(nextNumber).padStart(5, "0")}`;
};

/**
 * Listar ventas con filtros y paginación
 */
const list = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      paymentStatus,
      paymentMethod,
      customerId,
      startDate,
      endDate,
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Filtros
    if (search) {
      where[Op.or] = [
        { invoiceNumber: { [Op.like]: `%${search}%` } },
        { clientName: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (customerId) where.customerId = customerId;

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const { count, rows: sales } = await Sale.findAndCountAll({
      where,
      include: [
        {
          model: SaleItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "sku", "unit"],
            },
          ],
        },
        {
          model: Customer,
          as: "customer",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      limit: parseInt(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: sales,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Obtener venta por ID
 */
const getById = async (req, res, next) => {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [
        {
          model: SaleItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
        {
          model: Customer,
          as: "customer",
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Venta no encontrada",
      });
    }

    res.json({
      success: true,
      data: sale,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Crear nueva venta
 */
const create = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      customerId,
      clientName,
      items,
      paymentMethod = "cash",
      paymentStatus = "paid",
      notes,
      discount = 0,
    } = req.body;

    // Validaciones
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "La venta debe contener al menos un producto",
      });
    }

    // Verificar stock disponible
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: `Producto con ID ${item.productId} no encontrado`,
        });
      }

      if (product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}, Solicitado: ${item.quantity}`,
        });
      }
    }

    // Calcular totales
    let subtotal = 0;
    const itemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      const itemSubtotal = item.quantity * item.unitPrice;
      const itemDiscount = (itemSubtotal * (item.discount || 0)) / 100;
      const itemTax = ((itemSubtotal - itemDiscount) * (item.tax || 0)) / 100;
      const itemTotal = itemSubtotal - itemDiscount + itemTax;

      subtotal += itemSubtotal;

      itemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        tax: item.tax || 0,
        total: itemTotal,
      });
    }

    const globalDiscount = (subtotal * discount) / 100;
    const tax = ((subtotal - globalDiscount) * 16) / 100; // IVA 16%
    const total = subtotal - globalDiscount + tax;

    // Generar número de venta
    const invoiceNumber = await generateSaleNumber();

    // Crear venta
    const sale = await Sale.create(
      {
        invoiceNumber,
        customerId: customerId || null,
        clientName: clientName || "Público General",
        userId: req.user.id,
        subtotal,
        discount: globalDiscount,
        tax,
        total,
        paymentMethod,
        paymentStatus,
        notes,
      },
      { transaction }
    );

    // Crear items y actualizar inventario
    for (const itemData of itemsData) {
      await SaleItem.create(
        {
          saleId: sale.id,
          ...itemData,
        },
        { transaction }
      );

      // Actualizar stock del producto
      const product = await Product.findByPk(itemData.productId, {
        transaction,
      });
      product.stock -= itemData.quantity;
      await product.save({ transaction });

      // Registrar movimiento de inventario
      await InventoryMovement.create(
        {
          productId: itemData.productId,
          type: "exit", // Salida de inventario por venta
          quantity: -itemData.quantity,
          previousStock: product.stock + itemData.quantity,
          newStock: product.stock,
          referenceType: "sale",
          referenceId: sale.id,
          userId: req.user.id,
          notes: `Venta ${invoiceNumber}`,
        },
        { transaction }
      );
    }

    await transaction.commit();

    // Obtener venta completa
    const completeSale = await Sale.findByPk(sale.id, {
      include: [
        {
          model: SaleItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
        {
          model: Customer,
          as: "customer",
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Venta creada exitosamente",
      data: completeSale,
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

/**
 * Actualizar venta
 */
const update = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { paymentStatus, paymentMethod, notes } = req.body;

    const sale = await Sale.findByPk(id, {
      include: [{ model: SaleItem, as: "items" }],
      transaction,
    });

    if (!sale) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Venta no encontrada",
      });
    }

    // Actualizar campos permitidos
    if (paymentStatus) sale.paymentStatus = paymentStatus;
    if (paymentMethod) sale.paymentMethod = paymentMethod;
    if (notes !== undefined) sale.notes = notes;

    await sale.save({ transaction });
    await transaction.commit();

    // Obtener venta actualizada
    const updatedSale = await Sale.findByPk(id, {
      include: [
        {
          model: SaleItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
        {
          model: Customer,
          as: "customer",
        },
      ],
    });

    res.json({
      success: true,
      message: "Venta actualizada exitosamente",
      data: updatedSale,
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

/**
 * Cancelar venta
 */
const remove = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const sale = await Sale.findByPk(id, {
      include: [{ model: SaleItem, as: "items" }],
      transaction,
    });

    if (!sale) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Venta no encontrada",
      });
    }

    // Revertir stock
    for (const item of sale.items) {
      const product = await Product.findByPk(item.productId, { transaction });
      product.stock += item.quantity;
      await product.save({ transaction });

      // Registrar movimiento de cancelación
      await InventoryMovement.create(
        {
          productId: item.productId,
          type: "adjustment", // Ajuste de inventario por cancelación
          quantity: item.quantity,
          previousStock: product.stock - item.quantity,
          newStock: product.stock,
          referenceType: "sale_cancellation",
          referenceId: sale.id,
          userId: req.user.id,
          notes: `Cancelación de venta ${sale.invoiceNumber}`,
        },
        { transaction }
      );
    }

    // Eliminar items
    await SaleItem.destroy({ where: { saleId: id }, transaction });

    // Eliminar venta
    await sale.destroy({ transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: "Venta cancelada y stock revertido exitosamente",
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

/**
 * Obtener estadísticas de ventas
 */
const getStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // Totales generales
    const totalSales = await Sale.count({ where });
    const totalRevenue = await Sale.sum("total", { where });
    const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Ventas de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayRevenue = await Sale.sum("total", {
      where: {
        createdAt: {
          [Op.between]: [today, tomorrow],
        },
      },
    });

    // Ventas de la semana
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekRevenue = await Sale.sum("total", {
      where: {
        createdAt: {
          [Op.gte]: weekAgo,
        },
      },
    });

    // Ventas del mes
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthRevenue = await Sale.sum("total", {
      where: {
        createdAt: {
          [Op.gte]: monthStart,
        },
      },
    });

    // Ventas diarias de los últimos 7 días
    const dailySales = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayTotal = await Sale.sum("total", {
        where: {
          createdAt: {
            [Op.between]: [date, nextDay],
          },
        },
      });

      dailySales.push({
        date: date.toISOString().split("T")[0],
        total: dayTotal || 0,
      });
    }

    // Ventas por estado
    const salesByStatus = await Sale.findAll({
      where,
      attributes: [
        "paymentStatus",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("total")), "total"],
      ],
      group: ["paymentStatus"],
      raw: true,
    });

    // Ventas por método de pago
    const salesByPaymentMethod = await Sale.findAll({
      where,
      attributes: [
        "paymentMethod",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("total")), "total"],
      ],
      group: ["paymentMethod"],
      raw: true,
    });

    res.json({
      totalSales,
      totalAmount: totalRevenue || 0,
      averageTicket,
      todayRevenue: todayRevenue || 0,
      weekRevenue: weekRevenue || 0,
      monthRevenue: monthRevenue || 0,
      dailySales,
      byStatus: salesByStatus,
      byPaymentMethod: salesByPaymentMethod,
    });
  } catch (err) {
    console.error("Error in getStats:", err);
    next(err);
  }
};

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  getStats,
};
