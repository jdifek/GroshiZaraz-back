const express = require("express");
const router = express.Router();
const controller = require("../controllers/mfoSatellitesController");

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", controller.createWithAllMfo); // при создании сразу все МФО
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
