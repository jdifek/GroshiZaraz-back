const express = require("express");
const router = express.Router();
const controller = require("../controllers/faqController");

// Categories
router.get("/categories", controller.getAllCategories);
router.get("/categories/:id", controller.getCategoryById);
router.post("/categories", controller.createCategory);
router.put("/categories/:id", controller.updateCategory);
router.delete("/categories/:id", controller.removeCategory);

// Questions
router.get("/questions", controller.getAllQuestions);
router.get("/questions/:id", controller.getQuestionById);
router.post("/questions", controller.createQuestion);
router.put("/questions/:id", controller.updateQuestion);
router.delete("/questions/:id", controller.removeQuestion);

module.exports = router;
