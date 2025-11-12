const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../modelos");

/**
 * Registra un nuevo usuario en el sistema
 * @route POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validar si el email ya está registrado
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({
        error: "Email duplicado",
        message: "El email ya está registrado en el sistema",
      });
    }

    // Hash de la contraseña
    const hashed = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "user",
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Autentica un usuario y devuelve un token JWT
 * @route POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        error: "Autenticación fallida",
        message: "Credenciales inválidas",
      });
    }

    // Verificar contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({
        error: "Autenticación fallida",
        message: "Credenciales inválidas",
      });
    }

    // Generar token
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "clave_segura", {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: payload,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
