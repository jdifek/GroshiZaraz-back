const express = require("express");
const router = express.Router();
const controller = require("../controllers/mfoController");
const siteMiddleware = require("../middlewares/siteMiddleware");
router.use(siteMiddleware);

router.get("/", controller.getAll);
router.get('/all-20-random-keys', controller.randomKeys)
router.get('/all-mfo-from-key', controller.getBySlugKey)
router.get("/slug/:slug", controller.getBySlug);
router.get("/:id", controller.getOne);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
