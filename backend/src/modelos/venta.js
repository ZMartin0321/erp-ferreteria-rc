module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define(
    "Sale",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      invoiceNumber: { type: DataTypes.STRING(50), unique: true },
      customerId: { type: DataTypes.INTEGER, allowNull: true },
      clientName: { type: DataTypes.STRING, allowNull: false },
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
        defaultValue: "cash",
      },
      paymentStatus: {
        type: DataTypes.ENUM("pending", "partial", "paid", "cancelled"),
        defaultValue: "pending",
      },
      status: {
        type: DataTypes.ENUM("draft", "completed", "cancelled"),
        defaultValue: "draft",
      },
      notes: { type: DataTypes.TEXT, allowNull: true },
      userId: { type: DataTypes.INTEGER, allowNull: true },
    },
    { tableName: "sales" }
  );

  return Sale;
};
