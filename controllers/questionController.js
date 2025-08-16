const service = require("../services/questionService");

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


// Методы для работы с ответами
exports.createAnswer = async (questionId, data) => {
  // Валидация: либо должны быть указаны имя/email пользователя, либо expertId
  if (!data.expertId && (!data.authorName || !data.authorEmail)) {
    throw new Error('Необходимо указать данные автора или выбрать эксперта');
  }

  const answer = await prisma.questionAnswer.create({
    data: {
      ...data,
      questionId: Number(questionId)
    },
    include: {
      expert: true
    }
  });

  // Если ответ от эксперта, увеличиваем счетчик его ответов
  if (data.expertId) {
    await prisma.expert.update({
      where: { id: data.expertId },
      data: {
        totalAnswers: {
          increment: 1
        }
      }
    });
  }

  return answer;
};

exports.updateAnswer = async (answerId, data) => {
  return await prisma.questionAnswer.update({
    where: { id: Number(answerId) },
    data,
    include: {
      expert: true
    }
  });
};

exports.deleteAnswer = async (answerId) => {
  const answer = await prisma.questionAnswer.findUnique({
    where: { id: Number(answerId) }
  });

  if (answer?.expertId) {
    // Уменьшаем счетчик ответов эксперта
    await prisma.expert.update({
      where: { id: answer.expertId },
      data: {
        totalAnswers: {
          decrement: 1
        }
      }
    });
  }

  return await prisma.questionAnswer.delete({ 
    where: { id: Number(answerId) } 
  });
};