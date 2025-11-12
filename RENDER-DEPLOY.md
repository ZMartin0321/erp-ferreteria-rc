# Render Deployment Guide for ERP Ferretería RC

Esta guía te ayuda a desplegar el backend (Express/Sequelize) y el frontend (Vite/React) en [Render](https://render.com). Sigue los pasos en orden para evitar errores.

---

## 1. Preparar el repositorio

1. Confirma que todo esté versionado en GitHub:
   ```bash
   git add .
   git commit -m "Preparar despliegue en Render"
   git push origin master
   ```
2. Verifica que `backend/.env` y `frontend/.env` **no** estén en el repo (Render usa variables).

---

## 2. Crear cuenta y proyecto en Render

1. Accede a [dashboard.render.com](https://dashboard.render.com).
2. Regístrate o inicia sesión con GitHub.
3. Cuando Render solicite permisos, autoriza el acceso al repositorio `erp-ferreteria-rc`.

> 💡 Si vienes de Railway, Render tiene un plan gratuito con 750 horas/mes por servicio (se apaga si no hay tráfico). Para producción estable necesitarás un plan de pago.

---

## 3. Aprovisionar la base de datos MySQL

1. En el dashboard, pulsa **New +** → **Database** → **MySQL**.
2. Asigna un nombre (ej. `ferreteria-db`) y elige la región más cercana a tus usuarios.
3. Render creará la DB y mostrará las variables automáticamente (`DATABASE_URL`, `DATABASE_HOST`, etc.).
4. Copia estos valores, los necesitarás para el backend.

> ⚠️ El almacenamiento es persistente; el plan gratuito ofrece 256 MB. Para mayores cargas, evalúa un plan o proveedor externo (PlanetScale, Neon, etc.).

---

## 4. Desplegar el backend (Express + Sequelize)

1. Pulsa **New +** → **Web Service** → **Build & deploy from a Git repository**.
2. Elige el repo `erp-ferreteria-rc` y selecciona la rama `master`.
3. En **Basic Settings** define:
   - **Name:** `ferreteria-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Node` (Render autodefine `Node 18 LTS`; puedes cambiar a 20 o 22 si lo prefieres).
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. En **Environment** establece:
   - **Node Version** (opcional): `22` para alinear con tu entorno local.
5. En **Environment Variables**, crea lo siguiente (usa “Add Environment Variable”):

   | Variable       | Valor sugerido                                                              |
   | -------------- | --------------------------------------------------------------------------- |
   | `PORT`         | `4000`                                                                      |
   | `NODE_ENV`     | `production`                                                                |
   | `JWT_SECRET`   | Genera una cadena aleatoria segura                                          |
   | `FRONTEND_URL` | (lo completarás después del deploy del frontend)                            |
   | `DB_HOST`      | `${DATABASE_HOST}` (elige "Use existing secret" y apunta al servicio MySQL) |
   | `DB_PORT`      | `${DATABASE_PORT}`                                                          |
   | `DB_USER`      | `${DATABASE_USER}`                                                          |
   | `DB_PASSWORD`  | `${DATABASE_PASSWORD}`                                                      |
   | `DB_NAME`      | `${DATABASE_NAME}`                                                          |

   > Usa "Link Secret" para referenciar las variables generadas por Render en la base de datos. No copies las credenciales manualmente; así se sincronizan si cambian.

6. Pulsa **Create Web Service** para iniciar el primer deploy. Render tardará unos minutos.

### 4.1. Inicializar la base de datos en Render

1. Abre el servicio MySQL → pestaña **Connect**.
2. Copia el comando `mysql` que Render provee (incluye host, puerto y contraseña).
3. Desde tu terminal local:
   ```bash
   # Ejemplo (sustituye por el comando real que Render entrega)
   mysql -h your-host.render.com -u youruser -p yourdb
   ```
4. Ejecuta los scripts de la carpeta `basedatos/` en este orden:

   ```sql
   SOURCE basedatos/init.sql;
   SOURCE basedatos/seed.sql;
   ```

   > Si usas MySQL Workbench, importa los archivos en el orden indicado.

5. Cuando termines, reinicia el servicio backend en Render (opción **Manual Deploy → Deploy latest commit**).

### 4.2. Advertencia sobre archivos subidos

El backend guarda imágenes en `backend/uploads/`, pero Render usa un sistema de archivos efímero: los archivos desaparecen después de cada redeploy. Opciones:

- Añadir un **Persistent Disk** (servicio de pago).
- Migrar las cargas a un servicio externo (Cloudinary, S3, etc.).

Hasta que lo definas, las cargas nuevas podrían perderse al redeploy.

---

## 5. Desplegar el frontend (Vite + React)

1. Pulsa **New +** → **Static Site** (o **Web Service** si prefieres un contenedor Node).
2. Selecciona el repositorio `erp-ferreteria-rc`.
3. Configura:
   - **Name:** `ferreteria-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. En **Environment Variables** agrega:
   | Variable | Valor |
   | --- | --- |
   | `VITE_API_URL` | `https://<backend-service>.onrender.com/api` |

   > Espera a que el backend tenga URL definitiva (ej. `https://ferreteria-backend.onrender.com`).

5. Pulsa **Create Static Site** para construir y publicar el frontend.

---

## 6. Sincronizar URLs entre servicios

1. Cuando el backend esté activo, copia su URL pública.
2. Regresa al frontend → **Environment** → actualiza `VITE_API_URL` con esa URL (`https://backend.onrender.com/api`). Redeploy obligatorio.
3. Copia la URL pública del frontend (ej. `https://ferreteria-frontend.onrender.com`).
4. Vuelve al backend → **Environment Variables** → actualiza `FRONTEND_URL` con la URL del frontend. Redeploy obligatorio.

> Asegúrate de no incluir una barra final (`/`).

---

## 7. Verificar el despliegue

1. Accede a la URL del frontend.
2. Inicia sesión con (`admin@ferreteria.com` / `admin123`).
3. Crea un producto o venta de prueba y confirma que los datos se guardan en la base de datos Render.
4. Descarga un PDF de factura desde el frontend para validar el servicio de PDFs.

---

## 8. Deploy continuo

- Render construye automáticamente cada vez que haces `git push` a la rama configurada.
- Para revisar logs en tiempo real: abre el servicio → pestaña **Logs**.
- Para redeploy manual: **Manual Deploy → Deploy latest commit**.

---

## 9. Migrar datos existentes

Si tenías datos en Railway:

1. Exporta un dump MySQL desde Railway (`mysqldump` o interfaz).
2. Importa en Render usando `mysql` desde la terminal (mismo comando del paso 4.1).
3. Verifica tablas y relaciones con `SHOW TABLES;` y pruebas funcionales.

---

## 10. Costos estimados en Render

| Servicio        | Plan                      | Costo aproximado                         |
| --------------- | ------------------------- | ---------------------------------------- |
| Backend Node    | Free (autosleep)          | $0 (se suspende tras 15 min sin tráfico) |
| Frontend Static | Free                      | $0                                       |
| MySQL           | Free (256 MB, auto-sleep) | $0                                       |

> Para tráfico constante considera **Starter** o **Pro** (desde ~$7/mes por servicio). MySQL Starter cuesta ~$7/mes.

---

## 11. Siguientes pasos recomendados

1. Configura un dominio personalizado en Render (Settings → Custom Domains).
2. Activa notificaciones de errores (Integrations → Email/Slack).
3. Considera un servicio externo de almacenamiento para `uploads/`.
4. Automatiza backups de MySQL (Render → Backups o scripts programados).

---

¡Listo! Con estos pasos tendrás el ERP Ferretería RC operando en Render con despliegues automáticos desde GitHub. Si necesitas adaptar algo (por ejemplo usar PostgreSQL), avísame y ajustamos Sequelize y los scripts. 🚀
