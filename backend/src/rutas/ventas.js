const express = require("express");
const router = express.Router();
const controller = require("../controladores/controladorVentas");
const { verifyToken } = require("../intermediarios/middlewareAutenticacion");

// Estadísticas (debe ir antes de /:id)
router.get("/stats", verifyToken, controller.getStats);

// CRUD de ventas
router.get("/", verifyToken, controller.list);
router.get("/:id", verifyToken, controller.getById);
router.post("/", verifyToken, controller.create);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.remove);

module.exports = router;
