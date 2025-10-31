# Guía de Contribución

¡Gracias por tu interés en contribuir al ERP Ferretería RC! 🎉

## Cómo Contribuir

### 1. Reportar Problemas

Si encuentras un bug o tienes una sugerencia:

1. Verifica que no exista un issue similar
2. Abre un nuevo issue con una descripción clara
3. Incluye pasos para reproducir el problema (si es un bug)
4. Agrega capturas de pantalla si es relevante

### 2. Proponer Cambios

#### Configuración del Entorno

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd erp-ferreteria-rc

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

#### Crear una Rama

```bash
git checkout -b feature/nombre-de-tu-feature
# o
git checkout -b fix/descripcion-del-fix
```

### 3. Estándares de Código

#### Backend (Node.js/Express)

- Usa ESLint y Prettier configurados en el proyecto
- Ejecuta `npm run lint` antes de hacer commit
- Escribe comentarios JSDoc para funciones públicas
- Maneja errores apropiadamente con try-catch

```javascript
/**
 * Descripción de la función
 * @param {Type} param - Descripción del parámetro
 * @returns {Type} Descripción del retorno
 */
```

#### Frontend (React)

- Usa componentes funcionales con hooks
- Mantén los componentes pequeños y reutilizables
- Usa nombres descriptivos en español neutro
- Ejecuta `npm run lint` antes de hacer commit

#### Commits

Usa mensajes de commit descriptivos:

```
tipo: descripción breve

Descripción más detallada si es necesario

Ejemplos de tipos:
- feat: Nueva funcionalidad
- fix: Corrección de bug
- docs: Cambios en documentación
- style: Formato, punto y coma faltante, etc
- refactor: Refactorización de código
- test: Agregar o modificar tests
- chore: Mantenimiento
```

### 4. Testing

- Escribe tests para nuevas funcionalidades
- Asegúrate de que todos los tests pasen: `npm test`
- Mantén la cobertura de código arriba del 70%

### 5. Pull Request

1. Actualiza tu rama con la última versión de `main`
2. Ejecuta los tests y linters
3. Abre un Pull Request con:
   - Título descriptivo
   - Descripción de los cambios
   - Referencias a issues relacionados
   - Capturas de pantalla (si aplica)

### 6. Revisión de Código

- Responde a los comentarios de forma constructiva
- Realiza los cambios solicitados
- Marca las conversaciones como resueltas

## Estructura del Proyecto

```
erp-ferreteria-rc/
├── backend/          # API REST con Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── services/
│   └── tests/
├── frontend/         # Aplicación React
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       └── services/
└── database/         # Scripts SQL
```

## Código de Conducta

- Sé respetuoso y profesional
- Acepta críticas constructivas
- Enfócate en lo mejor para el proyecto
- Ayuda a otros contribuidores

## Preguntas

Si tienes preguntas, abre un issue con la etiqueta `question`.

---

¡Gracias por contribuir! 🚀
