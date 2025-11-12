const { Customer } = require("../modelos");
const { Op } = require("sequelize");

/**
 * Obtiene todos los clientes
 * @route GET /api/customers
 */
const list = async (req, res, next) => {
  try {
    const { search, customerType, isActive } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { rfc: { [Op.like]: `%${search}%` } },
      ];
    }

    if (customerType) {
      where.customerType = customerType;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const customers = await Customer.findAll({
      where,
      order: [["name", "ASC"]],
    });

    res.json({
      message: "Clientes obtenidos exitosamente",
      count: customers.length,
      data: customers,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Obtiene un cliente por ID
 * @route GET /api/customers/:id
 */
const getById = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({
        error: "Cliente no encontrado",
        message: `No existe un cliente con el ID ${req.params.id}`,
      });
    }

    res.json({
      message: "Cliente obtenido exitosamente",
      data: customer,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Crea un nuevo cliente
 * @route POST /api/customers
 */
const create = async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);

    res.status(201).json({
      message: "Cliente creado exitosamente",
      data: customer,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Actualiza un cliente
 * @route PUT /api/customers/:id
 */
const update = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({
        error: "Cliente no encontrado",
        message: `No existe un cliente con el ID ${req.params.id}`,
      });
    }

    await customer.update(req.body);

    res.json({
      message: "Cliente actualizado exitosamente",
      data: customer,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Elimina un cliente
 * @route DELETE /api/customers/:id
 */
const remove = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({
        error: "Cliente no encontrado",
        message: `No existe un cliente con el ID ${req.params.id}`,
      });
    }

    await customer.destroy();

    res.json({
      message: "Cliente eliminado exitosamente",
      data: { id: req.params.id },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Obtiene estadísticas del cliente
 * @route GET /api/customers/:id/stats
 */
const getStats = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      include: [
        {
          association: "sales",
          attributes: ["id", "total", "status", "createdAt"],
        },
      ],
    });

    if (!customer) {
      return res.status(404).json({
        error: "Cliente no encontrado",
        message: `No existe un cliente con el ID ${req.params.id}`,
      });
    }

    const stats = {
      totalSales: customer.sales.length,
      totalAmount: customer.sales.reduce((sum, sale) => {
        return sum + parseFloat(sale.total || 0);
      }, 0),
      lastPurchaseDate:
        customer.sales.length > 0
          ? customer.sales[customer.sales.length - 1].createdAt
          : null,
    };

    res.json({
      message: "Estadísticas del cliente obtenidas",
      data: {
        customer,
        stats,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, update, remove, getStats };
