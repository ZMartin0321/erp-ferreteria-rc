-- Script inicial PostgreSQL para ERP Ferretería RC

-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'vendedor' CHECK (role IN ('admin','vendedor','comprador')),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE,
  barcode VARCHAR(100),
  description TEXT,
  brand VARCHAR(100),
  model VARCHAR(100),
  unit VARCHAR(20) DEFAULT 'pieza' CHECK (unit IN ('pieza','caja','paquete','metro','kilogramo','litro','galon','bulto','rollo','par','cubeta')),
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock DECIMAL(10,2) NOT NULL DEFAULT 0,
  "minStock" DECIMAL(10,2) NOT NULL DEFAULT 5,
  "maxStock" DECIMAL(10,2) NOT NULL DEFAULT 999999,
  location VARCHAR(100),
  "warrantyMonths" INT DEFAULT 0,
  "isActive" BOOLEAN DEFAULT TRUE,
  images JSONB,
  notes TEXT,
  "categoryId" INT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("categoryId") REFERENCES categories(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products("categoryId");

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  rfc VARCHAR(13),
  contact VARCHAR(255),
  phone VARCHAR(100),
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  "postalCode" VARCHAR(10),
  website VARCHAR(255),
  "paymentTerms" VARCHAR(100),
  "isActive" BOOLEAN DEFAULT TRUE,
  notes TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  rfc VARCHAR(13),
  email VARCHAR(255),
  phone VARCHAR(100),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  "postalCode" VARCHAR(10),
  "customerType" VARCHAR(20) DEFAULT 'individual' CHECK ("customerType" IN ('individual','business')),
  "isActive" BOOLEAN DEFAULT TRUE,
  notes TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- Purchases
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  "purchaseNumber" VARCHAR(50) UNIQUE,
  "supplierId" INT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','received','cancelled')),
  "paymentStatus" VARCHAR(20) DEFAULT 'pending' CHECK ("paymentStatus" IN ('pending','paid','partial')),
  "paymentMethod" VARCHAR(50),
  "deliveryDate" DATE,
  notes TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("supplierId") REFERENCES suppliers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_purchases_supplier ON purchases("supplierId");
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);

-- Purchase Items
CREATE TABLE IF NOT EXISTS "purchaseItems" (
  id SERIAL PRIMARY KEY,
  "purchaseId" INT NOT NULL,
  "productId" INT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  "unitPrice" DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("purchaseId") REFERENCES purchases(id) ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_purchaseItems_purchase ON "purchaseItems"("purchaseId");
CREATE INDEX IF NOT EXISTS idx_purchaseItems_product ON "purchaseItems"("productId");

-- Sales
CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  "saleNumber" VARCHAR(50) UNIQUE,
  "clientName" VARCHAR(255),
  "customerId" INT,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('draft','completed','cancelled')),
  "paymentStatus" VARCHAR(20) DEFAULT 'pending' CHECK ("paymentStatus" IN ('pending','paid','partial')),
  "paymentMethod" VARCHAR(50),
  notes TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("customerId") REFERENCES customers(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales("customerId");
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales("createdAt");

-- Sale Items
CREATE TABLE IF NOT EXISTS "saleItems" (
  id SERIAL PRIMARY KEY,
  "saleId" INT NOT NULL,
  "productId" INT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  "unitPrice" DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("saleId") REFERENCES sales(id) ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_saleItems_sale ON "saleItems"("saleId");
CREATE INDEX IF NOT EXISTS idx_saleItems_product ON "saleItems"("productId");

-- Inventory Movements
CREATE TABLE IF NOT EXISTS "inventoryMovements" (
  id SERIAL PRIMARY KEY,
  "productId" INT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('purchase','sale','adjustment','return','transfer')),
  quantity DECIMAL(10,2) NOT NULL,
  "previousStock" DECIMAL(10,2) NOT NULL,
  "newStock" DECIMAL(10,2) NOT NULL,
  "referenceId" INT,
  "referenceType" VARCHAR(50),
  reason TEXT,
  notes TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("productId") REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_inventoryMovements_product ON "inventoryMovements"("productId");
CREATE INDEX IF NOT EXISTS idx_inventoryMovements_type ON "inventoryMovements"(type);
CREATE INDEX IF NOT EXISTS idx_inventoryMovements_date ON "inventoryMovements"("createdAt");

-- Trigger para actualizar updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON purchases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchaseItems_updated_at BEFORE UPDATE ON "purchaseItems" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_saleItems_updated_at BEFORE UPDATE ON "saleItems" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventoryMovements_updated_at BEFORE UPDATE ON "inventoryMovements" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
