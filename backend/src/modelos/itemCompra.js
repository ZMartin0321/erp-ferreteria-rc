module.exports = (sequelize, DataTypes) => {
  const PurchaseItem = sequelize.define(
    "PurchaseItem",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      purchaseId: { type: DataTypes.INTEGER, allowNull: false },
      productId: { type: DataTypes.INTEGER, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    { tableName: "purchase_items" }
  );

  return PurchaseItem;
};
