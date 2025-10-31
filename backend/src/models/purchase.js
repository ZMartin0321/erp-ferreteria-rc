module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define(
    "Purchase",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      purchaseNumber: { type: DataTypes.STRING(50), unique: true },
      supplierId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: true },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      tax: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      paymentMethod: {
        type: DataTypes.ENUM("cash", "card", "transfer", "credit", "check"),
        defaultValue: "transfer",
      },
      paymentStatus: {
        type: DataTypes.ENUM("pending", "partial", "paid", "cancelled"),
        defaultValue: "pending",
      },
      status: {
        type: DataTypes.ENUM("draft", "pending", "received", "cancelled"),
        defaultValue: "pending",
      },
      notes: { type: DataTypes.TEXT, allowNull: true },
    },
    { tableName: "purchases" }
  );

  return Purchase;
};
