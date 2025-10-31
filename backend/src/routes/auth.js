const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const {
  validateRequired,
  validateEmail,
  validatePassword,
} = require("../middleware/validationMiddleware");

// Registro de usuario
router.post(
  "/register",
  validateRequired(["name", "email", "password"]),
  validateEmail,
  validatePassword,
  register
);

// Inicio de sesión
router.post(
  "/login",
  validateRequired(["email", "password"]),
  validateEmail,
  login
);

module.exports = router;
