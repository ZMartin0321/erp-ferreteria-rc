module.exports = (sequelize, DataTypes) => {
  const InventoryMovement = sequelize.define(
    "InventoryMovement",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      productId: { type: DataTypes.INTEGER, allowNull: false },
      type: {
        type: DataTypes.ENUM(
          "entry",
          "exit",
          "adjustment",
          "return",
          "transfer"
        ),
        allowNull: false,
      },
      quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      previousStock: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      newStock: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      reason: { type: DataTypes.STRING, allowNull: true },
      referenceType: {
        type: DataTypes.ENUM("sale", "purchase", "adjustment", "return"),
        allowNull: true,
      },
      referenceId: { type: DataTypes.INTEGER, allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      userId: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: "inventory_movements",
      updatedAt: false,
      indexes: [
        { fields: ["productId"] },
        { fields: ["type"] },
        { fields: ["createdAt"] },
      ],
    }
  );

  return InventoryMovement;
};
