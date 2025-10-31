-- Insertar datos de ejemplo para ventas y compras

-- Ventas de ejemplo
INSERT INTO sales (saleNumber, clientName, customerId, userId, status, paymentStatus, paymentMethod, subtotal, tax, discount, total, notes, createdAt, updatedAt)
VALUES
('SALE-2025-00001', 'Juan Pérez García', NULL, 1, 'completed', 'paid', 'cash', 1500.00, 240.00, 0, 1740.00, 'Venta de contado', NOW(), NOW()),
('SALE-2025-00002', 'Constructora ABC S.A.', NULL, 1, 'completed', 'paid', 'card', 3500.00, 560.00, 50, 4010.00, 'Venta con tarjeta', NOW(), NOW()),
('SALE-2025-00003', 'María González López', NULL, 1, 'completed', 'pending', 'credit', 2200.00, 352.00, 0, 2552.00, 'Venta a crédito', NOW(), NOW()),
('SALE-2025-00004', 'Cliente Mostrador', NULL, 1, 'completed', 'paid', 'cash', 850.00, 136.00, 0, 986.00, 'Venta mostrador', NOW(), NOW()),
('SALE-2025-00005', 'Roberto Martínez', NULL, 1, 'pending', 'pending', 'transfer', 4200.00, 672.00, 0, 4872.00, 'Venta pendiente', NOW(), NOW());

-- Items de ventas (usando productos existentes)
INSERT INTO sale_items (saleId, productId, quantity, unitPrice, subtotal, discount, tax, total, createdAt, updatedAt)
SELECT 
  (SELECT id FROM sales WHERE saleNumber = 'SALE-2025-00001'), 
  id, 
  3, 
  price, 
  price * 3, 
  0, 
  price * 3 * 0.16, 
  price * 3 * 1.16,
  NOW(),
  NOW()
FROM products LIMIT 1;

INSERT INTO sale_items (saleId, productId, quantity, unitPrice, subtotal, discount, tax, total, createdAt, updatedAt)
SELECT 
  (SELECT id FROM sales WHERE saleNumber = 'SALE-2025-00002'), 
  id, 
  5, 
  price, 
  price * 5, 
  0, 
  price * 5 * 0.16, 
  price * 5 * 1.16,
  NOW(),
  NOW()
FROM products LIMIT 1 OFFSET 1;

INSERT INTO sale_items (saleId, productId, quantity, unitPrice, subtotal, discount, tax, total, createdAt, updatedAt)
SELECT 
  (SELECT id FROM sales WHERE saleNumber = 'SALE-2025-00003'), 
  id, 
  2, 
  price, 
  price * 2, 
  0, 
  price * 2 * 0.16, 
  price * 2 * 1.16,
  NOW(),
  NOW()
FROM products LIMIT 1 OFFSET 2;

-- Compras de ejemplo
INSERT INTO purchases (purchaseNumber, supplierId, userId, status, paymentStatus, paymentMethod, subtotal, tax, discount, total, notes, createdAt, updatedAt)
VALUES
('PURCH-2025-00001', 1, 1, 'received', 'paid', 'transfer', 5000.00, 800.00, 0, 5800.00, 'Compra recibida', NOW(), NOW()),
('PURCH-2025-00002', 2, 1, 'received', 'paid', 'cash', 3200.00, 512.00, 100, 3612.00, 'Compra con descuento', NOW(), NOW()),
('PURCH-2025-00003', 1, 1, 'pending', 'pending', 'credit', 7500.00, 1200.00, 0, 8700.00, 'Compra pendiente', NOW(), NOW()),
('PURCH-2025-00004', 2, 1, 'ordered', 'pending', 'transfer', 4100.00, 656.00, 0, 4756.00, 'Orden de compra', NOW(), NOW());

-- Items de compras
INSERT INTO purchase_items (purchaseId, productId, quantity, unitPrice, subtotal, discount, tax, total, createdAt, updatedAt)
SELECT 
  (SELECT id FROM purchases WHERE purchaseNumber = 'PURCH-2025-00001'), 
  id, 
  10, 
  COALESCE(cost, price * 0.6), 
  COALESCE(cost, price * 0.6) * 10, 
  0, 
  COALESCE(cost, price * 0.6) * 10 * 0.16, 
  COALESCE(cost, price * 0.6) * 10 * 1.16,
  NOW(),
  NOW()
FROM products LIMIT 1;

INSERT INTO purchase_items (purchaseId, productId, quantity, unitPrice, subtotal, discount, tax, total, createdAt, updatedAt)
SELECT 
  (SELECT id FROM purchases WHERE purchaseNumber = 'PURCH-2025-00002'), 
  id, 
  15, 
  COALESCE(cost, price * 0.6), 
  COALESCE(cost, price * 0.6) * 15, 
  0, 
  COALESCE(cost, price * 0.6) * 15 * 0.16, 
  COALESCE(cost, price * 0.6) * 15 * 1.16,
  NOW(),
  NOW()
FROM products LIMIT 1 OFFSET 1;

SELECT 'Datos de ejemplo creados exitosamente' AS resultado;
SELECT COUNT(*) AS total_ventas FROM sales;
SELECT COUNT(*) AS total_compras FROM purchases;
