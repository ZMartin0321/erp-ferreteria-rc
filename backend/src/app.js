require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./modelos");
const routes = require("./rutas");
const {
  errorHandler,
  notFoundHandler,
} = require("./intermediarios/manejadorErrores");

const app = express();

// Configuración de CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Middlewares de parseo
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes de productos)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Logging de requests en desarrollo
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Rutas de la API
app.use("/api", routes);

// Ruta de health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Manejo de rutas no encontradas
app.use(notFoundHandler);

// Manejo centralizado de errores
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

// Inicialización de la base de datos y servidor
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✓ Conexión a base de datos establecida");

    await sequelize.sync();
    console.log("✓ Modelos sincronizados");

    app.listen(PORT, () => {
      console.log(`✓ Servidor ejecutándose en puerto ${PORT}`);
      console.log(`✓ Ambiente: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (err) {
    console.error("✗ Error al iniciar el servidor:", err);
    process.exit(1);
  }
};

// Manejo de señales de terminación
process.on("SIGTERM", async () => {
  console.log("SIGTERM recibido, cerrando servidor...");
  await sequelize.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT recibido, cerrando servidor...");
  await sequelize.close();
  process.exit(0);
});

// Solo iniciar si no es un entorno de testing
if (process.env.NODE_ENV !== "test") {
  startServer();
}

module.exports = app;
