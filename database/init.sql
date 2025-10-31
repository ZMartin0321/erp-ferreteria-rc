-- Script inicial para crear las tablas básicas

CREATE DATABASE IF NOT EXISTS `erp_ferreteria_rc`;
USE `erp_ferreteria_rc`;

-- Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin','vendedor','comprador') DEFAULT 'vendedor',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `sku` VARCHAR(100) UNIQUE,
  `barcode` VARCHAR(100),
  `description` TEXT,
  `brand` VARCHAR(100),
  `model` VARCHAR(100),
  `unit` ENUM('pieza','caja','paquete','metro','kilogramo','litro','galon','bulto','rollo','par','cubeta') DEFAULT 'pieza',
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `cost` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `stock` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `minStock` DECIMAL(10,2) NOT NULL DEFAULT 5,
  `maxStock` DECIMAL(10,2) NOT NULL DEFAULT 999999,
  `location` VARCHAR(100),
  `warrantyMonths` INT DEFAULT 0,
  `isActive` BOOLEAN DEFAULT TRUE,
  `images` JSON,
  `notes` TEXT,
  `categoryId` INT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_sku (sku),
  INDEX idx_barcode (barcode),
  INDEX idx_name (name),
  INDEX idx_category (categoryId)
);

-- Suppliers
CREATE TABLE IF NOT EXISTS `suppliers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `rfc` VARCHAR(13),
  `contact` VARCHAR(255),
  `phone` VARCHAR(100),
  `email` VARCHAR(255),
  `address` TEXT,
  `city` VARCHAR(100),
  `state` VARCHAR(100),
  `postalCode` VARCHAR(10),
  `website` VARCHAR(255),
  `paymentTerms` VARCHAR(100),
  `isActive` BOOLEAN DEFAULT TRUE,
  `notes` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Customers (Clientes)
CREATE TABLE IF NOT EXISTS `customers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `rfc` VARCHAR(13),
  `email` VARCHAR(255),
  `phone` VARCHAR(100),
  `address` TEXT,
  `city` VARCHAR(100),
  `state` VARCHAR(100),
  `postalCode` VARCHAR(10),
  `customerType` ENUM('individual','business') DEFAULT 'individual',
  `creditLimit` DECIMAL(10,2) DEFAULT 0,
  `creditDays` INT DEFAULT 0,
  `isActive` BOOLEAN DEFAULT TRUE,
  `notes` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_phone (phone)
);

-- Purchases
CREATE TABLE IF NOT EXISTS `purchases` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `purchaseNumber` VARCHAR(50) UNIQUE,
  `supplierId` INT NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `tax` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `discount` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `total` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `paymentMethod` ENUM('cash','card','transfer','credit','check') DEFAULT 'cash',
  `paymentStatus` ENUM('pending','partial','paid','cancelled') DEFAULT 'pending',
  `status` ENUM('pending','received','cancelled') DEFAULT 'pending',
  `expectedDate` DATE,
  `receivedDate` DATETIME,
  `notes` TEXT,
  `userId` INT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplierId) REFERENCES suppliers(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_purchase_number (purchaseNumber),
  INDEX idx_supplier (supplierId),
  INDEX idx_date (createdAt)
);

-- Sales
CREATE TABLE IF NOT EXISTS `sales` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoiceNumber` VARCHAR(50) UNIQUE,
  `customerId` INT,
  `clientName` VARCHAR(255) NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `tax` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `discount` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `total` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `paymentMethod` ENUM('cash','card','transfer','credit','check') DEFAULT 'cash',
  `paymentStatus` ENUM('pending','partial','paid','cancelled') DEFAULT 'pending',
  `status` ENUM('draft','completed','cancelled') DEFAULT 'draft',
  `notes` TEXT,
  `userId` INT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_invoice (invoiceNumber),
  INDEX idx_customer (customerId),
  INDEX idx_date (createdAt)
);

-- Purchase Items
CREATE TABLE IF NOT EXISTS `purchase_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `purchaseId` INT NOT NULL,
  `productId` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unitPrice` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (purchaseId) REFERENCES purchases(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- Sale Items
CREATE TABLE IF NOT EXISTS `sale_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `saleId` INT NOT NULL,
  `productId` INT NOT NULL,
  `productName` VARCHAR(255),
  `quantity` DECIMAL(10,2) NOT NULL DEFAULT 1,
  `unitPrice` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `discount` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `tax` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (saleId) REFERENCES sales(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- Inventory Movements (Movimientos de Inventario)
CREATE TABLE IF NOT EXISTS `inventory_movements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `productId` INT NOT NULL,
  `type` ENUM('entry','exit','adjustment','return','transfer') NOT NULL,
  `quantity` DECIMAL(10,2) NOT NULL,
  `previousStock` DECIMAL(10,2) NOT NULL,
  `newStock` DECIMAL(10,2) NOT NULL,
  `reason` VARCHAR(255),
  `referenceType` ENUM('sale','purchase','adjustment','return') NULL,
  `referenceId` INT NULL,
  `notes` TEXT,
  `userId` INT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_product (productId),
  INDEX idx_type (type),
  INDEX idx_date (createdAt)
);

-- Price History (Historial de Precios)
CREATE TABLE IF NOT EXISTS `price_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `productId` INT NOT NULL,
  `oldPrice` DECIMAL(10,2) NOT NULL,
  `newPrice` DECIMAL(10,2) NOT NULL,
  `oldCost` DECIMAL(10,2) NOT NULL,
  `newCost` DECIMAL(10,2) NOT NULL,
  `reason` VARCHAR(255),
  `userId` INT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_product (productId),
  INDEX idx_date (createdAt)
);

-- Quotations (Cotizaciones)
CREATE TABLE IF NOT EXISTS `quotations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `quotationNumber` VARCHAR(50) UNIQUE NOT NULL,
  `customerId` INT,
  `clientName` VARCHAR(255) NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `tax` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `discount` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `total` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `validUntil` DATE,
  `status` ENUM('draft','sent','accepted','rejected','expired') DEFAULT 'draft',
  `notes` TEXT,
  `userId` INT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_quotation_number (quotationNumber),
  INDEX idx_customer (customerId)
);

-- Quotation Items
CREATE TABLE IF NOT EXISTS `quotation_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `quotationId` INT NOT NULL,
  `productId` INT NOT NULL,
  `productName` VARCHAR(255),
  `quantity` DECIMAL(10,2) NOT NULL DEFAULT 1,
  `unitPrice` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `discount` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `tax` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (quotationId) REFERENCES quotations(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- Payment Records (Registro de Pagos)
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `referenceType` ENUM('sale','purchase') NOT NULL,
  `referenceId` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `paymentMethod` ENUM('cash','card','transfer','check','other') NOT NULL,
  `paymentDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reference` VARCHAR(100),
  `notes` TEXT,
  `userId` INT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_reference (referenceType, referenceId),
  INDEX idx_date (paymentDate)
);

-- Expenses (Gastos)
CREATE TABLE IF NOT EXISTS `expenses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `expenseDate` DATE NOT NULL,
  `paymentMethod` ENUM('cash','card','transfer','check') DEFAULT 'cash',
  `invoiceNumber` VARCHAR(50),
  `notes` TEXT,
  `userId` INT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_category (category),
  INDEX idx_date (expenseDate)
);
