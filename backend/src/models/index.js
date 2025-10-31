const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.User = require("./user")(sequelize, Sequelize);
db.Category = require("./category")(sequelize, Sequelize);
db.Product = require("./product")(sequelize, Sequelize);
db.Supplier = require("./supplier")(sequelize, Sequelize);
db.Customer = require("./customer")(sequelize, Sequelize);
db.Purchase = require("./purchase")(sequelize, Sequelize);
db.Sale = require("./sale")(sequelize, Sequelize);
db.PurchaseItem = require("./purchaseItem")(sequelize, Sequelize);
db.SaleItem = require("./saleItem")(sequelize, Sequelize);
db.InventoryMovement = require("./inventoryMovement")(sequelize, Sequelize);
db.Quotation = require("./quotation")(sequelize, Sequelize);
db.QuotationItem = require("./quotationItem")(sequelize, Sequelize);

// ============ ASSOCIATIONS ============

// Category - Product
db.Category.hasMany(db.Product, { foreignKey: "categoryId", as: "products" });
db.Product.belongsTo(db.Category, { foreignKey: "categoryId", as: "category" });

// Supplier - Purchase
db.Supplier.hasMany(db.Purchase, { foreignKey: "supplierId", as: "purchases" });
db.Purchase.belongsTo(db.Supplier, {
  foreignKey: "supplierId",
  as: "supplier",
});

// Customer - Sale
db.Customer.hasMany(db.Sale, { foreignKey: "customerId", as: "sales" });
db.Sale.belongsTo(db.Customer, { foreignKey: "customerId", as: "customer" });

// Customer - Quotation
db.Customer.hasMany(db.Quotation, {
  foreignKey: "customerId",
  as: "quotations",
});
db.Quotation.belongsTo(db.Customer, {
  foreignKey: "customerId",
  as: "customer",
});

// User - Sales
db.User.hasMany(db.Sale, { foreignKey: "userId", as: "sales" });
db.Sale.belongsTo(db.User, { foreignKey: "userId", as: "user" });

// User - Purchases
db.User.hasMany(db.Purchase, { foreignKey: "userId", as: "purchases" });
db.Purchase.belongsTo(db.User, { foreignKey: "userId", as: "user" });

// User - Quotations
db.User.hasMany(db.Quotation, { foreignKey: "userId", as: "quotations" });
db.Quotation.belongsTo(db.User, { foreignKey: "userId", as: "user" });

// Purchase - PurchaseItem - Product
db.Purchase.hasMany(db.PurchaseItem, { foreignKey: "purchaseId", as: "items" });
db.PurchaseItem.belongsTo(db.Purchase, {
  foreignKey: "purchaseId",
  as: "purchase",
});
db.Product.hasMany(db.PurchaseItem, {
  foreignKey: "productId",
  as: "purchaseItems",
});
db.PurchaseItem.belongsTo(db.Product, {
  foreignKey: "productId",
  as: "product",
});

// Sale - SaleItem - Product
db.Sale.hasMany(db.SaleItem, { foreignKey: "saleId", as: "items" });
db.SaleItem.belongsTo(db.Sale, { foreignKey: "saleId", as: "sale" });
db.Product.hasMany(db.SaleItem, { foreignKey: "productId", as: "saleItems" });
db.SaleItem.belongsTo(db.Product, { foreignKey: "productId", as: "product" });

// Quotation - QuotationItem - Product
db.Quotation.hasMany(db.QuotationItem, {
  foreignKey: "quotationId",
  as: "items",
});
db.QuotationItem.belongsTo(db.Quotation, {
  foreignKey: "quotationId",
  as: "quotation",
});
db.Product.hasMany(db.QuotationItem, {
  foreignKey: "productId",
  as: "quotationItems",
});
db.QuotationItem.belongsTo(db.Product, {
  foreignKey: "productId",
  as: "product",
});

// Product - InventoryMovement
db.Product.hasMany(db.InventoryMovement, {
  foreignKey: "productId",
  as: "movements",
});
db.InventoryMovement.belongsTo(db.Product, {
  foreignKey: "productId",
  as: "product",
});

// User - InventoryMovement
db.User.hasMany(db.InventoryMovement, {
  foreignKey: "userId",
  as: "inventoryMovements",
});
db.InventoryMovement.belongsTo(db.User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = db;
