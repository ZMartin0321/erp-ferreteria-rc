const express = require("express");
const router = express.Router();
const controller = require("../controllers/productsController");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  validateRequired,
  validatePositiveNumber,
  validateIdParam,
} = require("../middleware/validationMiddleware");

// Listar todos los productos
router.get("/", verifyToken, controller.list);

// Obtener productos con bajo stock
router.get("/low-stock", verifyToken, controller.getLowStock);

// Obtener producto por ID
router.get("/:id", verifyToken, validateIdParam, controller.getById);

// Crear nuevo producto
router.post(
  "/",
  verifyToken,
  validateRequired(["name", "price", "stock", "categoryId"]),
  validatePositiveNumber(["price", "stock", "cost"]),
  controller.create
);

// Actualizar producto
router.put(
  "/:id",
  verifyToken,
  validateIdParam,
  validatePositiveNumber(["price", "stock", "cost"]),
  controller.update
);

// Eliminar producto
router.delete("/:id", verifyToken, validateIdParam, controller.remove);

module.exports = router;
