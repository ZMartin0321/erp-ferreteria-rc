# ERP Ferretería RC

Sistema ERP completo para gestión de ferretería desarrollado con Node.js, React y MySQL/MariaDB.

## 🚀 Instalación y ejecución

### Requisitos previos

- Node.js 16+
- MySQL o MariaDB instalado y corriendo
- Git

### 1. Base de datos

Primero, crea la base de datos y ejecuta los scripts de inicialización:

```sql
-- En MySQL/MariaDB CLI o Workbench:
CREATE DATABASE erp_ferreteria_rc;
```

Luego ejecuta los scripts SQL:

- `database/init.sql` - Crea las tablas
- `database/seed.sql` - Inserta datos de ejemplo (opcional)

### 2. Backend

```powershell
cd backend
npm install
# Edita el archivo .env con tus credenciales de MySQL
# DB_PASS=tu_password_mysql
npm run dev
```

El servidor estará en: `http://localhost:4000`

### 3. Frontend

```powershell
cd frontend
npm install
npm run dev
```

La aplicación estará en: `http://localhost:5173`

### 4. Primer uso

1. Registra un usuario admin en: `http://localhost:5173/register`
2. Inicia sesión
3. Explora el dashboard, productos, ventas y compras

## 📋 Funcionalidades implementadas

### ✅ Módulo de Inventario

- CRUD completo de productos y categorías
- Control de stock en tiempo real
- Alertas de stock mínimo/máximo

### ✅ Módulo de Compras

- Gestión de proveedores
- Creación de órdenes de compra
- Recepción de mercancía con actualización automática de stock

### ✅ Módulo de Ventas

- Creación de ventas con cálculo de descuentos e impuestos
- Verificación automática de stock
- Generación de facturas en PDF

### ✅ Módulo de Reportes

- Dashboard con KPIs principales
- Exportación de facturas a PDF
- Reportes de ventas exportables

### ✅ Autenticación y Seguridad

- Login/Register con JWT
- Roles: admin, vendedor, comprador
- Rutas protegidas en frontend y backend

## 🔧 Tecnologías utilizadas

**Backend:**

- Node.js + Express
- Sequelize ORM
- MySQL/MariaDB
- JWT para autenticación
- PDFKit para generación de PDFs
- Jest + Supertest para testing

**Frontend:**

- React 18
- Vite
- React Router v6
- Axios
- TailwindCSS

## 📁 Estructura del proyecto

```
erp-ferreteria-rc/
├── backend/          # API REST con Express
├── frontend/         # App React
├── database/         # Scripts SQL
└── docs/            # Documentación
```

## 🌐 Endpoints principales

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `GET /api/sales` - Listar ventas
- `POST /api/sales` - Crear venta
- `GET /api/purchases` - Listar compras
- `POST /api/purchases/:id/receive` - Recibir compra
- `GET /api/reports/dashboard` - KPIs del dashboard
- `GET /api/reports/invoice/:saleId` - Descargar factura PDF

## 📝 Notas importantes

1. **Contraseña de BD**: Edita `backend/.env` con tu contraseña de MySQL
2. **Datos de ejemplo**: Ejecuta `database/seed.sql` para datos de prueba
3. **Primer usuario**: Usa `/register` para crear el primer usuario admin
4. **Stock**: Las ventas restan stock, las compras lo aumentan al recibirlas

## 🐛 Troubleshooting

**Error de conexión a BD:**

- Verifica que MySQL/MariaDB esté corriendo
- Confirma las credenciales en `backend/.env`
- Asegúrate de haber creado la base de datos

**Error en frontend:**

- Verifica que el backend esté corriendo en puerto 4000
- Revisa `frontend/.env` - debe apuntar a `http://localhost:4000/api`

## 👥 Empresa

**PPN DEV** - Desarrollo de software empresarial

## 📄 Licencia

MIT
