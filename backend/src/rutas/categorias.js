const express = require("express");
const router = express.Router();
const controller = require("../controladores/controladorCategorias");
const { verifyToken } = require("../intermediarios/middlewareAutenticacion");

router.get("/", verifyToken, controller.list);
router.post("/", verifyToken, controller.create);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.remove);

module.exports = router;
