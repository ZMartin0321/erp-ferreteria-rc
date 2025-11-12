# Arquitectura - ERP Ferretería RC

Arquitectura propuesta:

- Monorepo con `backend/` (Express + Sequelize) y `frontend/` (React + Vite + Tailwind).
- Base de datos MariaDB/MySQL.
- Comunicación: REST API con JSON, autenticación JWT.
- Separación por capas: controllers, services, models, routes, middleware.

Componentes:

- Backend: API RESTful y generación de reportes (PDF en siguiente fases).
- Frontend: UI React con rutas protegidas y dashboard con gráficos.

Escalabilidad y calidad:

- Pool de conexiones en Sequelize, cache posible (Redis) para KPIs.
- Tests con Jest/Supertest.
