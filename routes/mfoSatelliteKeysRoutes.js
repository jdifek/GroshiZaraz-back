const express = require("express");
const router = express.Router();
const controller = require("../controllers/mfoSatelliteKeysController");

router.get("/", controller.getAll);
router.get("/sitemap", controller.getAllSitemap);
router.get("/short", controller.getShort); // новый эндпоинт
router.get("/slug/:slug", controller.getBySlug);

router.get("/:id", controller.getOne);
router.post("/", controller.createWithAllMfo); // теперь создаёт с привязкой ко всем МФО
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.put('/:id/mfo-links', controller.updateMfoLinks);
router.post('/:id/mfo', controller.addMfoToKey);
router.delete('/:id/mfo/:mfoId', controller.removeMfoFromKey);
module.exports = router;
