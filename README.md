# ERP Ferretería RC

![Node.js](https://img.shields.io/badge/Node.js-18+-3C873A?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=06142e)
![MySQL](https://img.shields.io/badge/MySQL-8+-4479A1?logo=mysql&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-blue)

ERP modular para ferreterías que integra inventario, compras, ventas y reportes en tiempo real. El repositorio funciona como monorepo: API REST (Express + Sequelize), dashboard React/Vite y scripts SQL para inicializar datos.

---

## Tabla de contenidos

- [Características clave](#características-clave)
- [Arquitectura y stack](#arquitectura-y-stack)
- [Estructura del monorepo](#estructura-del-monorepo)
- [Inicio rápido](#inicio-rápido)
- [Variables de entorno](#variables-de-entorno)
- [Gestión de base de datos](#gestión-de-base-de-datos)
- [Flujo de desarrollo](#flujo-de-desarrollo)
- [API y contratos de respuesta](#api-y-contratos-de-respuesta)
- [Frontend: patrones de UI/UX](#frontend-patrones-de-uiux)
- [Documentación](#documentación)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## Características clave

- **Inventario inteligente**: CRUD de productos/categorías, niveles mínimos/máximos, alertas de stock bajo y auditoría a través de movimientos de inventario.
- **Compras y ventas conectadas**: Órdenes de compra que reabastecen stock al recibirlas; ventas que validan existencias y descuentan automáticamente.
- **Facturación profesional**: PDFs estilizados con identidad de “Ferretería RC”, totales, descuentos y estados de pago mediante `pdfkit`.
- **Reportes ejecutivos**: Dashboard con KPIs (productos, compras, ventas) y generación de reportes PDF para análisis.
- **Seguridad**: Autenticación JWT, middleware de autorización por roles y rutas protegidas en backend y frontend.

## Arquitectura y stack

- **Backend**: Node.js, Express, Sequelize, MySQL/MariaDB, JWT, PDFKit, Jest/Supertest.
- **Frontend**: React 18, Vite, React Router v6, Axios, TailwindCSS, Chart.js/Recharts.
- **Infraestructura**: Scripts SQL (`database/init.sql`, `database/seed.sql`) y utilidades Node para reseteo (`backend/update-database.js`).
- **Convención de respuestas**: Controladores devuelven `{ message, data, ... }` para consumo consistente desde el cliente.

## Estructura del monorepo

```
erp-ferreteria-rc/
├── backend/             # API REST Express + Sequelize
│   ├── src/
│   │   ├── controllers/ # Lógica por dominio (productos, ventas, etc.)
│   │   ├── middleware/  # Autenticación, validaciones, manejo de errores
│   │   ├── models/      # Definiciones y asociaciones Sequelize
│   │   ├── routes/      # Rutas agrupadas por módulo
│   │   └── services/    # Inventario, PDF, utilidades
│   └── tests/           # Pruebas Jest + Supertest (NODE_ENV=test)
├── frontend/            # Dashboard React (Vite + Tailwind)
│   └── src/
│       ├── pages/       # Vistas protegidas por módulo
│       ├── components/  # UI reutilizable (Modal, Table, etc.)
│       ├── context/     # AuthContext / ProtectedRoute
│       └── services/    # Axios configurado con interceptores
├── database/            # Scripts SQL (init, seed, seed-sales)
└── docs/                # Arquitectura, branding y manuales
```

## Inicio rápido

### Requisitos

- Node.js 16+
- MySQL/MariaDB 10+
- Git

### 1. Clonar y preparar entorno

```powershell
git clone https://github.com/ZMartin0321/erp-ferreteria-rc.git
cd erp-ferreteria-rc
```

### 2. Backend (API)

```powershell
cd backend
cp .env.example .env       # Ajusta credenciales MySQL y FRONTEND_URL
npm install
npm run dev                # Ejecuta en http://localhost:4000
```

### 3. Frontend (dashboard)

```powershell
cd ../frontend
cp .env.example .env       # Asegúrate que VITE_API_URL apunte al backend
npm install
npm run dev                # Ejecuta en http://localhost:5173
```

Visita `http://localhost:5173`, registra el usuario administrador y comienza a operar.

## Variables de entorno

| Ubicación | Archivo         | Claves relevantes                                                        |
| --------- | --------------- | ------------------------------------------------------------------------ |
| Backend   | `backend/.env`  | `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET`, `FRONTEND_URL` |
| Frontend  | `frontend/.env` | `VITE_API_URL` (por defecto `http://localhost:4000/api`)                 |

## Gestión de base de datos

- Crear/esquema inicial: `database/init.sql`
- Datos de ejemplo general: `database/seed.sql`
- Escenarios de ventas/compras puntuales: `database/seed-sales.sql`
- Reset completo sin abrir Workbench: `node backend/update-database.js`

> **Tip:** `backend/update-database.js` borra y recrea `erp_ferreteria_rc`, trunca tablas y vuelve a sembrar datos. Útil para demos limpias.

## Flujo de desarrollo

- **Backend**
  - `npm run dev`: nodemon + Express
  - `npm test`: Jest/Supertest (requiere MySQL, usa `NODE_ENV=test`)
  - `npm run lint` / `npm run format`: ESLint + Prettier sobre `src/**/*.js`
- **Frontend**
  - `npm run dev`: servidor Vite
  - `npm run build`: artefacto de producción en `dist/`
  - `npm run lint`: ESLint + plugins React

Scripts auxiliares en `backend/` (`test-api.js`, `test-crud.js`, etc.) ejercitan flujos completos contra un backend levantado en `:4000` con credenciales sembradas.

## API y contratos de respuesta

- Todas las rutas se cuelgan de `/api` (`backend/src/app.js`).
- Rutas se registran en `backend/src/routes/index.js`; recuerda exponer nuevas rutas ahí para que aparezcan en el índice autodocumentado.
- Controladores retornan por convención `{ message, data, ... }`. Ejemplo:
  ```json
  {
  	"message": "Producto creado exitosamente",
  	"data": { "id": 123, "name": "Martillo", ... }
  }
  ```
- Errores uniformes a través de `middleware/errorHandler.js` (manejo especial para validaciones Sequelize, claves duplicadas, JWT expirados, etc.).
- Ajustes de inventario centralizados en `services/inventoryService.js`; utiliza `updateStock`/`checkStock` para evitar inconsistencias.

## Frontend: patrones de UI/UX

- Axios con interceptores (`frontend/src/services/api.js`) agrega token y redirige a `/login` si recibe 401/expired JWT.
- Estado de autenticación en `AuthContext.jsx`; `ProtectedRoute` protege cada página del dashboard.
- Branding consistente (gradientes, iconografía, sombras) en `src/config/branding.js`; reutiliza esos tokens en nuevos componentes.
- Páginas (`src/pages/*.jsx`) consumen la API sin normalizar datos adicionales —respeta la estructura `{ data: ... }` esperada para evitar errores.

## Documentación

- Arquitectura: `docs/Arquitectura.md`
- Manual de usuario: `docs/ManualUsuario.md`
- Branding y lineamientos visuales: `docs/Branding.md`
- Plan de calidad y mejoras profesionales: en la raíz (`PROFESSIONAL_IMPROVEMENTS.md`, `ACTUALIZACION_COMPLETADA.md`, etc.)

## Contribuir

1. Crea un branch descriptivo (ej. `feature/invoice-filter`).
2. Asegúrate de ejecutar linters/formateadores en backend y frontend.
3. Agrega/actualiza seeds o scripts SQL cuando cambien modelos.
4. Abre un Pull Request enlazando tareas/jiras y describe pruebas manuales.

## Licencia

Distribuido bajo licencia [MIT](LICENSE).
