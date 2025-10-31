/**
 * Utilidades de respuesta HTTP estandarizadas
 */

class ApiResponse {
  /**
   * Respuesta exitosa
   */
  static success(res, data, message = "Operación exitosa", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Respuesta de error
   */
  static error(
    res,
    message = "Ocurrió un error",
    statusCode = 500,
    error = null
  ) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };

    if (error && process.env.NODE_ENV === "development") {
      response.error = error;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Respuesta de validación fallida
   */
  static validationError(res, errors) {
    return res.status(400).json({
      success: false,
      message: "Error de validación",
      errors,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Respuesta de no autorizado
   */
  static unauthorized(res, message = "No autorizado") {
    return res.status(401).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Respuesta de prohibido
   */
  static forbidden(res, message = "Acceso prohibido") {
    return res.status(403).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Respuesta de no encontrado
   */
  static notFound(res, message = "Recurso no encontrado") {
    return res.status(404).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = ApiResponse;
