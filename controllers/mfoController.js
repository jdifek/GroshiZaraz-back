const service = require("../services/mfoService");

// Контроллер
exports.getAll = async (req, res) => {
  try {
    const { sortBy = "rating", order = "desc" } = req.query;

    const result = await service.getAll(sortBy, order);
    res.json(result);
  } catch (err) {
    console.error("Error in getAll:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.randomKeys = async (req, res) => {
  try {
    const result = await service.randomKeys();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getBySlugKey = async (req, res) => {
  try {
    const result = await service.getBySlugKey(req.params.slug);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getBySlug = async (req, res) => {
  try {
    const result = await service.getBySlug(req.params.slug, req.isSite); // передаём флаг
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const result = await service.getOne(req.params.id);
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const result = await service.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await service.update(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await service.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
