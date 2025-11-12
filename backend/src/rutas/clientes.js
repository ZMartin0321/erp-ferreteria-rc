const express = require("express");
const router = express.Router();
const controller = require("../controladores/controladorClientes");
const { verifyToken } = require("../intermediarios/middlewareAutenticacion");
const {
  validateRequired,
  validateIdParam,
} = require("../intermediarios/middlewareValidacion");

// Listar clientes
router.get("/", verifyToken, controller.list);

// Obtener cliente por ID
router.get("/:id", verifyToken, validateIdParam, controller.getById);

// Obtener estadísticas del cliente
router.get("/:id/stats", verifyToken, validateIdParam, controller.getStats);

// Crear nuevo cliente
router.post("/", verifyToken, validateRequired(["name"]), controller.create);

// Actualizar cliente
router.put("/:id", verifyToken, validateIdParam, controller.update);

// Eliminar cliente
router.delete("/:id", verifyToken, validateIdParam, controller.remove);

module.exports = router;
