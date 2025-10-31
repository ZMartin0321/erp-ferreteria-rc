module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      sku: { type: DataTypes.STRING, allowNull: true, unique: true },
      barcode: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      brand: { type: DataTypes.STRING, allowNull: true },
      model: { type: DataTypes.STRING, allowNull: true },
      unit: {
        type: DataTypes.ENUM(
          "pieza",
          "caja",
          "paquete",
          "metro",
          "kilogramo",
          "litro",
          "galon",
          "bulto",
          "rollo",
          "par"
        ),
        defaultValue: "pieza",
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      stock: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      minStock: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 5,
      },
      maxStock: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 999999,
      },
      location: { type: DataTypes.STRING, allowNull: true }, // Ubicación en bodega
      warrantyMonths: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      images: { type: DataTypes.JSON, allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      tableName: "products",
      indexes: [
        { fields: ["sku"] },
        { fields: ["barcode"] },
        { fields: ["name"] },
        { fields: ["categoryId"] },
      ],
    }
  );

  return Product;
};
