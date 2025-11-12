module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      rfc: { type: DataTypes.STRING(13), allowNull: true },
      email: { type: DataTypes.STRING, allowNull: true },
      phone: { type: DataTypes.STRING(100), allowNull: true },
      address: { type: DataTypes.TEXT, allowNull: true },
      city: { type: DataTypes.STRING(100), allowNull: true },
      state: { type: DataTypes.STRING(100), allowNull: true },
      postalCode: { type: DataTypes.STRING(10), allowNull: true },
      customerType: {
        type: DataTypes.ENUM("individual", "business"),
        defaultValue: "individual",
      },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      tableName: "customers",
      indexes: [{ fields: ["name"] }, { fields: ["phone"] }],
    }
  );

  return Customer;
};
