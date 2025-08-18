const service = require("../services/questionAnswerService");

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

// Создание только с нужными полями
exports.create = async (req, res) => {
  try {
    const {
      questionId,
      textOriginal
    } = req.body;

    const result = await service.create({
      questionId,
      textOriginal,
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Модерация
exports.update = async (req, res) => {
  try {
    const {
      textUk,
      textRu,
      isModerated,
      authorEmail,
      authorName
    } = req.body;

    const result = await service.update(req.params.id, {
      textUk,
      textRu,
      isModerated,
      authorEmail,
      authorName
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
