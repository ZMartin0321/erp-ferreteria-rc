-- Script para poblar la base de datos con datos realistas de ferretería
USE `erp_ferreteria_rc`;

-- ============================================
-- CATEGORÍAS DE FERRETERÍA
-- ============================================
INSERT INTO `categories` (`name`) VALUES
('Herramientas Manuales'),
('Herramientas Eléctricas'),
('Materiales de Construcción'),
('Plomería'),
('Electricidad'),
('Pintura y Accesorios'),
('Cerrajería'),
('Ferretería General'),
('Jardinería'),
('Seguridad Industrial');

-- ============================================
-- PROVEEDORES
-- ============================================
INSERT INTO `suppliers` (`name`, `rfc`, `contact`, `phone`, `email`, `address`, `city`, `state`, `paymentTerms`, `isActive`) VALUES
('Distribuidora TRUPER S.A.', 'TRU850101ABC', 'Juan Pérez', '5555-1234', 'ventas@truper.com', 'Av. Industrial 123', 'CDMX', 'Ciudad de México', '30 días', TRUE),
('DEWALT de México', 'DEW900202XYZ', 'María González', '5555-5678', 'contacto@dewalt.mx', 'Blvd. Manufactura 456', 'Monterrey', 'Nuevo León', '15 días', TRUE),
('Ferretería Nacional S.A.', 'FNA910303HIJ', 'Carlos Ramírez', '5555-9012', 'info@ferrnacional.com', 'Calle Principal 789', 'Guadalajara', 'Jalisco', '45 días', TRUE),
('Pinturas Comex', 'COM850404KLM', 'Ana Martínez', '5555-3456', 'ventas@comex.com.mx', 'Av. de las Américas 321', 'Querétaro', 'Querétaro', '30 días', TRUE),
('Cementos Cruz Azul', 'CCA750505NOP', 'Roberto López', '5555-7890', 'contacto@cruzazul.com.mx', 'Industrial Norte 654', 'Hidalgo', 'Hidalgo', '60 días', TRUE);

-- ============================================
-- CLIENTES
-- ============================================
INSERT INTO `customers` (`name`, `email`, `phone`, `address`, `city`, `state`, `customerType`, `creditLimit`, `creditDays`, `isActive`) VALUES
('Constructora del Valle S.A.', 'compras@constrvalle.com', '5555-1111', 'Av. Constructores 100', 'CDMX', 'Ciudad de México', 'business', 50000.00, 30, TRUE),
('José Luis García', 'jlgarcia@email.com', '5555-2222', 'Calle Reforma 234', 'CDMX', 'Ciudad de México', 'individual', 5000.00, 0, TRUE),
('Desarrollos Inmobiliarios GC', 'admon@desagc.com', '5555-3333', 'Paseo de la República 567', 'Zapopan', 'Jalisco', 'business', 100000.00, 45, TRUE),
('María Fernanda Rodríguez', 'mfrodriguez@email.com', '5555-4444', 'Col. Centro 890', 'Puebla', 'Puebla', 'individual', 3000.00, 0, TRUE),
('Mantenimiento y Servicios MX', 'contacto@mserviciosmx.com', '5555-5555', 'Zona Industrial 432', 'Toluca', 'Estado de México', 'business', 25000.00, 15, TRUE);

-- ============================================
-- PRODUCTOS DE FERRETERÍA
-- ============================================

-- Herramientas Manuales (Categoría 1)
INSERT INTO `products` (`name`, `sku`, `barcode`, `description`, `brand`, `model`, `unit`, `price`, `cost`, `stock`, `minStock`, `maxStock`, `location`, `warrantyMonths`, `categoryId`, `images`, `isActive`) VALUES
('Martillo de Carpintero 16 oz', 'MART-001', '7501234560001', 'Martillo con mango de fibra de vidrio', 'Truper', 'MC-16', 'pieza', 185.00, 120.00, 45, 10, 100, 'A-01-1', 12, 1, '["https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800", "https://images.unsplash.com/photo-1586864387634-700ed85941d8?w=800", "https://images.unsplash.com/photo-1590015852395-e2e365c49c72?w=800"]', TRUE),
('Juego de Desarmadores 6 Piezas', 'DESA-002', '7501234560002', 'Juego de desarmadores planos y de cruz', 'Truper', 'JD-6', 'caja', 245.00, 160.00, 30, 8, 80, 'A-01-2', 12, 1, '["https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800", "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800"]', TRUE),
('Pinzas de Presión 10"', 'PINZ-003', '7501234560003', 'Pinzas de presión con mordazas curvas', 'Truper', 'PP-10', 'pieza', 195.00, 125.00, 25, 5, 50, 'A-01-3', 12, 1, '["https://images.unsplash.com/photo-1565130838609-c3a86655db61?w=800", "https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800"]', TRUE),
('Nivel de Aluminio 24"', 'NIVE-004', '7501234560004', 'Nivel profesional de aluminio', 'Truper', 'NA-24', 'pieza', 385.00, 250.00, 20, 5, 40, 'A-01-4', 12, 1, '["https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800", "https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800"]', TRUE),
('Flexómetro 5m', 'FLEX-005', '7501234560005', 'Flexómetro con cinta métrica', 'Truper', 'FM-5', 'pieza', 125.00, 80.00, 60, 15, 120, 'A-01-5', 6, 1, '["https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800", "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800"]', TRUE),
('Llave Stillson 14"', 'LLAV-006', '7501234560006', 'Llave para tubo stillson', 'Truper', 'LS-14', 'pieza', 425.00, 275.00, 15, 3, 30, 'A-01-6', 12, 1, '["https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800", "https://images.unsplash.com/photo-1565130838609-c3a86655db61?w=800"]', TRUE),
('Arco Sierra con Seguetas', 'ARCO-007', '7501234560007', 'Arco para sierra con 3 seguetas', 'Truper', 'AS-12', 'pieza', 165.00, 105.00, 35, 8, 70, 'A-01-7', 6, 1, '["https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800", "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800"]', TRUE),

-- Herramientas Eléctricas (Categoría 2)
('Taladro Percutor 1/2" 800W', 'TALA-008', '7501234560008', 'Taladro percutor con velocidad variable', 'DeWalt', 'DW505K', 'pieza', 2450.00, 1600.00, 12, 3, 25, 'A-02-1', 24, 2, '["https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800", "https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800", "https://images.unsplash.com/photo-1586864387634-700ed85941d8?w=800"]', TRUE),
('Esmeril Angular 4 1/2" 900W', 'ESME-009', '7501234560009', 'Esmeril angular profesional', 'DeWalt', 'DWE402', 'pieza', 1895.00, 1235.00, 15, 3, 30, 'A-02-2', 24, 2, '["https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800", "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800"]', TRUE),
('Sierra Circular 7 1/4" 1800W', 'SIER-010', '7501234560010', 'Sierra circular con guía láser', 'DeWalt', 'DWE575', 'pieza', 3250.00, 2120.00, 8, 2, 20, 'A-02-3', 24, 2, '["https://images.unsplash.com/photo-1590015852395-e2e365c49c72?w=800", "https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800"]', TRUE),
('Lijadora Orbital 280W', 'LIJA-011', '7501234560011', 'Lijadora orbital con recolector de polvo', 'DeWalt', 'DWE6421', 'pieza', 1650.00, 1075.00, 10, 2, 20, 'A-02-4', 24, 2, '["https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800", "https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800"]', TRUE),
('Rotomartillo 3/4" 850W', 'ROTO-012', '7501234560012', 'Rotomartillo con 3 funciones', 'DeWalt', 'D25113K', 'pieza', 2850.00, 1850.00, 6, 2, 15, 'A-02-5', 24, 2, '["https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800", "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800"]', TRUE),

-- Materiales de Construcción (Categoría 3)
('Cemento Gris 50kg', 'CEME-013', '7501234560013', 'Cemento Portland CPC 30R', 'Cruz Azul', 'CPC30R', 'bulto', 185.00, 145.00, 200, 50, 500, 'B-01-1', 0, 3, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800"]', TRUE),
('Varilla Corrugada 3/8" 6m', 'VARI-014', '7501234560014', 'Varilla de acero corrugado', 'Deacero', 'VC-38', 'pieza', 95.00, 65.00, 150, 30, 300, 'B-01-2', 0, 3, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800"]', TRUE),
('Varilla Corrugada 1/2" 6m', 'VARI-015', '7501234560015', 'Varilla de acero corrugado', 'Deacero', 'VC-12', 'pieza', 165.00, 115.00, 120, 25, 250, 'B-01-3', 0, 3, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800"]', TRUE),
('Block de Concreto 15x20x40cm', 'BLOC-016', '7501234560016', 'Block hueco de concreto', 'Nacional', 'BH-15', 'pieza', 18.50, 12.00, 500, 100, 1000, 'B-02-1', 0, 3, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800"]', TRUE),
('Arena Fina m³', 'AREN-017', '7501234560017', 'Arena fina para mortero', 'Local', 'AF-M3', 'metro', 450.00, 320.00, 25, 5, 50, 'B-03-1', 0, 3, '["https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE),
('Grava 3/4" m³', 'GRAV-018', '7501234560018', 'Grava triturada para concreto', 'Local', 'GR-34-M3', 'metro', 385.00, 275.00, 30, 8, 60, 'B-03-2', 0, 3, '["https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE),

-- Plomería (Categoría 4)
('Llave de Nariz 1/2"', 'LLAV-019', '7501234560019', 'Llave de nariz cromada', 'Helvex', 'LN-12', 'pieza', 285.00, 185.00, 35, 8, 70, 'C-01-1', 12, 4, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", "https://images.unsplash.com/photo-1565130838609-c3a86655db61?w=800"]', TRUE),
('Tubo PVC Hidráulico 1/2" 6m', 'TUBP-020', '7501234560020', 'Tubo de PVC cédula 40', 'Pavco', 'PVC-12-6', 'pieza', 145.00, 95.00, 80, 20, 150, 'C-01-2', 0, 4, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800"]', TRUE),
('Tubo PVC Hidráulico 3/4" 6m', 'TUBP-021', '7501234560021', 'Tubo de PVC cédula 40', 'Pavco', 'PVC-34-6', 'pieza', 185.00, 125.00, 65, 15, 130, 'C-01-3', 0, 4, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800"]', TRUE),
('Codo PVC 90° 1/2"', 'CODP-022', '7501234560022', 'Codo de PVC hidráulico', 'Pavco', 'C90-12', 'pieza', 12.50, 8.00, 200, 50, 400, 'C-02-1', 0, 4, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE),
('Codo PVC 90° 3/4"', 'CODP-023', '7501234560023', 'Codo de PVC hidráulico', 'Pavco', 'C90-34', 'pieza', 18.50, 12.00, 180, 45, 360, 'C-02-2', 0, 4, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE),
('Válvula de Esfera 1/2"', 'VALV-024', '7501234560024', 'Válvula de esfera de bronce', 'Foset', 'VE-12', 'pieza', 165.00, 110.00, 45, 10, 90, 'C-03-1', 12, 4, '["https://images.unsplash.com/photo-1565130838609-c3a86655db61?w=800", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE),
('Tinaco 1100L', 'TINA-025', '7501234560025', 'Tinaco de polietileno', 'Rotoplas', 'TP-1100', 'pieza', 2850.00, 1950.00, 8, 2, 15, 'C-04-1', 60, 4, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800"]', TRUE),

-- Electricidad (Categoría 5)
('Cable THW Cal. 12 AWG', 'CABL-026', '7501234560026', 'Cable de cobre calibre 12', 'Condumex', 'THW-12', 'metro', 24.50, 16.00, 500, 100, 1000, 'D-01-1', 12, 5, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800"]', TRUE),
('Cable THW Cal. 10 AWG', 'CABL-027', '7501234560027', 'Cable de cobre calibre 10', 'Condumex', 'THW-10', 'metro', 38.50, 25.00, 400, 80, 800, 'D-01-2', 12, 5, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800"]', TRUE),
('Apagador Sencillo', 'APAG-028', '7501234560028', 'Apagador sencillo 15A', 'Volteck', 'AS-15', 'pieza', 28.50, 18.50, 150, 30, 300, 'D-02-1', 12, 5, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE),
('Apagador de 3 Vías', 'APAG-029', '7501234560029', 'Apagador de escalera 15A', 'Volteck', 'A3V-15', 'pieza', 42.00, 27.00, 100, 20, 200, 'D-02-2', 12, 5, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE),
('Contacto Doble Polarizado', 'CONT-030', '7501234560030', 'Contacto doble con tierra', 'Volteck', 'CDP-15', 'pieza', 35.00, 22.00, 120, 25, 250, 'D-02-3', 12, 5, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE),
('Foco LED 9W Luz Blanca', 'FOCO-031', '7501234560031', 'Foco LED equivalente 60W', 'Sylvania', 'LED-9W', 'pieza', 65.00, 42.00, 200, 40, 400, 'D-03-1', 24, 5, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800"]', TRUE),
('Foco LED 15W Luz Blanca', 'FOCO-032', '7501234560032', 'Foco LED equivalente 100W', 'Sylvania', 'LED-15W', 'pieza', 95.00, 62.00, 150, 30, 300, 'D-03-2', 24, 5, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800"]', TRUE),
('Centro de Carga 4 Polos', 'CENT-033', '7501234560033', 'Centro de carga residencial', 'Volteck', 'CC-4P', 'pieza', 485.00, 315.00, 20, 5, 40, 'D-04-1', 12, 5, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800"]', TRUE),

-- Pintura y Accesorios (Categoría 6)
('Pintura Vinílica Blanco 19L', 'PINT-034', '7501234560034', 'Pintura vinílica interior', 'Comex', 'VIN-BL-19', 'cubeta', 685.00, 445.00, 45, 10, 90, 'E-01-1', 0, 6, '["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800", "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=800", "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800"]', TRUE),
('Pintura Vinílica Beige 19L', 'PINT-035', '7501234560035', 'Pintura vinílica interior', 'Comex', 'VIN-BE-19', 'cubeta', 685.00, 445.00, 30, 8, 60, 'E-01-2', 0, 6, '["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800", "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=800"]', TRUE),
('Esmalte Acrílico Blanco 1L', 'ESMA-036', '7501234560036', 'Esmalte acrílico brillante', 'Comex', 'EA-BL-1', 'litro', 185.00, 120.00, 60, 15, 120, 'E-01-3', 0, 6, '["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800", "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=800"]', TRUE),
('Brocha 4" Cerda Natural', 'BROC-037', '7501234560037', 'Brocha profesional para pintura', 'Truper', 'BCN-4', 'pieza', 145.00, 95.00, 60, 15, 120, 'E-02-1', 0, 6, '["https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800", "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800"]', TRUE),
('Rodillo 9" con Repuesto', 'RODI-038', '7501234560038', 'Rodillo para pintura con mango', 'Truper', 'RP-9', 'pieza', 95.00, 62.00, 80, 20, 160, 'E-02-2', 0, 6, '["https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800", "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800"]', TRUE),
('Charola para Pintura 9"', 'CHAR-039', '7501234560039', 'Charola plástica para rodillo', 'Truper', 'CP-9', 'pieza', 45.00, 29.00, 100, 25, 200, 'E-02-3', 0, 6, '["https://images.unsplash.com/photo-1572981779307-1f0f3e829263?w=800"]', TRUE),
('Thinner Estándar 1L', 'THIN-040', '7501234560040', 'Thinner para limpieza', 'Comex', 'TH-1L', 'litro', 55.00, 36.00, 100, 25, 200, 'E-03-1', 0, 6, '["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800", "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=800"]', TRUE),

-- Cerrajería (Categoría 7)
('Chapa Cilíndrica Paso', 'CHAP-041', '7501234560041', 'Chapa para puerta de paso', 'Phillips', 'CCP-001', 'pieza', 385.00, 250.00, 25, 5, 50, 'F-01-1', 12, 7, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", "https://images.unsplash.com/photo-1565130838609-c3a86655db61?w=800"]', TRUE),
('Chapa de Pomo Baño', 'CHAP-042', '7501234560042', 'Chapa con seguro para baño', 'Phillips', 'CPB-002', 'pieza', 425.00, 275.00, 20, 5, 40, 'F-01-2', 12, 7, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", "https://images.unsplash.com/photo-1565130838609-c3a86655db61?w=800"]', TRUE),
('Candado de Alta Seguridad 50mm', 'CAND-043', '7501234560043', 'Candado laminado acero', 'Master Lock', 'ML-50', 'pieza', 245.00, 160.00, 40, 10, 80, 'F-02-1', 24, 7, '["https://images.unsplash.com/photo-1565130838609-c3a86655db61?w=800", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE),
('Candado de Latón 40mm', 'CAND-044', '7501234560044', 'Candado de latón estándar', 'Master Lock', 'ML-40', 'pieza', 165.00, 105.00, 50, 12, 100, 'F-02-2', 12, 7, '["https://images.unsplash.com/photo-1565130838609-c3a86655db61?w=800", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE),
('Bisagra de Acero 3"', 'BISA-045', '7501234560045', 'Bisagra estándar cromada', 'Helvex', 'BA-3', 'par', 45.00, 29.00, 100, 20, 200, 'F-03-1', 12, 7, '["https://images.unsplash.com/photo-1565130838609-c3a86655db61?w=800"]', TRUE),
('Cerrojo de Sobreponer 4"', 'CERR-046', '7501234560046', 'Cerrojo de seguridad', 'Phillips', 'CS-4', 'pieza', 125.00, 80.00, 60, 15, 120, 'F-03-2', 12, 7, '["https://images.unsplash.com/photo-1565130838609-c3a86655db61?w=800", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE),

-- Ferretería General (Categoría 8)
('Tornillos para Madera 1" (100 pzas)', 'TORN-047', '7501234560047', 'Tornillos punta broca', 'Truper', 'TM-1-100', 'caja', 45.00, 29.00, 150, 30, 300, 'G-01-1', 0, 8, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE),
('Tornillos para Madera 2" (100 pzas)', 'TORN-048', '7501234560048', 'Tornillos punta broca', 'Truper', 'TM-2-100', 'caja', 65.00, 42.00, 120, 25, 250, 'G-01-2', 0, 8, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE),
('Clavos de 2 1/2" (1 kg)', 'CLAV-049', '7501234560049', 'Clavos de acero para madera', 'Truper', 'CL-25-KG', 'kilogramo', 35.00, 22.00, 200, 40, 400, 'G-01-3', 0, 8, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE),
('Clavos de 3" (1 kg)', 'CLAV-050', '7501234560050', 'Clavos de acero para madera', 'Truper', 'CL-3-KG', 'kilogramo', 38.00, 24.00, 180, 35, 350, 'G-01-4', 0, 8, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE),
('Taquetes de Plástico 1/4" (100 pzas)', 'TAQU-051', '7501234560051', 'Taquetes expansivos', 'Truper', 'TP-14-100', 'caja', 55.00, 36.00, 180, 35, 350, 'G-02-1', 0, 8, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE),
('Taquetes de Plástico 3/8" (100 pzas)', 'TAQU-052', '7501234560052', 'Taquetes expansivos', 'Truper', 'TP-38-100', 'caja', 75.00, 48.00, 150, 30, 300, 'G-02-2', 0, 8, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE),
('Cinta Aislante 3M 20m', 'CINT-053', '7501234560053', 'Cinta aislante negra', '3M', 'CA-20', 'pieza', 35.00, 22.00, 200, 50, 400, 'G-03-1', 0, 8, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE),
('Silicón Transparente 300ml', 'SILI-054', '7501234560054', 'Silicón sellador multiusos', 'Comex', 'ST-300', 'pieza', 65.00, 42.00, 100, 25, 200, 'G-03-2', 0, 8, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE),
('Pegamento Blanco 1kg', 'PEGA-055', '7501234560055', 'Pegamento blanco para madera', 'Resistol', 'PB-1KG', 'pieza', 95.00, 62.00, 80, 20, 160, 'G-03-3', 0, 8, '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"]', TRUE);

-- ============================================
-- USUARIOS
-- ============================================
-- NOTA: Contraseña para todos es "admin123"
-- Hash bcrypt: $2a$10$XQWuJHa0XQWuJHa0XQWuJO5FLpGxP9jY9jY9jY9jY9jY9jY9jY9jY
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Administrador Principal', 'admin@ferreteria.com', '$2a$10$XQWuJHa0XQWuJHa0XQWuJO5FLpGxP9jY9jY9jY9jY9jY9jY9jY9jY', 'admin'),
('Vendedor Mostrador 1', 'vendedor1@ferreteria.com', '$2a$10$XQWuJHa0XQWuJHa0XQWuJO5FLpGxP9jY9jY9jY9jY9jY9jY9jY9jY', 'vendedor'),
('Vendedor Mostrador 2', 'vendedor2@ferreteria.com', '$2a$10$XQWuJHa0XQWuJHa0XQWuJO5FLpGxP9jY9jY9jY9jY9jY9jY9jY9jY', 'vendedor'),
('Cajero Principal', 'cajero@ferreteria.com', '$2a$10$XQWuJHa0XQWuJHa0XQWuJO5FLpGxP9jY9jY9jY9jY9jY9jY9jY9jY', 'vendedor');
