module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define(
    "Supplier",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      contact: { type: DataTypes.STRING, allowNull: true },
      phone: { type: DataTypes.STRING, allowNull: true },
      email: { type: DataTypes.STRING, allowNull: true },
    },
    { tableName: "suppliers" }
  );

  return Supplier;
};
