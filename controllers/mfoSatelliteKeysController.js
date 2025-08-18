const service = require("../services/mfoSatelliteKeysService");

exports.getAll = async (req, res) => {
  try {
    res.json(await service.getAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getShort = async (req, res) => {
  try {
    const items = await service.getShort(req.query.q); // передаем только q
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getOne = async (req, res) => {
  try {
    const item = await service.getOne(Number(req.params.id));
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Новый метод
exports.createWithAllMfo = async (req, res) => {
  try {
    const item = await service.createWithAllMfo(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await service.update(Number(req.params.id), req.body);
    res.json(item);
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
