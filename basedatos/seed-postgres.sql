-- Script para poblar la base de datos PostgreSQL con datos realistas de ferretería

-- ============================================
-- CATEGORÍAS DE FERRETERÍA
-- ============================================
INSERT INTO categories (name) VALUES
('Herramientas Manuales'),
('Herramientas Eléctricas'),
('Materiales de Construcción'),
('Plomería'),
('Electricidad'),
('Pintura y Accesorios'),
('Cerrajería'),
('Ferretería General'),
('Jardinería'),
('Seguridad Industrial')
ON CONFLICT DO NOTHING;

-- ============================================
-- PROVEEDORES
-- ============================================
INSERT INTO suppliers (name, rfc, contact, phone, email, address, city, state, "paymentTerms", "isActive") VALUES
('Distribuidora TRUPER S.A.', 'TRU850101ABC', 'Juan Pérez', '5555-1234', 'ventas@truper.com', 'Av. Industrial 123', 'CDMX', 'Ciudad de México', '30 días', TRUE),
('DEWALT de México', 'DEW900202XYZ', 'María González', '5555-5678', 'contacto@dewalt.mx', 'Blvd. Manufactura 456', 'Monterrey', 'Nuevo León', '15 días', TRUE),
('Ferretería Nacional S.A.', 'FNA910303HIJ', 'Carlos Ramírez', '5555-9012', 'info@ferrnacional.com', 'Calle Principal 789', 'Guadalajara', 'Jalisco', '45 días', TRUE),
('Pinturas Comex', 'COM850404KLM', 'Ana Martínez', '5555-3456', 'ventas@comex.com.mx', 'Av. de las Américas 321', 'Querétaro', 'Querétaro', '30 días', TRUE),
('Cementos Cruz Azul', 'CCA750505NOP', 'Roberto López', '5555-7890', 'contacto@cruzazul.com.mx', 'Industrial Norte 654', 'Hidalgo', 'Hidalgo', '60 días', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================
-- CLIENTES
-- ============================================
INSERT INTO customers (name, email, phone, address, city, state, "customerType", "isActive") VALUES
('Constructora del Valle S.A.', 'compras@constrvalle.com', '5555-1111', 'Av. Constructores 100', 'CDMX', 'Ciudad de México', 'business', TRUE),
('José Luis García', 'jlgarcia@email.com', '5555-2222', 'Calle Reforma 234', 'CDMX', 'Ciudad de México', 'individual', TRUE),
('Desarrollos Inmobiliarios GC', 'admon@desagc.com', '5555-3333', 'Paseo de la República 567', 'Zapopan', 'Jalisco', 'business', TRUE),
('María Fernanda Rodríguez', 'mfrodriguez@email.com', '5555-4444', 'Col. Centro 890', 'Puebla', 'Puebla', 'individual', TRUE),
('Mantenimiento y Servicios MX', 'contacto@mserviciosmx.com', '5555-5555', 'Zona Industrial 432', 'Toluca', 'Estado de México', 'business', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================
-- PRODUCTOS DE FERRETERÍA
-- ============================================

-- Obtener IDs de categorías para referencias
DO $$
DECLARE
  cat1_id INT;
  cat2_id INT;
  cat3_id INT;
  cat4_id INT;
  cat5_id INT;
  cat6_id INT;
  cat7_id INT;
  cat8_id INT;
BEGIN
  SELECT id INTO cat1_id FROM categories WHERE name = 'Herramientas Manuales';
  SELECT id INTO cat2_id FROM categories WHERE name = 'Herramientas Eléctricas';
  SELECT id INTO cat3_id FROM categories WHERE name = 'Materiales de Construcción';
  SELECT id INTO cat4_id FROM categories WHERE name = 'Plomería';
  SELECT id INTO cat5_id FROM categories WHERE name = 'Electricidad';
  SELECT id INTO cat6_id FROM categories WHERE name = 'Pintura y Accesorios';
  SELECT id INTO cat7_id FROM categories WHERE name = 'Cerrajería';
  SELECT id INTO cat8_id FROM categories WHERE name = 'Ferretería General';

  -- Herramientas Manuales
  INSERT INTO products (name, sku, barcode, description, brand, model, unit, price, cost, stock, "minStock", "maxStock", location, "warrantyMonths", "categoryId", images, "isActive") VALUES
  ('Martillo de Carpintero 16 oz', 'MART-001', '7501234560001', 'Martillo con mango de fibra de vidrio', 'Truper', 'MC-16', 'pieza', 185.00, 120.00, 45, 10, 100, 'A-01-1', 12, cat1_id, '["https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800"]'::jsonb, TRUE),
  ('Juego de Desarmadores 6 Piezas', 'DESA-002', '7501234560002', 'Juego de desarmadores planos y de cruz', 'Truper', 'JD-6', 'caja', 245.00, 160.00, 30, 8, 80, 'A-01-2', 12, cat1_id, '["https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800"]'::jsonb, TRUE),
  ('Pinzas de Presión 10"', 'PINZ-003', '7501234560003', 'Pinzas de presión con mordazas curvas', 'Truper', 'PP-10', 'pieza', 195.00, 125.00, 25, 5, 50, 'A-01-3', 12, cat1_id, '["https://images.unsplash.com/photo-1565130838609-c3a86655db61?w=800"]'::jsonb, TRUE),
  ('Nivel de Aluminio 24"', 'NIVE-004', '7501234560004', 'Nivel profesional de aluminio', 'Truper', 'NA-24', 'pieza', 385.00, 250.00, 20, 5, 40, 'A-01-4', 12, cat1_id, '["https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800"]'::jsonb, TRUE),
  ('Flexómetro 5m', 'FLEX-005', '7501234560005', 'Flexómetro con cinta métrica', 'Truper', 'FM-5', 'pieza', 125.00, 80.00, 60, 15, 120, 'A-01-5', 6, cat1_id, '["https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800"]'::jsonb, TRUE),
  ('Llave Stillson 14"', 'LLAV-006', '7501234560006', 'Llave para tubo stillson', 'Truper', 'LS-14', 'pieza', 425.00, 275.00, 15, 3, 30, 'A-01-6', 12, cat1_id, '["https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800"]'::jsonb, TRUE),
  ('Arco Sierra con Seguetas', 'ARCO-007', '7501234560007', 'Arco para sierra con 3 seguetas', 'Truper', 'AS-12', 'pieza', 165.00, 105.00, 35, 8, 70, 'A-01-7', 6, cat1_id, '["https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800"]'::jsonb, TRUE)
  ON CONFLICT (sku) DO NOTHING;

  -- Herramientas Eléctricas
  INSERT INTO products (name, sku, barcode, description, brand, model, unit, price, cost, stock, "minStock", "maxStock", location, "warrantyMonths", "categoryId", images, "isActive") VALUES
  ('Taladro Percutor 1/2" 800W', 'TALA-008', '7501234560008', 'Taladro percutor con velocidad variable', 'DeWalt', 'DW505K', 'pieza', 2450.00, 1600.00, 12, 3, 25, 'A-02-1', 24, cat2_id, '["https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800"]'::jsonb, TRUE),
  ('Esmeril Angular 4 1/2" 900W', 'ESME-009', '7501234560009', 'Esmeril angular profesional', 'DeWalt', 'DWE402', 'pieza', 1895.00, 1235.00, 15, 3, 30, 'A-02-2', 24, cat2_id, '["https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800"]'::jsonb, TRUE),
  ('Sierra Circular 7 1/4" 1800W', 'SIER-010', '7501234560010', 'Sierra circular con guía láser', 'DeWalt', 'DWE575', 'pieza', 3250.00, 2120.00, 8, 2, 20, 'A-02-3', 24, cat2_id, '["https://images.unsplash.com/photo-1590015852395-e2e365c49c72?w=800"]'::jsonb, TRUE),
  ('Lijadora Orbital 280W', 'LIJA-011', '7501234560011', 'Lijadora orbital con recolector de polvo', 'DeWalt', 'DWE6421', 'pieza', 1650.00, 1075.00, 10, 2, 20, 'A-02-4', 24, cat2_id, '["https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800"]'::jsonb, TRUE),
  ('Rotomartillo 3/4" 850W', 'ROTO-012', '7501234560012', 'Rotomartillo con 3 funciones', 'DeWalt', 'D25113K', 'pieza', 2850.00, 1850.00, 6, 2, 15, 'A-02-5', 24, cat2_id, '["https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800"]'::jsonb, TRUE)
  ON CONFLICT (sku) DO NOTHING;

  -- Materiales de Construcción
  INSERT INTO products (name, sku, barcode, description, brand, model, unit, price, cost, stock, "minStock", "maxStock", location, "warrantyMonths", "categoryId", images, "isActive") VALUES
  ('Cemento Gris 50kg', 'CEME-013', '7501234560013', 'Cemento Portland CPC 30R', 'Cruz Azul', 'CPC30R', 'bulto', 185.00, 145.00, 200, 50, 500, 'B-01-1', 0, cat3_id, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]'::jsonb, TRUE),
  ('Varilla Corrugada 3/8" 6m', 'VARI-014', '7501234560014', 'Varilla de acero corrugado', 'Deacero', 'VC-38', 'pieza', 95.00, 65.00, 150, 30, 300, 'B-01-2', 0, cat3_id, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]'::jsonb, TRUE),
  ('Varilla Corrugada 1/2" 6m', 'VARI-015', '7501234560015', 'Varilla de acero corrugado', 'Deacero', 'VC-12', 'pieza', 165.00, 115.00, 120, 25, 250, 'B-01-3', 0, cat3_id, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]'::jsonb, TRUE),
  ('Block de Concreto 15x20x40cm', 'BLOC-016', '7501234560016', 'Block hueco de concreto', 'Nacional', 'BH-15', 'pieza', 18.50, 12.00, 500, 100, 1000, 'B-02-1', 0, cat3_id, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]'::jsonb, TRUE),
  ('Arena Fina m³', 'AREN-017', '7501234560017', 'Arena fina para mortero', 'Local', 'AF-M3', 'metro', 450.00, 320.00, 25, 5, 50, 'B-03-1', 0, cat3_id, '["https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800"]'::jsonb, TRUE),
  ('Grava 3/4" m³', 'GRAV-018', '7501234560018', 'Grava triturada para concreto', 'Local', 'GR-34-M3', 'metro', 385.00, 275.00, 30, 8, 60, 'B-03-2', 0, cat3_id, '["https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800"]'::jsonb, TRUE)
  ON CONFLICT (sku) DO NOTHING;

  -- Plomería
  INSERT INTO products (name, sku, barcode, description, brand, model, unit, price, cost, stock, "minStock", "maxStock", location, "warrantyMonths", "categoryId", images, "isActive") VALUES
  ('Llave de Nariz 1/2"', 'LLAV-019', '7501234560019', 'Llave de nariz cromada', 'Helvex', 'LN-12', 'pieza', 285.00, 185.00, 35, 8, 70, 'C-01-1', 12, cat4_id, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]'::jsonb, TRUE),
  ('Tubo PVC Hidráulico 1/2" 6m', 'TUBP-020', '7501234560020', 'Tubo de PVC cédula 40', 'Pavco', 'PVC-12-6', 'pieza', 145.00, 95.00, 80, 20, 150, 'C-01-2', 0, cat4_id, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]'::jsonb, TRUE),
  ('Tubo PVC Hidráulico 3/4" 6m', 'TUBP-021', '7501234560021', 'Tubo de PVC cédula 40', 'Pavco', 'PVC-34-6', 'pieza', 185.00, 125.00, 65, 15, 130, 'C-01-3', 0, cat4_id, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]'::jsonb, TRUE),
  ('Codo PVC 90° 1/2"', 'CODP-022', '7501234560022', 'Codo de PVC hidráulico', 'Pavco', 'C90-12', 'pieza', 12.50, 8.00, 200, 50, 400, 'C-02-1', 0, cat4_id, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]'::jsonb, TRUE),
  ('Tinaco 1100L', 'TINA-025', '7501234560025', 'Tinaco de polietileno', 'Rotoplas', 'TP-1100', 'pieza', 2850.00, 1950.00, 8, 2, 15, 'C-04-1', 60, cat4_id, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]'::jsonb, TRUE)
  ON CONFLICT (sku) DO NOTHING;

  -- Electricidad
  INSERT INTO products (name, sku, barcode, description, brand, model, unit, price, cost, stock, "minStock", "maxStock", location, "warrantyMonths", "categoryId", images, "isActive") VALUES
  ('Cable THW Cal. 12 AWG', 'CABL-026', '7501234560026', 'Cable de cobre calibre 12', 'Condumex', 'THW-12', 'metro', 24.50, 16.00, 500, 100, 1000, 'D-01-1', 12, cat5_id, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]'::jsonb, TRUE),
  ('Apagador Sencillo', 'APAG-028', '7501234560028', 'Apagador sencillo 15A', 'Volteck', 'AS-15', 'pieza', 28.50, 18.50, 150, 30, 300, 'D-02-1', 12, cat5_id, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]'::jsonb, TRUE),
  ('Foco LED 9W Luz Blanca', 'FOCO-031', '7501234560031', 'Foco LED equivalente 60W', 'Sylvania', 'LED-9W', 'pieza', 65.00, 42.00, 200, 40, 400, 'D-03-1', 24, cat5_id, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]'::jsonb, TRUE)
  ON CONFLICT (sku) DO NOTHING;

  -- Pintura
  INSERT INTO products (name, sku, barcode, description, brand, model, unit, price, cost, stock, "minStock", "maxStock", location, "warrantyMonths", "categoryId", images, "isActive") VALUES
  ('Pintura Vinílica Blanco 19L', 'PINT-034', '7501234560034', 'Pintura vinílica interior', 'Comex', 'VIN-BL-19', 'cubeta', 685.00, 445.00, 45, 10, 90, 'E-01-1', 0, cat6_id, '["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800"]'::jsonb, TRUE),
  ('Brocha 4" Cerda Natural', 'BROC-037', '7501234560037', 'Brocha profesional para pintura', 'Truper', 'BCN-4', 'pieza', 145.00, 95.00, 60, 15, 120, 'E-02-1', 0, cat6_id, '["https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800"]'::jsonb, TRUE),
  ('Rodillo 9" con Repuesto', 'RODI-038', '7501234560038', 'Rodillo para pintura con mango', 'Truper', 'RP-9', 'pieza', 95.00, 62.00, 80, 20, 160, 'E-02-2', 0, cat6_id, '["https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800"]'::jsonb, TRUE)
  ON CONFLICT (sku) DO NOTHING;

  -- Cerrajería
  INSERT INTO products (name, sku, barcode, description, brand, model, unit, price, cost, stock, "minStock", "maxStock", location, "warrantyMonths", "categoryId", images, "isActive") VALUES
  ('Chapa Cilíndrica Paso', 'CHAP-041', '7501234560041', 'Chapa para puerta de paso', 'Phillips', 'CCP-001', 'pieza', 385.00, 250.00, 25, 5, 50, 'F-01-1', 12, cat7_id, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]'::jsonb, TRUE),
  ('Candado de Alta Seguridad 50mm', 'CAND-043', '7501234560043', 'Candado laminado acero', 'Master Lock', 'ML-50', 'pieza', 245.00, 160.00, 40, 10, 80, 'F-02-1', 24, cat7_id, '["https://images.unsplash.com/photo-1565130838609-c3a86655db61?w=800"]'::jsonb, TRUE)
  ON CONFLICT (sku) DO NOTHING;

  -- Ferretería General
  INSERT INTO products (name, sku, barcode, description, brand, model, unit, price, cost, stock, "minStock", "maxStock", location, "warrantyMonths", "categoryId", images, "isActive") VALUES
  ('Tornillos para Madera 1" (100 pzas)', 'TORN-047', '7501234560047', 'Tornillos punta broca', 'Truper', 'TM-1-100', 'caja', 45.00, 29.00, 150, 30, 300, 'G-01-1', 0, cat8_id, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]'::jsonb, TRUE),
  ('Clavos de 2 1/2" (1 kg)', 'CLAV-049', '7501234560049', 'Clavos de acero para madera', 'Truper', 'CL-25-KG', 'kilogramo', 35.00, 22.00, 200, 40, 400, 'G-01-3', 0, cat8_id, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]'::jsonb, TRUE),
  ('Cinta Aislante 3M 20m', 'CINT-053', '7501234560053', 'Cinta aislante negra', '3M', 'CA-20', 'pieza', 35.00, 22.00, 200, 50, 400, 'G-03-1', 0, cat8_id, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]'::jsonb, TRUE),
  ('Silicón Transparente 300ml', 'SILI-054', '7501234560054', 'Silicón sellador multiusos', 'Comex', 'ST-300', 'pieza', 65.00, 42.00, 100, 25, 200, 'G-03-2', 0, cat8_id, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]'::jsonb, TRUE)
  ON CONFLICT (sku) DO NOTHING;

END $$;

-- ============================================
-- USUARIOS
-- ============================================
-- NOTA: Contraseña para todos es "admin123"
-- Hash bcrypt: $2a$10$XQWuJHa0XQWuJHa0XQWuJO5FLpGxP9jY9jY9jY9jY9jY9jY9jY9jY
INSERT INTO users (name, email, password, role) VALUES
('Administrador Principal', 'admin@ferreteria.com', '$2a$10$XQWuJHa0XQWuJHa0XQWuJO5FLpGxP9jY9jY9jY9jY9jY9jY9jY9jY', 'admin'),
('Vendedor Mostrador 1', 'vendedor1@ferreteria.com', '$2a$10$XQWuJHa0XQWuJHa0XQWuJO5FLpGxP9jY9jY9jY9jY9jY9jY9jY9jY', 'vendedor'),
('Vendedor Mostrador 2', 'vendedor2@ferreteria.com', '$2a$10$XQWuJHa0XQWuJHa0XQWuJO5FLpGxP9jY9jY9jY9jY9jY9jY9jY9jY', 'vendedor'),
('Cajero Principal', 'cajero@ferreteria.com', '$2a$10$XQWuJHa0XQWuJHa0XQWuJO5FLpGxP9jY9jY9jY9jY9jY9jY9jY9jY', 'vendedor')
ON CONFLICT (email) DO NOTHING;
