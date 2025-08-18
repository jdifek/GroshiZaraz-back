const express = require("express");
const router = express.Router();
const controller = require("../controllers/mfoSatelliteKeysController");

router.get("/", controller.getAll);
router.get("/short", controller.getShort); // новый эндпоинт

router.get("/:id", controller.getOne);
router.post("/", controller.createWithAllMfo); // теперь создаёт с привязкой ко всем МФО
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
