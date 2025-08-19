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
// controllers/questionAnswerController.js
exports.create = async (req, res) => {
  try {
    const {
      questionId,
      textOriginal,
      textUk,
      textRu,
      expertId,
      authorName,
      authorEmail,
    } = req.body;

    const result = await service.create({
      questionId,
      textOriginal,
      textUk,
      textRu,
      expertId,
      authorName,
      authorEmail,
    });

    await prisma.expert.update({
      where: { id: expertId },
      data: { totalAnswers: { increment: 1 } },
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
      textOriginal,

      authorName
      
    } = req.body;

    const result = await service.update(req.params.id, {
      textUk,
      textRu,
      isModerated,
      authorEmail,
      textOriginal,

      authorName
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.remove = async (req, res) => {
  try {
    const answer = await service.getOne(req.params.id);
    if (!answer) return res.status(404).json({ error: "Not found" });

    if (answer.expertId) {
      await prisma.expert.update({
        where: { id: answer.expertId },
        data: { totalAnswers: { decrement: 1 } },
      });
    }

    await service.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

