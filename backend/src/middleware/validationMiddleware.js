/**
 * Middleware de validación de datos de entrada
 * Proporciona validaciones reutilizables para diferentes endpoints
 */

const validateRequired = (fields) => {
  return (req, res, next) => {
    const missing = [];
    
    for (const field of fields) {
      if (!req.body[field]) {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        error: "Validación fallida",
        message: `Campos requeridos faltantes: ${missing.join(", ")}`,
        fields: missing,
      });
    }

    next();
  };
};

const validateEmail = (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return next();
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Validación fallida",
      message: "El formato del email es inválido",
    });
  }

  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;
  
  if (!password) {
    return next();
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: "Validación fallida",
      message: "La contraseña debe tener al menos 6 caracteres",
    });
  }

  next();
};

const validatePositiveNumber = (fields) => {
  return (req, res, next) => {
    for (const field of fields) {
      const value = req.body[field];
      
      if (value !== undefined && value !== null) {
        const num = parseFloat(value);
        
        if (isNaN(num) || num < 0) {
          return res.status(400).json({
            error: "Validación fallida",
            message: `El campo '${field}' debe ser un número positivo`,
          });
        }
      }
    }

    next();
  };
};

const validateIdParam = (req, res, next) => {
  const { id } = req.params;
  const numId = parseInt(id, 10);

  if (isNaN(numId) || numId <= 0) {
    return res.status(400).json({
      error: "Parámetro inválido",
      message: "El ID debe ser un número entero positivo",
    });
  }

  next();
};

module.exports = {
  validateRequired,
  validateEmail,
  validatePassword,
  validatePositiveNumber,
  validateIdParam,
};
