const service = require("../services/siteQuestionService");

// controller.js
exports.getAll = async (req, res) => {
  try {
    const { onlyModerated, sortByModerated } = req.query;
    const result = await service.getAllSiteQuestions({ onlyModerated, sortByModerated });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getByCategory = async (req, res) => {
  try {
    const result = await service.getByCategory(req.params.category, req.query.limit);
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOneBySlug = async (req, res) => {
  try {
    const result = await service.getOneBySlug(req.params.slug);
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const result = await service.getOne(Number(req.params.id));
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = {
      ...req.body,
      targetType: "site",
      targetId: 1,
    };

    const result = await service.create(data);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await service.update(Number(req.params.id), req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await service.remove(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
