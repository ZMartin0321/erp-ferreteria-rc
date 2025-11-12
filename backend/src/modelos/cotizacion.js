module.exports = (sequelize, DataTypes) => {
  const Quotation = sequelize.define(
    "Quotation",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      quotationNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      customerId: { type: DataTypes.INTEGER, allowNull: true },
      clientName: { type: DataTypes.STRING, allowNull: false },
      subtotal: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      tax: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      total: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      validUntil: { type: DataTypes.DATEONLY, allowNull: true },
      status: {
        type: DataTypes.ENUM(
          "draft",
          "sent",
          "accepted",
          "rejected",
          "expired"
        ),
        defaultValue: "draft",
      },
      notes: { type: DataTypes.TEXT, allowNull: true },
      userId: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: "quotations",
      indexes: [{ fields: ["quotationNumber"] }, { fields: ["customerId"] }],
    }
  );

  return Quotation;
};
