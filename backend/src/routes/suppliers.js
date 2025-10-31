const express = require("express");
const router = express.Router();
const controller = require("../controllers/suppliersController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, controller.list);
router.post("/", verifyToken, controller.create);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.remove);

module.exports = router;
