const express = require("express");
const router = express.Router();
const controller = require("../controllers/authorsController");
router.use((req, res, next) => {
  console.log(`📝 Authors route: ${req.method} ${req.originalUrl}`);
  next();
});
router.get("/", controller.getAll);
router.get("/static", controller.getAllStatic);
router.get("/slug/:slug", controller.getBySlug);
router.get("/:id", controller.getOne);
router.post("/", controller.create);

router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
