const express = require("express");
const router = express.Router();
const controller = require("../controllers/newsController");

router.get("/slug/:slug", controller.getBySlug);
router.get("/category/:slug", controller.getByCategorySlug);
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", controller.create);
router.get("/dashboard/statistic", controller.getStatistics);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
