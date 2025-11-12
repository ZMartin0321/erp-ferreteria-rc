# Railway Deployment Guide for ERP Ferretería RC

## 🚀 Pasos para Desplegar en Railway

### 1. Preparar el Repositorio

Asegúrate de que tu código esté en GitHub:

```bash
git add .
git commit -m "Configuración para Railway"
git push origin master
```

### 2. Crear Cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Haz clic en "Start a New Project"
3. Inicia sesión con tu cuenta de GitHub
4. Autoriza a Railway para acceder a tus repositorios

### 3. Crear Proyecto desde GitHub

1. En Railway, haz clic en "Deploy from GitHub repo"
2. Selecciona el repositorio `erp-ferreteria-rc`
3. Railway detectará automáticamente que es un proyecto Node.js

### 4. Agregar Base de Datos MySQL

1. En tu proyecto de Railway, haz clic en "+ New"
2. Selecciona "Database" → "Add MySQL"
3. Railway creará una base de datos MySQL automáticamente
4. Copia las credenciales que aparecen (las necesitarás en el siguiente paso)

### 5. Configurar Variables de Entorno

En el servicio del backend, ve a "Variables" y agrega:

```env
# Base de Datos (Railway te da estas automáticamente al agregar MySQL)
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}

# Puerto
PORT=4000

# JWT Secret (genera uno aleatorio)
JWT_SECRET=tu-secreto-super-seguro-cambiar-en-produccion-12345

# Frontend URL (lo obtendrás después del primer deploy)
FRONTEND_URL=https://tu-frontend.up.railway.app

# Node Environment
NODE_ENV=production
```

### 6. Configurar el Frontend

1. En Railway, haz clic en "+ New" → "Empty Service"
2. Conéctalo al mismo repositorio GitHub
3. En "Settings" → "Root Directory" → pon `frontend`
4. En "Settings" → "Build Command" → pon `npm run build`
5. En "Settings" → "Start Command" → pon `npx serve -s dist -p $PORT`

En Variables del frontend agrega:

```env
VITE_API_URL=https://tu-backend.up.railway.app/api
```

### 7. Inicializar la Base de Datos

Una vez que el backend esté desplegado:

1. Ve al servicio MySQL en Railway
2. Haz clic en "Data" → "Query"
3. Ejecuta el contenido del archivo `basedatos/init.sql`
4. Luego ejecuta el contenido de `basedatos/seed.sql`

O conéctate vía MySQL Workbench usando las credenciales de Railway.

### 8. Actualizar las URLs

1. Copia la URL pública del backend (ej: `https://erp-backend.up.railway.app`)
2. Actualiza la variable `VITE_API_URL` en el frontend
3. Copia la URL pública del frontend (ej: `https://erp-frontend.up.railway.app`)
4. Actualiza la variable `FRONTEND_URL` en el backend
5. Redeploya ambos servicios

### 9. Verificar el Despliegue

1. Abre la URL del frontend en tu navegador
2. Intenta iniciar sesión con:
   - Email: `admin@ferreteria.com`
   - Password: `admin123`
3. Verifica que todas las funciones trabajen correctamente

## 📊 Estructura del Proyecto en Railway

```
Tu Proyecto Railway
├── Backend Service (Node.js)
│   ├── Root Directory: backend/
│   ├── Build Command: npm install
│   ├── Start Command: npm start
│   └── Port: 4000
│
├── Frontend Service (Vite)
│   ├── Root Directory: frontend/
│   ├── Build Command: npm run build
│   ├── Start Command: npx serve -s dist -p $PORT
│   └── Port: auto
│
└── MySQL Database
    ├── Auto-provisioned by Railway
    └── Credenciales en variables de entorno
```

## 🔧 Comandos Útiles

**Ver logs en tiempo real:**

- Haz clic en el servicio → pestaña "Deployments" → click en el deployment activo

**Reiniciar un servicio:**

- Settings → Restart

**Variables de entorno:**

- Variables → Add Variable

## 💰 Costos Estimados

- **Plan Hobby (Gratis):** $5 de crédito mensual gratis
- **Plan Developer:** $5/mes por servicio
- Base de datos MySQL incluida en el plan

Tu proyecto debería costar ~$0-10/mes dependiendo del tráfico.

## 🆘 Problemas Comunes

### Error: "Cannot connect to database"

- Verifica que las variables `DB_*` estén correctamente configuradas
- Asegúrate de usar las variables de Railway: `${{MySQL.MYSQLHOST}}`

### Error: "CORS policy"

- Verifica que `FRONTEND_URL` en el backend sea la URL correcta del frontend
- Debe incluir `https://` y NO terminar en `/`

### Frontend no carga datos

- Verifica que `VITE_API_URL` apunte al backend correcto
- Debe incluir `/api` al final

### Uploads no funcionan

- Railway tiene sistema de archivos efímero
- Considera usar Cloudinary o AWS S3 para archivos estáticos

## 📝 Próximos Pasos Recomendados

1. **Configurar dominio personalizado** (ej: erp.tuferreteria.com)
2. **Configurar backups automáticos** de la base de datos
3. **Implementar almacenamiento en la nube** para imágenes de productos
4. **Configurar monitoring** y alertas
5. **Implementar CI/CD** para deploys automáticos desde GitHub

## 🎉 ¡Listo!

Tu ERP ya está funcionando en la nube con:

- ✅ HTTPS automático
- ✅ Base de datos MySQL gestionada
- ✅ Deploy automático desde GitHub
- ✅ Escalabilidad automática
- ✅ Logs en tiempo real

¡Ahora tu ferretería puede operar desde cualquier lugar! 🚀
