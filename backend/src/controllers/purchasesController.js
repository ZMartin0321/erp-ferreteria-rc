const {
  Purchase,
  PurchaseItem,
  Product,
  Supplier,
  InventoryMovement,
  User,
} = require("../models");
const { Op } = require("sequelize");
const { sequelize } = require("../config/db");

/**
 * Genera número de compra único
 * Formato: PURCH-YYYY-00001
 */
const generatePurchaseNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `PURCH-${year}-`;

  const lastPurchase = await Purchase.findOne({
    where: {
      purchaseNumber: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [["createdAt", "DESC"]],
  });

  let nextNumber = 1;
  if (lastPurchase && lastPurchase.purchaseNumber) {
    const lastNumber = parseInt(lastPurchase.purchaseNumber.split("-")[2]);
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${String(nextNumber).padStart(5, "0")}`;
};

/**
 * Listar compras con filtros y paginación
 */
const list = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      paymentStatus,
      supplierId,
      startDate,
      endDate,
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Filtros
    if (search) {
      where[Op.or] = [
        { purchaseNumber: { [Op.like]: `%${search}%` } },
        { invoiceNumber: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (supplierId) where.supplierId = supplierId;

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const { count, rows: purchases } = await Purchase.findAndCountAll({
      where,
      include: [
        {
          model: Supplier,
          as: "supplier",
          attributes: ["id", "name", "contact", "phone", "email"],
        },
        {
          model: PurchaseItem,
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
      data: purchases,
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
 * Obtener compra por ID
 */
const getById = async (req, res, next) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id, {
      include: [
        {
          model: Supplier,
          as: "supplier",
        },
        {
          model: PurchaseItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Compra no encontrada",
      });
    }

    res.json({
      success: true,
      data: purchase,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Crear nueva compra
 */
const create = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      supplierId,
      invoiceNumber,
      items,
      expectedDate,
      paymentStatus = "pending",
      notes,
    } = req.body;

    // Validaciones
    if (!supplierId) {
      return res.status(400).json({
        success: false,
        message: "El proveedor es requerido",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "La compra debe contener al menos un producto",
      });
    }

    // Verificar que el proveedor existe
    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado",
      });
    }

    // Calcular totales
    let subtotal = 0;
    const itemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: `Producto con ID ${item.productId} no encontrado`,
        });
      }

      const itemSubtotal = item.quantity * item.unitCost;
      subtotal += itemSubtotal;

      itemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        unitCost: item.unitCost,
      });
    }

    const tax = (subtotal * 16) / 100; // IVA 16%
    const total = subtotal + tax;

    // Generar número de compra
    const purchaseNumber = await generatePurchaseNumber();

    // Crear compra
    const purchase = await Purchase.create(
      {
        purchaseNumber,
        invoiceNumber: invoiceNumber || null,
        supplierId,
        userId: req.user.id,
        subtotal,
        tax,
        total,
        status: "pending",
        paymentStatus,
        expectedDate: expectedDate || null,
        notes,
      },
      { transaction }
    );

    // Crear items (sin actualizar inventario aún)
    for (const itemData of itemsData) {
      await PurchaseItem.create(
        {
          purchaseId: purchase.id,
          ...itemData,
        },
        { transaction }
      );
    }

    await transaction.commit();

    // Obtener compra completa
    const completePurchase = await Purchase.findByPk(purchase.id, {
      include: [
        {
          model: Supplier,
          as: "supplier",
        },
        {
          model: PurchaseItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Compra registrada exitosamente",
      data: completePurchase,
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

/**
 * Recibir compra (actualiza inventario)
 */
const receive = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { receivedDate, notes } = req.body;

    const purchase = await Purchase.findByPk(id, {
      include: [{ model: PurchaseItem, as: "items" }],
      transaction,
    });

    if (!purchase) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Compra no encontrada",
      });
    }

    if (purchase.status === "received") {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Esta compra ya fue recibida",
      });
    }

    // Actualizar inventario para cada item
    for (const item of purchase.items) {
      const product = await Product.findByPk(item.productId, { transaction });

      const previousStock = product.stock;
      product.stock += item.quantity;

      // Actualizar costo del producto (opcional: usar costo promedio ponderado)
      product.cost = item.unitCost;

      await product.save({ transaction });

      // Registrar movimiento de inventario
      await InventoryMovement.create(
        {
          productId: item.productId,
          movementType: "purchase",
          quantity: item.quantity,
          previousStock,
          newStock: product.stock,
          referenceType: "purchase",
          referenceId: purchase.id,
          userId: req.user.id,
          notes: `Recepción de compra ${purchase.purchaseNumber}`,
        },
        { transaction }
      );
    }

    // Actualizar estado de la compra
    purchase.status = "received";
    purchase.receivedDate = receivedDate || new Date();
    if (notes) purchase.notes = notes;

    await purchase.save({ transaction });
    await transaction.commit();

    // Obtener compra actualizada
    const updatedPurchase = await Purchase.findByPk(id, {
      include: [
        {
          model: Supplier,
          as: "supplier",
        },
        {
          model: PurchaseItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    res.json({
      success: true,
      message: "Compra recibida y stock actualizado exitosamente",
      data: updatedPurchase,
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

/**
 * Actualizar compra (solo si no ha sido recibida)
 */
const update = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { paymentStatus, invoiceNumber, expectedDate, notes } = req.body;

    const purchase = await Purchase.findByPk(id, {
      include: [{ model: PurchaseItem, as: "items" }],
      transaction,
    });

    if (!purchase) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Compra no encontrada",
      });
    }

    if (purchase.status === "received") {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "No se puede modificar una compra ya recibida",
      });
    }

    // Actualizar campos permitidos
    if (paymentStatus) purchase.paymentStatus = paymentStatus;
    if (invoiceNumber) purchase.invoiceNumber = invoiceNumber;
    if (expectedDate) purchase.expectedDate = expectedDate;
    if (notes) purchase.notes = notes;

    await purchase.save({ transaction });
    await transaction.commit();

    // Obtener compra actualizada
    const updatedPurchase = await Purchase.findByPk(id, {
      include: [
        {
          model: Supplier,
          as: "supplier",
        },
        {
          model: PurchaseItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    res.json({
      success: true,
      message: "Compra actualizada exitosamente",
      data: updatedPurchase,
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

/**
 * Cancelar compra
 */
const remove = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const purchase = await Purchase.findByPk(id, {
      include: [{ model: PurchaseItem, as: "items" }],
      transaction,
    });

    if (!purchase) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Compra no encontrada",
      });
    }

    // Si la compra fue recibida, revertir el inventario
    if (purchase.status === "received") {
      for (const item of purchase.items) {
        const product = await Product.findByPk(item.productId, { transaction });

        const previousStock = product.stock;
        product.stock -= item.quantity;

        await product.save({ transaction });

        // Registrar movimiento de cancelación
        await InventoryMovement.create(
          {
            productId: item.productId,
            movementType: "adjustment",
            quantity: -item.quantity,
            previousStock,
            newStock: product.stock,
            referenceType: "purchase_cancellation",
            referenceId: purchase.id,
            userId: req.user.id,
            notes: `Cancelación de compra ${purchase.purchaseNumber}`,
          },
          { transaction }
        );
      }
    }

    // Eliminar items
    await PurchaseItem.destroy({ where: { purchaseId: id }, transaction });

    // Eliminar compra
    await purchase.destroy({ transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: "Compra cancelada exitosamente",
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

/**
 * Obtener estadísticas de compras
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

    const totalPurchases = await Purchase.count({ where });
    const totalAmount = await Purchase.sum("total", { where });

    const purchasesByStatus = await Purchase.findAll({
      where,
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("total")), "total"],
      ],
      group: ["status"],
    });

    const purchasesByPaymentStatus = await Purchase.findAll({
      where,
      attributes: [
        "paymentStatus",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("total")), "total"],
      ],
      group: ["paymentStatus"],
    });

    const topSuppliers = await Purchase.findAll({
      where,
      attributes: [
        "supplierId",
        [sequelize.fn("COUNT", sequelize.col("Purchase.id")), "purchaseCount"],
        [sequelize.fn("SUM", sequelize.col("total")), "totalAmount"],
      ],
      include: [
        {
          model: Supplier,
          as: "supplier",
          attributes: ["id", "name"],
        },
      ],
      group: ["supplierId", "supplier.id", "supplier.name"],
      order: [[sequelize.fn("SUM", sequelize.col("total")), "DESC"]],
      limit: 10,
    });

    res.json({
      success: true,
      data: {
        totalPurchases,
        totalAmount: totalAmount || 0,
        byStatus: purchasesByStatus,
        byPaymentStatus: purchasesByPaymentStatus,
        topSuppliers,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  list,
  getById,
  create,
  receive,
  update,
  remove,
  getStats,
};
