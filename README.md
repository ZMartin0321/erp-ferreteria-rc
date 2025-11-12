# 🛠️ ERP Ferretería RC# ERP Ferretería RC

Sistema de gestión empresarial (ERP) completo para ferreterías, desarrollado con tecnologías modernas y diseño profesional.![Node.js](https://img.shields.io/badge/Node.js-18+-3C873A?logo=node.js&logoColor=white)

![Express](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white)

## ✨ Características![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=06142e)

![MySQL](https://img.shields.io/badge/MySQL-8+-4479A1?logo=mysql&logoColor=white)

### 📦 Gestión de Inventario![License: MIT](https://img.shields.io/badge/License-MIT-blue)

- Control completo de productos con imágenes

- Categorización y búsqueda avanzadaERP modular para ferreterías que integra inventario, compras, ventas y reportes en tiempo real. El repositorio funciona como monorepo: API REST (Express + Sequelize), dashboard React/Vite y scripts SQL para inicializar datos.

- Alertas de stock mínimo

- Historial de movimientos de inventario---

### 💰 Ventas## Tabla de contenidos

- Registro de ventas con múltiples productos

- Estados de pago (Pagado, Pendiente, Borrador)- [Características clave](#características-clave)

- Generación de facturas PDF- [Arquitectura y stack](#arquitectura-y-stack)

- Dashboard con métricas y estadísticas- [Estructura del monorepo](#estructura-del-monorepo)

- [Inicio rápido](#inicio-rápido)

### 🛒 Compras- [Variables de entorno](#variables-de-entorno)

- Gestión de compras a proveedores- [Gestión de base de datos](#gestión-de-base-de-datos)

- Control de stock recibido- [Flujo de desarrollo](#flujo-de-desarrollo)

- Tracking de estados de pago- [API y contratos de respuesta](#api-y-contratos-de-respuesta)

- Reportes de inversión- [Frontend: patrones de UI/UX](#frontend-patrones-de-uiux)

- [Documentación](#documentación)

### 👥 Clientes y Proveedores- [Contribuir](#contribuir)

- Gestión completa de contactos- [Licencia](#licencia)

- Historial de transacciones

- Información detallada---

### 📊 Panel de Control## Características clave

- Gráficos estadísticos en tiempo real

- Top productos más vendidos- **Inventario inteligente**: CRUD de productos/categorías, niveles mínimos/máximos, alertas de stock bajo y auditoría a través de movimientos de inventario.

- Tendencias de ventas semanales/mensuales- **Compras y ventas conectadas**: Órdenes de compra que reabastecen stock al recibirlas; ventas que validan existencias y descuentan automáticamente.

- KPIs principales- **Facturación profesional**: PDFs estilizados con identidad de “Ferretería RC”, totales, descuentos y estados de pago mediante `pdfkit`.

- **Reportes ejecutivos**: Dashboard con KPIs (productos, compras, ventas) y generación de reportes PDF para análisis.

### 🔐 Autenticación- **Seguridad**: Autenticación JWT, middleware de autorización por roles y rutas protegidas en backend y frontend.

- Sistema de usuarios con roles

- Login y registro seguros## Arquitectura y stack

- Tokens JWT para sesiones

- **Backend**: Node.js, Express, Sequelize, MySQL/MariaDB, JWT, PDFKit, Jest/Supertest.

## 🚀 Tecnologías- **Frontend**: React 18, Vite, React Router v6, Axios, TailwindCSS, Chart.js/Recharts.

- **Infraestructura**: Scripts SQL (`database/init.sql`, `database/seed.sql`) y utilidades Node para reseteo (`backend/update-database.js`).

### Backend- **Convención de respuestas**: Controladores devuelven `{ message, data, ... }` para consumo consistente desde el cliente.

- **Node.js** - Runtime de JavaScript

- **Express.js** - Framework web## Estructura del monorepo

- **Sequelize** - ORM para MySQL

- **MySQL** - Base de datos relacional```

- **JWT** - Autenticaciónerp-ferreteria-rc/

- **Multer** - Subida de archivos├── backend/ # API REST Express + Sequelize

- **PDFKit** - Generación de PDFs│ ├── src/

│ │ ├── controllers/ # Lógica por dominio (productos, ventas, etc.)

### Frontend│ │ ├── middleware/ # Autenticación, validaciones, manejo de errores

- **React 18** - Librería de UI│ │ ├── models/ # Definiciones y asociaciones Sequelize

- **Vite** - Build tool ultrarrápido│ │ ├── routes/ # Rutas agrupadas por módulo

- **React Router** - Navegación│ │ └── services/ # Inventario, PDF, utilidades

- **Axios** - Cliente HTTP│ └── tests/ # Pruebas Jest + Supertest (NODE_ENV=test)

- **Recharts** - Gráficos estadísticos├── frontend/ # Dashboard React (Vite + Tailwind)

- **Tailwind CSS** - Estilos utility-first│ └── src/

│ ├── pages/ # Vistas protegidas por módulo

## 📋 Requisitos Previos│ ├── components/ # UI reutilizable (Modal, Table, etc.)

│ ├── context/ # AuthContext / ProtectedRoute

- **Node.js** >= 16.x│ └── services/ # Axios configurado con interceptores

- **MySQL** >= 8.0├── database/ # Scripts SQL (init, seed, seed-sales)

- **npm** o **yarn**└── docs/ # Arquitectura, branding y manuales

````

## ⚙️ Instalación

## Inicio rápido

### 1. Clonar el repositorio

```bash### Requisitos

git clone https://github.com/ZMartin0321/erp-ferreteria-rc.git

cd erp-ferreteria-rc- Node.js 16+

```- MySQL/MariaDB 10+

- Git

### 2. Configurar la base de datos

```bash### 1. Clonar y preparar entorno

# Crear la base de datos en MySQL

mysql -u root -p```powershell

CREATE DATABASE erp_ferreteria_rc;git clone https://github.com/ZMartin0321/erp-ferreteria-rc.git

EXIT;cd erp-ferreteria-rc

````

# Ejecutar el script de inicialización

mysql -u root -p erp_ferreteria_rc < basedatos/init.sql### 2. Backend (API)

# (Opcional) Cargar datos de ejemplo```powershell

mysql -u root -p erp_ferreteria_rc < basedatos/seed.sqlcd backend

````cp .env.example .env       # Ajusta credenciales MySQL y FRONTEND_URL

npm install

### 3. Configurar el Backendnpm run dev                # Ejecuta en http://localhost:4000

```bash```

cd backend

### 3. Frontend (dashboard)

# Instalar dependencias

npm install```powershell

cd ../frontend

# Configurar variables de entornocp .env.example .env       # Asegúrate que VITE_API_URL apunte al backend

cp .env.example .envnpm install

# Editar .env con tus credenciales de MySQLnpm run dev                # Ejecuta en http://localhost:5173

````

Ejemplo de `.env`:Visita `http://localhost:5173`, registra el usuario administrador y comienza a operar.

````env

DB_HOST=localhost## Variables de entorno

DB_USER=root

DB_PASS=tu_password| Ubicación | Archivo         | Claves relevantes                                                        |

DB_NAME=erp_ferreteria_rc| --------- | --------------- | ------------------------------------------------------------------------ |

DB_PORT=3306| Backend   | `backend/.env`  | `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET`, `FRONTEND_URL` |

| Frontend  | `frontend/.env` | `VITE_API_URL` (por defecto `http://localhost:4000/api`)                 |

PORT=4000

## Gestión de base de datos

JWT_SECRET=tu_secreto_super_seguro

JWT_EXPIRES_IN=7d- Crear/esquema inicial: `database/init.sql`

```- Datos de ejemplo general: `database/seed.sql`

- Escenarios de ventas/compras puntuales: `database/seed-sales.sql`

### 4. Configurar el Frontend- Reset completo sin abrir Workbench: `node backend/update-database.js`

```bash

cd ../frontend> **Tip:** `backend/update-database.js` borra y recrea `erp_ferreteria_rc`, trunca tablas y vuelve a sembrar datos. Útil para demos limpias.



# Instalar dependencias## Flujo de desarrollo

npm install

- **Backend**

# Crear archivo de variables de entorno  - `npm run dev`: nodemon + Express

echo "VITE_API_URL=http://localhost:4000/api" > .env  - `npm test`: Jest/Supertest (requiere MySQL, usa `NODE_ENV=test`)

```  - `npm run lint` / `npm run format`: ESLint + Prettier sobre `src/**/*.js`

- **Frontend**

## 🏃 Ejecutar el Proyecto  - `npm run dev`: servidor Vite

  - `npm run build`: artefacto de producción en `dist/`

### Opción 1: Ejecutar manualmente  - `npm run lint`: ESLint + plugins React



**Terminal 1 - Backend:**Scripts auxiliares en `backend/` (`test-api.js`, `test-crud.js`, etc.) ejercitan flujos completos contra un backend levantado en `:4000` con credenciales sembradas.

```bash

cd backend## API y contratos de respuesta

npm run dev

```- Todas las rutas se cuelgan de `/api` (`backend/src/app.js`).

- Rutas se registran en `backend/src/routes/index.js`; recuerda exponer nuevas rutas ahí para que aparezcan en el índice autodocumentado.

**Terminal 2 - Frontend:**- Controladores retornan por convención `{ message, data, ... }`. Ejemplo:

```bash  ```json

cd frontend  {

npm run dev  	"message": "Producto creado exitosamente",

```  	"data": { "id": 123, "name": "Martillo", ... }

  }

### Opción 2: Script de inicio (Windows)  ```

```powershell- Errores uniformes a través de `middleware/errorHandler.js` (manejo especial para validaciones Sequelize, claves duplicadas, JWT expirados, etc.).

.\iniciar.ps1- Ajustes de inventario centralizados en `services/inventoryService.js`; utiliza `updateStock`/`checkStock` para evitar inconsistencias.

````

## Frontend: patrones de UI/UX

El sistema estará disponible en:

- **Frontend**: http://localhost:5173- Axios con interceptores (`frontend/src/services/api.js`) agrega token y redirige a `/login` si recibe 401/expired JWT.

- **Backend API**: http://localhost:4000/api- Estado de autenticación en `AuthContext.jsx`; `ProtectedRoute` protege cada página del dashboard.

- Branding consistente (gradientes, iconografía, sombras) en `src/config/branding.js`; reutiliza esos tokens en nuevos componentes.

## 👤 Usuario por Defecto- Páginas (`src/pages/*.jsx`) consumen la API sin normalizar datos adicionales —respeta la estructura `{ data: ... }` esperada para evitar errores.

Si ejecutaste el seed, puedes iniciar sesión con:## Documentación

- **Email**: `admin@ferreteria.com`

- **Contraseña**: `admin123`- Arquitectura: `docs/Arquitectura.md`

- Manual de usuario: `docs/ManualUsuario.md`

## 📁 Estructura del Proyecto- Branding y lineamientos visuales: `docs/Branding.md`

- Plan de calidad y mejoras profesionales: en la raíz (`PROFESSIONAL_IMPROVEMENTS.md`, `ACTUALIZACION_COMPLETADA.md`, etc.)

```

erp-ferreteria-rc/## 🚀 Despliegue en la Nube

El proyecto soporta múltiples plataformas de despliegue. **Recomendamos Supabase** para la mejor experiencia gratuita.

### 🏆 Opción Recomendada: Supabase TODO-EN-UNO

**Ventajas:**
- ✅ Base de datos PostgreSQL gratis (500MB)
- ✅ Sin hibernación en la DB
- ✅ Backend + Frontend en un solo lugar
- ✅ 100% gratuito para proyectos pequeños

**Costo:** $0/mes | **Guía completa:** [SUPABASE-DEPLOY.md](SUPABASE-DEPLOY.md)

### Otras Opciones

- **Railway**: PostgreSQL + Backend (~$5/mes) - [Ver guía](RAILWAY-DEPLOY.md)
- **Render**: PostgreSQL + Backend gratis (con hibernación) - [Ver guía](RENDER-DEPLOY.md)

## Contribuir

1. Crea un branch descriptivo (ej. `feature/invoice-filter`).
2. Asegúrate de ejecutar linters/formateadores en backend y frontend.
3. Agrega/actualiza seeds o scripts SQL cuando cambien modelos.
4. Abre un Pull Request enlazando tareas/jiras y describe pruebas manuales.

## Licencia

Distribuido bajo licencia [MIT](LICENSE).

│   ├── uploads/                # Archivos subidos
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── componentes/        # Componentes reutilizables
│   │   ├── paginas/            # Páginas principales
│   │   ├── contexto/           # Context API (Auth)
│   │   ├── servicios/          # API client
│   │   └── App.jsx             # Componente raíz
│   └── package.json
│
├── basedatos/
│   ├── init.sql                # Schema de la base de datos
│   └── seed.sql                # Datos de ejemplo
│
└── documentacion/              # Documentación adicional
```

## 🔧 Scripts Disponibles

### Backend

```bash
npm run dev        # Desarrollo con nodemon
npm start          # Producción
npm run lint       # Linter
npm run format     # Formatear código
```

### Frontend

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
npm run lint       # Linter
```

## 🌐 Guías de despliegue

- **[Supabase (TODO-EN-UNO) 🏆](SUPABASE-DEPLOY.md)** - Base de datos + Backend + Frontend (GRATIS, sin hibernación)
- [Railway](RAILWAY-DEPLOY.md) - PostgreSQL + Backend (requiere pago)
- [Render](RENDER-DEPLOY.md) - PostgreSQL + Backend (gratis con hibernación)

## 📸 Capturas de Pantalla

### Panel de Control

Dashboard con gráficos estadísticos en tiempo real, tendencias de ventas y KPIs principales.

### Gestión de Productos

Catálogo completo con imágenes, categorías, precios y control de stock.

### Ventas

Sistema de punto de venta con selección de productos, clientes y generación de facturas.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**ZMartin0321**

## 🙏 Agradecimientos

- Diseño inspirado en sistemas modernos de gestión
- Iconos y assets de código abierto
- Comunidad de React y Node.js

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!
