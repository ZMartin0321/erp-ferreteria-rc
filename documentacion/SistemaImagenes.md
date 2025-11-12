# Sistema de Imágenes de Productos

## 📸 Características

- Subida de imágenes para cada producto
- Soporte para múltiples formatos: JPG, PNG, GIF, WEBP
- Tamaño máximo: 5MB por imagen
- Almacenamiento local en el servidor
- Visualización automática en la tabla de productos

## 🚀 Uso

### Frontend

1. **Ver imagen del producto**: Las imágenes se muestran automáticamente en la tabla de productos
2. **Subir imagen**: Click en el botón 📷 en la fila del producto
3. **Eliminar imagen**: Disponible en el modal de detalle del producto

### Backend

#### Endpoints

**Subir imagen:**

```
POST /api/products/:id/imagen
Content-Type: multipart/form-data
Body: imagen (archivo)
```

**Eliminar imagen:**

```
DELETE /api/products/:id/imagen
Body: { imageUrl: string }
```

## 📁 Estructura de Archivos

```
backend/
  uploads/
    productos/        # Imágenes de productos
      nombre-123456.jpg
      nombre-789012.png
  src/
    intermediarios/
      subirArchivos.js  # Configuración de multer
    controladores/
      controladorProductos.js  # Lógica de imágenes
```

## 🔧 Configuración

El sistema está configurado para:

- Crear automáticamente el directorio `uploads/productos` si no existe
- Generar nombres únicos para cada imagen (timestamp + random)
- Validar tipos de archivo permitidos
- Limitar tamaño máximo a 5MB

## 🌐 Variables de Entorno

Asegúrate de configurar en el frontend:

```env
VITE_API_URL=http://localhost:4000
```

## 💡 Notas

- Las imágenes se almacenan localmente en el servidor
- Para producción, considera usar un servicio de almacenamiento en la nube (AWS S3, Cloudinary, etc.)
- El campo `images` en el modelo de Product es un array JSON que puede contener múltiples URLs
