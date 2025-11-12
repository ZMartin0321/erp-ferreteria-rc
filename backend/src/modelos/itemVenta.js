module.exports = (sequelize, DataTypes) => {
  const SaleItem = sequelize.define(
    "SaleItem",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      saleId: { type: DataTypes.INTEGER, allowNull: false },
      productId: { type: DataTypes.INTEGER, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      tax: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    { tableName: "sale_items" }
  );

  return SaleItem;
};
