/**
 * Middleware centralizado para manejo de errores
 * Proporciona respuestas consistentes y logging
 */

const errorHandler = (err, req, res, next) => {
  // Log del error para debugging
  console.error("Error capturado:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Errores de validación de Sequelize
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      error: "Error de validación",
      message: "Los datos proporcionados no son válidos",
      details: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Errores de clave única (duplicados)
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      error: "Conflicto de datos",
      message: "Ya existe un registro con estos datos",
      details: err.errors.map((e) => e.path),
    });
  }

  // Errores de clave foránea
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      error: "Referencia inválida",
      message: "El registro referenciado no existe",
    });
  }

  // Errores de base de datos generales
  if (err.name && err.name.startsWith("Sequelize")) {
    return res.status(500).json({
      error: "Error de base de datos",
      message: "Ocurrió un error al procesar la solicitud",
    });
  }

  // Errores de JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Token inválido",
      message: "La sesión no es válida",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Token expirado",
      message: "La sesión ha expirado, por favor inicie sesión nuevamente",
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    error: err.name || "Error del servidor",
    message: err.message || "Ocurrió un error inesperado",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Middleware para rutas no encontradas
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    message: `La ruta ${req.method} ${req.path} no existe`,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
