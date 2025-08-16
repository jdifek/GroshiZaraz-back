const express = require("express");
const router = express.Router();
const controller = require("../controllers/questionController");

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.post("/:questionId/answers", async (req, res) => {
  try {
    const answer = await controller.createAnswer(req.params.questionId, req.body);
    res.status(201).json(answer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/answers/:answerId", async (req, res) => {
  try {
    const answer = await controller.updateAnswer(req.params.answerId, req.body);
    res.json(answer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/answers/:answerId", async (req, res) => {
  try {
    await controller.deleteAnswer(req.params.answerId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
