**Project Snapshot**

- `backend/` runs an Express + Sequelize REST API at `/api`; `frontend/` is a Vite/React dashboard; the SQL schema and seeds live in `database/`.
- The app targets MySQL/MariaDB; `.env` values mirror `backend/.env.example`, while the client reads `VITE_API_URL`.
- CORS is restricted to `FRONTEND_URL` (`backend/src/app.js`); keep it aligned when exposing new hosts.

**Setup & Data**

- Initialize the DB with `database/init.sql` and `database/seed.sql`; run `node backend/update-database.js` to drop/reseed quickly.
- Backend dev cycle: `cd backend; npm install; npm run dev`; frontend: `cd frontend; npm run dev`.
- Tests rely on MySQL; set `NODE_ENV=test` so `backend/src/app.js` skips `app.listen()` when Jest imports the app.

**Backend Guide**

- Express setup in `backend/src/app.js` wires `/api`, loads middlewares, and calls `sequelize.sync()`; wrap async handlers in try/catch + `next(err)` so `middleware/errorHandler.js` formats responses.
- Route modules in `backend/src/routes` map to controllers (e.g., `routes/products.js` ⇔ `controllers/productsController.js`) and typically enforce `verifyToken`; reuse `validationMiddleware` helpers for required fields or positive numbers.
- Controllers respond with `{ message, data, ... }`; consumers (e.g., `frontend/src/pages/Products.jsx`) expect nested `data` payloads.
- Models live in `backend/src/models/*.js` and must be registered + associated in `models/index.js`; existing associations cover Products⇔Sales/Purchases/Quotations.
- Inventory adjustments go through `services/inventoryService.js`; reuse `updateStock`/`checkStock` when changing stock logic for purchases or sales.
- PDF endpoints (`reportsController.invoicePDF`) stream via `services/pdfService.js`; set headers before piping and avoid sending extra JSON.

**Backend Tooling**

- Jest tests sit in `backend/src/tests` (`npm test`); they import `app`, so avoid side effects at module scope.
- Linters: `npm run lint`/`lint:fix` and `npm run format` target `src/**/*.js`.
- Smoke scripts (`backend/test-api.js`, `backend/test-crud.js`, etc.) assume the server runs on port 4000 with seeded admin credentials.

**Frontend Guide**

- Axios instance in `frontend/src/services/api.js` applies auth headers and handles 401 by clearing `localStorage` + redirect; align new API calls with this wrapper.
- Auth state persists via `AuthContext` (`frontend/src/context/AuthContext.jsx`) and `ProtectedRoute`; backend must return `{ token, user }` on login.
- Pages under `frontend/src/pages` often consume the raw axios instance (`api`), so adjust backend response shapes carefully (e.g., `Products.jsx` reads `response.data.data`).
- Shared UI primitives in `frontend/src/components` (e.g., `Modal`, `Table`, `Button`) implement Tailwind-heavy styling; keep gradients/emojis consistent.
- Brand palette and gradients live in `frontend/src/config/branding.js`; pull colors/icons from there instead of hardcoding.

**Operational Tips**

- Update `FRONTEND_URL` when serving the client from another origin to avoid CORS failures.
- When adding endpoints, register them in `backend/src/routes/index.js` so the API index advertises them.
- For new entities, extend both Sequelize models and the SQL scripts in `database/init.sql`/`seed.sql` to keep schema and seeds aligned.
- To sanity-check the API, seed the DB then run `node backend/test-api.js`; it exercises auth, catalog, sales, purchases, and reports flows.
