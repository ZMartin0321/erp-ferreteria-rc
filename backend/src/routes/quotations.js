const express = require("express");
const router = express.Router();
const controller = require("../controllers/quotationsController");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  validateRequired,
  validateIdParam,
} = require("../middleware/validationMiddleware");

// Listar cotizaciones
router.get("/", verifyToken, controller.list);

// Obtener cotización por ID
router.get("/:id", verifyToken, validateIdParam, controller.getById);

// Crear nueva cotización
router.post(
  "/",
  verifyToken,
  validateRequired(["clientName", "items"]),
  controller.create
);

// Actualizar estado de cotización
router.patch(
  "/:id/status",
  verifyToken,
  validateIdParam,
  validateRequired(["status"]),
  controller.updateStatus
);

// Convertir cotización a venta
router.post(
  "/:id/convert-to-sale",
  verifyToken,
  validateIdParam,
  controller.convertToSale
);

// Eliminar cotización
router.delete("/:id", verifyToken, validateIdParam, controller.deleteQuotation);

module.exports = router;
