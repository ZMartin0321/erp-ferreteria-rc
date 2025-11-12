-- Eliminar campos de crédito de la tabla customers
ALTER TABLE customers DROP COLUMN IF EXISTS creditLimit;
ALTER TABLE customers DROP COLUMN IF EXISTS creditDays;
