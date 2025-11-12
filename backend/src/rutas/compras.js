const express = require("express");
const router = express.Router();
const controller = require("../controladores/controladorCompras");
const { verifyToken } = require("../intermediarios/middlewareAutenticacion");

// Estadísticas (debe ir antes de /:id)
router.get("/stats", verifyToken, controller.getStats);

// CRUD de compras
router.get("/", verifyToken, controller.list);
router.get("/:id", verifyToken, controller.getById);
router.post("/", verifyToken, controller.create);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.remove);

// Recibir compra
router.post("/:id/receive", verifyToken, controller.receive);

module.exports = router;
