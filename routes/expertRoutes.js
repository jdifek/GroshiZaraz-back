const express = require("express");
const router = express.Router();
const controller = require("../controllers/expertController");

router.get("/", async (req, res) => {
  try {
    const experts = await controller.getAll();
    res.json(experts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const expert = await controller.getOne(req.params.id);
    if (!expert) {
      return res.status(404).json({ error: "Эксперт не найден" });
    }
    res.json(expert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const expert = await controller.create(req.body);
    res.status(201).json(expert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const expert = await controller.update(req.params.id, req.body);
    res.json(expert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await controller.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;