-- Agregar columna de imágenes a la tabla products si no existe
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images JSON DEFAULT NULL 
COMMENT 'Array de URLs de imágenes del producto';

-- Actualizar algunos productos de ejemplo con imágenes por defecto
UPDATE products 
SET images = JSON_ARRAY('/uploads/productos/default-product.jpg')
WHERE images IS NULL 
LIMIT 5;
