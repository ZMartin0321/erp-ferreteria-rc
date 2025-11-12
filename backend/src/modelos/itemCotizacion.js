module.exports = (sequelize, DataTypes) => {
  const QuotationItem = sequelize.define(
    "QuotationItem",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      quotationId: { type: DataTypes.INTEGER, allowNull: false },
      productId: { type: DataTypes.INTEGER, allowNull: false },
      productName: { type: DataTypes.STRING, allowNull: true },
      quantity: { type: DataTypes.DECIMAL(10, 2), defaultValue: 1 },
      unitPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      tax: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      subtotal: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    },
    {
      tableName: "quotation_items",
    }
  );

  return QuotationItem;
};
