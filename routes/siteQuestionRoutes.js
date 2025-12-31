const express = require("express");
const router = express.Router();
const controller = require("../controllers/siteQuestionController");

router.get("/", controller.getAll);
router.get("/by-slug/:slug", controller.getOneBySlug);
router.get("/by-category/:category", controller.getByCategory);
router.get("/:id", controller.getOne);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
