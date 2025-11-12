# 🚂 Checklist de Despliegue en Railway

## ✅ Antes de Empezar

- [ ] Código funciona correctamente en local
- [ ] `.env` no está subido a GitHub (está en `.gitignore`)
- [ ] Todos los cambios están commiteados
- [ ] Push al repositorio de GitHub

## 📋 Pasos de Despliegue

### 1️⃣ Configurar Railway (5 minutos)

- [ ] Crear cuenta en https://railway.app
- [ ] Conectar con GitHub
- [ ] Crear nuevo proyecto
- [ ] Seleccionar repositorio `erp-ferreteria-rc`

### 2️⃣ Agregar Base de Datos MySQL (2 minutos)

- [ ] Click en "+ New" → "Database" → "Add MySQL"
- [ ] Esperar a que se provisione (1-2 minutos)
- [ ] Copiar credenciales (las usaremos después)

### 3️⃣ Configurar Backend (5 minutos)

- [ ] Railway detecta automáticamente el servicio Node.js
- [ ] Ir a "Variables" y agregar:

```env
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
PORT=4000
NODE_ENV=production
JWT_SECRET=[GENERA-UNO-ALEATORIO-AQUI]
FRONTEND_URL=https://[PENDIENTE]
```

- [ ] Click en "Deploy" (esperar 2-3 minutos)
- [ ] Copiar la URL pública del backend (ej: `https://backend-xyz.up.railway.app`)

### 4️⃣ Configurar Frontend (5 minutos)

- [ ] Click en "+ New" → "Empty Service"
- [ ] Conectar al mismo repositorio GitHub
- [ ] Settings → "Root Directory" → `frontend`
- [ ] Settings → "Build Command" → `npm run build`
- [ ] Settings → "Start Command" → `npx serve -s dist -p $PORT`
- [ ] Variables → Agregar:

```env
VITE_API_URL=https://[URL-DEL-BACKEND]/api
```

- [ ] Click en "Deploy" (esperar 2-3 minutos)
- [ ] Copiar la URL pública del frontend (ej: `https://frontend-abc.up.railway.app`)

### 5️⃣ Actualizar URLs Cruzadas (2 minutos)

- [ ] Volver al backend → Variables
- [ ] Actualizar `FRONTEND_URL` con la URL real del frontend
- [ ] El backend se redesplega automáticamente

### 6️⃣ Inicializar Base de Datos (3 minutos)

**Opción A: Desde Railway Query Editor**

- [ ] Ir al servicio MySQL → "Data" → "Query"
- [ ] Copiar y pegar contenido de `basedatos/init.sql`
- [ ] Ejecutar
- [ ] Copiar y pegar contenido de `basedatos/seed.sql`
- [ ] Ejecutar

**Opción B: Desde MySQL Workbench**

- [ ] Conectar con las credenciales de Railway
- [ ] Ejecutar `basedatos/init.sql`
- [ ] Ejecutar `basedatos/seed.sql`

**Opción C: Script automático**

- [ ] En Railway, ir al backend → "Settings" → "Deploy Trigger"
- [ ] Ejecutar: `npm run init-db` (solo una vez)

### 7️⃣ Verificar Funcionamiento (5 minutos)

- [ ] Abrir la URL del frontend en el navegador
- [ ] Verificar que carga correctamente (sin errores 404 o CORS)
- [ ] Intentar iniciar sesión:
  - Email: `admin@ferreteria.com`
  - Password: `admin123`
- [ ] Verificar que el dashboard carga datos
- [ ] Probar crear un producto
- [ ] Probar crear una venta
- [ ] Verificar generación de PDF de factura

### 8️⃣ Configuraciones Opcionales

- [ ] Configurar dominio personalizado (ej: `erp.tuferreteria.com`)
- [ ] Configurar backups automáticos de la BD
- [ ] Configurar alertas de errores
- [ ] Agregar monitoreo de uptime

## 🔧 Solución de Problemas

### ❌ Error: "Cannot connect to database"

- Verifica que las variables `DB_*` usen el formato `${{MySQL.VARIABLE}}`
- Reinicia el backend desde Railway

### ❌ Error: "CORS policy"

- Verifica que `FRONTEND_URL` en el backend sea exactamente la URL del frontend
- No debe terminar en `/`
- Debe incluir `https://`

### ❌ Frontend muestra pantalla blanca

- Verifica que `VITE_API_URL` apunte al backend correcto
- Debe terminar en `/api`
- Revisa los logs del frontend en Railway

### ❌ Error 404 en las rutas del frontend

- Asegúrate de que el Start Command sea: `npx serve -s dist -p $PORT`
- El flag `-s` es importante para SPA (Single Page Apps)

### ❌ Imágenes de productos no se guardan

- Railway tiene sistema de archivos efímero
- Considera migrar a Cloudinary o AWS S3

## 📊 Costos Estimados

| Plan          | Precio          | Incluye                    |
| ------------- | --------------- | -------------------------- |
| **Hobby**     | Gratis          | $5 crédito/mes, 1 servicio |
| **Developer** | $5/servicio/mes | Ilimitado                  |
| **Team**      | $20/mes         | 10 servicios, 20GB RAM     |

**Tu proyecto necesita:**

- 1 servicio backend (~$5/mes)
- 1 servicio frontend (~$5/mes)
- 1 base de datos MySQL (incluida)

**Total estimado: $0-10/mes** dependiendo del uso

## 🎉 ¡Listo!

Una vez completados todos los pasos, tu ERP estará funcionando en:

- **Frontend:** `https://tu-frontend.up.railway.app`
- **Backend API:** `https://tu-backend.up.railway.app/api`
- **Base de Datos:** Gestionada por Railway

### URLs de Ejemplo:

- Dashboard: `https://tu-frontend.up.railway.app/dashboard`
- Login: `https://tu-frontend.up.railway.app/login`
- API Health: `https://tu-backend.up.railway.app/api`
- Productos: `https://tu-backend.up.railway.app/api/products`

---

**Tiempo total estimado:** 25-30 minutos

**Nivel de dificultad:** ⭐⭐☆☆☆ (Fácil)

**Soporte:** https://docs.railway.app
