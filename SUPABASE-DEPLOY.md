# 🚀 Guía de Despliegue en Supabase

Despliegue completo del ERP Ferretería en Supabase (Base de datos + Backend + Frontend).

---

## 📋 Requisitos Previos

- Cuenta en [Supabase](https://supabase.com) (gratis)
- Cuenta en [Vercel](https://vercel.com) o [Netlify](https://netlify.com) para frontend
- Código en GitHub (ya lo tienes)
- Node.js instalado localmente

---

## 🗄️ PASO 1: Crear Base de Datos PostgreSQL en Supabase

### 1.1 Crear Proyecto

1. Ve a [https://supabase.com](https://supabase.com)
2. Click en **"Start your project"** o **"New Project"**
3. Configura:
   - **Name**: `erp-ferreteria-rc`
   - **Database Password**: Guarda esta contraseña (la necesitarás)
   - **Region**: Elige la más cercana (ej: `South America (São Paulo)`)
   - **Pricing Plan**: Free
4. Click **"Create new project"**
5. Espera 2-3 minutos mientras se provisiona

### 1.2 Obtener Credenciales de Conexión

1. En tu proyecto, ve a **Settings** → **Database**
2. Busca la sección **"Connection string"**
3. Copia el **URI** en modo **"URI"** (será algo como):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
4. Reemplaza `[YOUR-PASSWORD]` con la contraseña que guardaste

### 1.3 Inicializar la Base de Datos

**Opción A: Desde el SQL Editor de Supabase (MÁS FÁCIL)**

1. En Supabase, ve a **SQL Editor**
2. Click en **"New query"**
3. Copia y pega el contenido completo de `basedatos/init-postgres.sql`
4. Click **"Run"** (espera que termine)
5. Crea otra query nueva
6. Copia y pega el contenido de `basedatos/seed-postgres.sql`
7. Click **"Run"**

**Opción B: Desde tu terminal local**

```powershell
# Instala psql si no lo tienes
# Luego conecta con tu URI:

psql "postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres"

# Una vez conectado:
\i 'C:/Users/HP/Desktop/FerreteriaERP/erp-ferreteria-rc/basedatos/init-postgres.sql'
\i 'C:/Users/HP/Desktop/FerreteriaERP/erp-ferreteria-rc/basedatos/seed-postgres.sql'
\q
```

### 1.4 Verificar Datos

En Supabase:

1. Ve a **Table Editor**
2. Deberías ver todas las tablas: `users`, `products`, `categories`, etc.
3. Click en `products` → deberías ver ~50 productos

---

## 🖥️ PASO 2: Desplegar Backend (Express API)

### 2.1 Preparar Variables de Entorno

Crea/actualiza `backend/.env` con tus credenciales de Supabase:

```env
# Base de datos Supabase
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASS=tu_password_aqui
DB_NAME=postgres

# JWT
JWT_SECRET=tu_secreto_super_seguro_cambialo_123

# Entorno
NODE_ENV=production
PORT=4000

# CORS - actualizar después con URL del frontend
FRONTEND_URL=http://localhost:5173
```

### 2.2 Opciones para Desplegar Backend

**Opción A: Render (RECOMENDADO - ya tienes la guía)**

Sigue `RENDER-DEPLOY.md` pero usa las credenciales de Supabase en lugar de crear una DB en Render:

1. Salta la sección de crear PostgreSQL en Render
2. En **Environment Variables**, usa las credenciales de Supabase
3. Ya no necesitas ejecutar el init.sql (ya lo hiciste en Supabase)

**Opción B: Railway**

Sigue `RAILWAY-DEPLOY.md` usando credenciales de Supabase.

**Opción C: Vercel (con adaptación serverless)**

Requiere convertir Express a funciones serverless (más complejo, no recomendado).

### 2.3 Actualizar FRONTEND_URL

Una vez desplegado el backend, copia la URL (ej: `https://erp-ferreteria-api.onrender.com`) y actualízala en las variables de entorno.

---

## 🌐 PASO 3: Desplegar Frontend (React/Vite)

### 3.1 Preparar Frontend

1. Actualiza `frontend/.env`:

   ```env
   VITE_API_URL=https://tu-backend.onrender.com/api
   ```

2. Commit y push:
   ```powershell
   git add .
   git commit -m "Configure Supabase connection"
   git push origin master
   ```

### 3.2 Desplegar en Vercel

1. Ve a [https://vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Importa tu repositorio de GitHub
4. Configura:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL` = `https://tu-backend.onrender.com/api`
5. Click **"Deploy"**
6. Espera 1-2 minutos

### 3.3 Actualizar CORS en Backend

1. Copia la URL de Vercel (ej: `https://erp-ferreteria.vercel.app`)
2. Actualiza `FRONTEND_URL` en las variables de entorno del backend
3. Redeploy el backend para aplicar cambios

---

## ✅ PASO 4: Verificación Final

### 4.1 Probar Backend

```powershell
# Reemplaza con tu URL de backend
curl https://tu-backend.onrender.com/api

# Debería responder con la lista de endpoints
```

### 4.2 Probar Frontend

1. Abre tu URL de Vercel
2. Intenta hacer login:
   - Email: `admin@ferreteria.com`
   - Password: `admin123`
3. Verifica que cargue el dashboard con datos

### 4.3 Probar Flujo Completo

- ✅ Login funciona
- ✅ Dashboard muestra gráficas
- ✅ Productos se cargan
- ✅ Puedes crear una venta
- ✅ PDF de factura se genera

---

## 🎯 Arquitectura Final

```
┌─────────────────────────────────────────┐
│         SUPABASE (PostgreSQL)           │
│   - Todos los datos del ERP             │
│   - 500MB gratis, sin hibernación       │
└──────────────┬──────────────────────────┘
               │ Puerto 5432 (SSL)
               ↓
┌─────────────────────────────────────────┐
│      RENDER (Backend Express)           │
│   - API REST en /api                    │
│   - Sequelize ORM                       │
│   - Autenticación JWT                   │
└──────────────┬──────────────────────────┘
               │ HTTPS
               ↓
┌─────────────────────────────────────────┐
│       VERCEL (Frontend React)           │
│   - Dashboard con TailwindCSS           │
│   - Gráficas con Recharts               │
│   - CDN Global                          │
└─────────────────────────────────────────┘
```

---

## 💰 Costos

| Servicio     | Uso                        | Plan | Costo         |
| ------------ | -------------------------- | ---- | ------------- |
| **Supabase** | PostgreSQL 500MB           | Free | $0/mes        |
| **Render**   | Backend (hiberna)          | Free | $0/mes        |
| **Vercel**   | Frontend 100GB ancho banda | Free | $0/mes        |
| **TOTAL**    | -                          | -    | **$0/mes** ✅ |

### Límites del Plan Gratuito

- **Supabase**: 500MB DB, 1GB storage, 2GB transferencia
- **Render**: Hiberna tras 15 min inactividad (tarda ~30s en despertar)
- **Vercel**: 100GB bandwidth, despliegues ilimitados

---

## 🔧 Troubleshooting

### Error: "ECONNREFUSED" al conectar a Supabase

- Verifica que copiaste bien el host: `db.xxxxx.supabase.co`
- Confirma que SSL está habilitado en `backend/src/configuracion/db.js`
- Revisa que el password no tenga caracteres especiales sin escapar

### Error: CORS en producción

- Verifica que `FRONTEND_URL` en backend coincida exactamente con la URL de Vercel
- Incluye `https://` y sin `/` al final
- Redeploy el backend después de cambiar

### Backend hiberna en Render

Es normal en el plan gratuito. Opciones:

1. Acepta los ~30s de espera en la primera carga
2. Usa un servicio de ping cada 14 minutos (ej: UptimeRobot)
3. Migra a plan de pago ($7/mes sin hibernación)

### Imágenes no cargan

- Asegúrate que `uploads/productos` existe en el backend
- Verifica que las URLs en `images` de productos sean accesibles
- Considera usar Supabase Storage para imágenes (gratis 1GB)

---

## 🚀 Siguientes Pasos

1. **Migrar imágenes a Supabase Storage**:

   - Sube imágenes de productos a Supabase Storage
   - Actualiza URLs en la DB
   - Elimina carpeta `uploads/` del backend

2. **Configurar backups**:

   - Supabase hace backups diarios automáticos (plan gratuito: 7 días)
   - Exporta manualmente 1 vez/semana para seguridad extra

3. **Monitoreo**:
   - Configura alertas en Supabase (Settings → Alerts)
   - Usa Vercel Analytics para métricas del frontend

---

## 📞 Soporte

- Supabase Docs: https://supabase.com/docs
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs

---

**¡Listo!** Tu ERP está 100% en la nube, gratis y sin hibernación en la base de datos. 🎉
