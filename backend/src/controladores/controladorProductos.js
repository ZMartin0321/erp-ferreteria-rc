const { Product, Category } = require("../modelos");
const { Op } = require("sequelize");

/**
 * Obtiene todos los productos con sus categorías
 * @route GET /api/products
 */
const list = async (req, res, next) => {
  try {
    const { search, categoryId, minStock, maxStock } = req.query;
    const where = {};

    // Filtro por búsqueda
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
      ];
    }

    // Filtro por categoría
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Filtro por stock
    if (minStock !== undefined) {
      where.stock = { ...where.stock, [Op.gte]: parseFloat(minStock) };
    }
    if (maxStock !== undefined) {
      where.stock = { ...where.stock, [Op.lte]: parseFloat(maxStock) };
    }

    const products = await Product.findAll({
      where,
      include: [{ model: Category, as: "category" }],
      order: [["name", "ASC"]],
    });

    res.json({
      message: "Productos obtenidos exitosamente",
      count: products.length,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Obtiene un producto por ID
 * @route GET /api/products/:id
 */
const getById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: "category" }],
    });

    if (!product) {
      return res.status(404).json({
        error: "Producto no encontrado",
        message: `No existe un producto con el ID ${req.params.id}`,
      });
    }

    res.json({
      message: "Producto obtenido exitosamente",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Crea un nuevo producto
 * @route POST /api/products
 */
const create = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    const productWithCategory = await Product.findByPk(product.id, {
      include: [{ model: Category, as: "category" }],
    });

    res.status(201).json({
      message: "Producto creado exitosamente",
      data: productWithCategory,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Actualiza un producto existente
 * @route PUT /api/products/:id
 */
const update = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "Producto no encontrado",
        message: `No existe un producto con el ID ${req.params.id}`,
      });
    }

    await product.update(req.body);

    const updated = await Product.findByPk(product.id, {
      include: [{ model: Category, as: "category" }],
    });

    res.json({
      message: "Producto actualizado exitosamente",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Elimina un producto
 * @route DELETE /api/products/:id
 */
const remove = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "Producto no encontrado",
        message: `No existe un producto con el ID ${req.params.id}`,
      });
    }

    await product.destroy();

    res.json({
      message: "Producto eliminado exitosamente",
      data: { id: req.params.id },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Obtiene productos con bajo stock
 * @route GET /api/products/low-stock
 */
const getLowStock = async (req, res, next) => {
  try {
    const threshold = parseFloat(req.query.threshold) || 10;

    const products = await Product.findAll({
      where: {
        stock: { [Op.lte]: threshold },
      },
      include: [{ model: Category, as: "category" }],
      order: [["stock", "ASC"]],
    });

    res.json({
      message: "Productos con bajo stock obtenidos exitosamente",
      threshold,
      count: products.length,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, update, remove, getLowStock };
