const { PrismaClient, ReviewTargetType } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll = async () => {
  // Получаем все вопросы, кроме тех, где targetType = site
  const questions = await prisma.question.findMany({
    where: {
      NOT: {
        targetType: ReviewTargetType.site,
      },
    },
  });

  // Получаем уникальные targetId для вопросов с targetType 'mfo'
  const mfoIds = [
    ...new Set(
      questions
        .filter(q => q.targetType === ReviewTargetType.mfo)
        .map(q => q.targetId)
    ),
  ];

  // Запрашиваем все МФО сразу по этим id
  const mfos = await prisma.mfo.findMany({
    where: {
      id: { in: mfoIds },
    },
  });

  // Формируем мапу для быстрого поиска МФО по id
  const mfoMap = new Map(mfos.map(mfo => [mfo.id, mfo]));

  // Добавляем к каждому вопросу поле mfo (если targetType=mfo)
  const questionsWithMfo = questions.map(q => {
    if (q.targetType === ReviewTargetType.mfo) {
      return { ...q, mfo: mfoMap.get(q.targetId) || null };
    }
    return { ...q, mfo: null };
  });

  return questionsWithMfo;
};


exports.getOne = async (id) => {
  return await prisma.question.findUnique({
    where: { id: Number(id) },
    include: { answers: true }
  });
};

exports.create = async (data) => {
  return await prisma.question.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.question.update({
    where: { id: Number(id) },
    data,
  });
};

exports.remove = async (id) => {
  return await prisma.question.delete({ where: { id: Number(id) } });
};
