const express = require("express");
const router = express.Router();
const controller = require("../controllers/newsController");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), controller.create);
router.put("/:id", upload.single("image"), controller.update);

router.get("/slug/:slug", controller.getBySlug);
router.get("/category/:slug", controller.getByCategorySlug);
router.get("/", controller.getAll);
router.get("/sitemap", controller.getAllSitemap);
router.get("/:id", controller.getOne);
router.get("/dashboard/statistic", controller.getStatistics);

router.delete("/:id", controller.remove);

module.exports = router;
