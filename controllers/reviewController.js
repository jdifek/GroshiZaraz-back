const service = require("../services/reviewService");

exports.getAll = async (req, res) => {
  try {
    const result = await service.getAll();
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

// Только конкретные поля
exports.create = async (req, res) => {
  try {
    const {
      userId,
      rating,
      textOriginal,
      targetType,
      targetId,
      authorName,
      authorEmail
    } = req.body;

    const result = await service.create({
      userId,
      rating,
      textOriginal,
      targetType,
      targetId,
      authorName,
      authorEmail
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Модерация: можно передать textUk/textRu и isModerated
exports.update = async (req, res) => {
  try {
    const {
      textUk,
      textRu,
      isModerated,
      textOriginal,
      rating
    } = req.body;

    const result = await service.update(req.params.id, {
      textUk,
      textRu,
      isModerated,
      textOriginal,
      rating
    });

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
