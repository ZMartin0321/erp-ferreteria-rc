const { Product } = require("../modelos");

/**
 * Actualiza el stock de un producto
 */
const updateStock = async (productId, quantity) => {
  const product = await Product.findByPk(productId);
  if (!product) throw new Error("Producto no encontrado");

  product.stock += quantity;
  await product.save();
  return product;
};

/**
 * Verifica si hay stock disponible
 */
const checkStock = async (productId, quantity) => {
  const product = await Product.findByPk(productId);
  if (!product) throw new Error("Producto no encontrado");
  return product.stock >= quantity;
};

/**
 * Obtiene alertas de productos con stock bajo
 */
const getLowStockAlerts = async () => {
  const products = await Product.findAll({
    where: sequelize.where(
      sequelize.col("stock"),
      "<=",
      sequelize.col("minStock")
    ),
  });
  return products;
};

module.exports = {
  updateStock,
  checkStock,
  getLowStockAlerts,
};
