# Manual de Usuario - ERP Ferretería RC

Este documento contiene instrucciones básicas para usar el sistema de gestión de Ferretería RC.

## Inicio de sesión

- URL del backend: `http://localhost:4000/api`
- Endpoint de login: `POST /api/auth/login` con { email, password }.
- Al autenticarse recibirá un token JWT que debe incluir en la cabecera `Authorization: Bearer <token>` para llamadas protegidas.

## Módulos principales

- Inventario: `GET /api/products`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`.
- Categorías: `GET /api/categories`, `POST /api/categories`.
- Proveedores: `GET /api/suppliers`, `POST /api/suppliers`.
- Compras: `GET /api/purchases`, `POST /api/purchases`.
- Ventas: `GET /api/sales`, `POST /api/sales`.
- Reportes: `GET /api/reports/dashboard`.

## Roles

- admin: acceso completo.
- vendedor: puede crear ventas y ver inventario.
- comprador: puede crear compras y gestionar proveedores.

## Frontend

- Ejecutar el frontend en `http://localhost:5173` (Vite por defecto) después de `npm install` y `npm run dev` dentro de `frontend/`.

## Notas

- Cambie la contraseña del admin en la base de datos o registre un nuevo usuario usando `POST /api/auth/register`.
- Asegúrese de configurar correctamente `.env` en `backend/` antes de arrancar.
