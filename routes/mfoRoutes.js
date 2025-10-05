const express = require("express");
const router = express.Router();
const controller = require("../controllers/mfoController");
const siteMiddleware = require("../middlewares/siteMiddleware");
const multer = require("multer");

// файлы будем хранить в памяти
const upload = multer({ storage: multer.memoryStorage() });

router.use(siteMiddleware);

router.get("/", controller.getAll);
router.get("/all-20-random-keys", controller.randomKeys);
router.get("/all-mfo-from-key", controller.getBySlugKey);
router.get("/slug/:slug", controller.getBySlug);
router.get("/:id", controller.getOne);

// !!! тут меняем
router.post("/", upload.single("logo"), controller.create);
router.put("/:id", upload.single("logo"), controller.update);

router.delete("/:id", controller.remove);

module.exports = router;
