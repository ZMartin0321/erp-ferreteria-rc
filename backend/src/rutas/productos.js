const express = require("express");
const router = express.Router();
const controller = require("../controladores/controladorProductos");
const { verifyToken } = require("../intermediarios/middlewareAutenticacion");
const {
  validateRequired,
  validatePositiveNumber,
  validateIdParam,
} = require("../intermediarios/middlewareValidacion");
const upload = require("../intermediarios/subirArchivos");

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

// Subir imagen de producto
router.post(
  "/:id/imagen",
  verifyToken,
  validateIdParam,
  upload.single("imagen"),
  controller.subirImagen
);

// Eliminar imagen de producto
router.delete(
  "/:id/imagen",
  verifyToken,
  validateIdParam,
  controller.eliminarImagen
);

module.exports = router;
