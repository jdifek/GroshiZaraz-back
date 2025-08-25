const { ReviewTargetType } = require("@prisma/client");
const prisma = require("../utils/prisma");

exports.getAll = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      answers: {
        include: {
          expert: true, // подтягиваем инфу об эксперте
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // Дополнительно можно подтягивать МФО (или банк/лицензию) по targetId
  // как сделано в questions.getAll
  const mfoIds = [
    ...new Set(
      reviews
        .filter((r) => r.targetType === ReviewTargetType.mfo)
        .map((r) => r.targetId)
    ),
  ];

  let mfoMap = new Map();
  if (mfoIds.length > 0) {
    const mfos = await prisma.mfo.findMany({ where: { id: { in: mfoIds } } });
    mfoMap = new Map(mfos.map((mfo) => [mfo.id, mfo]));
  }

  // Добавляем поле mfo в отзыв (как у вопросов)
  return reviews.map((r) => ({
    ...r,
    mfo: r.targetType === ReviewTargetType.mfo ? mfoMap.get(r.targetId) || null : null,
  }));
};

exports.getOne = async (id) => {
  return await prisma.review.findUnique({
    where: { id: Number(id) },
    include: {
      answers: {
        include: { expert: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
};

exports.create = async (data) => {
  return await prisma.review.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.review.update({
    where: { id: Number(id) },
    data,
  });
};

exports.remove = async (id) => {
  return await prisma.review.delete({ where: { id: Number(id) } });
};

// Методы для работы с ответами на отзывы
exports.createAnswer = async (reviewId, data) => {
  if (!data.expertId && (!data.authorName || !data.authorEmail)) {
    throw new Error("Необходимо указать данные автора или выбрать эксперта");
  }

  const answer = await prisma.reviewAnswer.create({
    data: {
      ...data,
      reviewId: Number(reviewId),
    },
    include: {
      expert: true,
    },
  });

  if (data.expertId) {
    await prisma.expert.update({
      where: { id: data.expertId },
      data: {
        totalAnswers: { increment: 1 },
      },
    });
  }

  return answer;
};

exports.updateAnswer = async (answerId, data) => {
  return await prisma.reviewAnswer.update({
    where: { id: Number(answerId) },
    data,
    include: {
      expert: true,
    },
  });
};

exports.deleteAnswer = async (answerId) => {
  const answer = await prisma.reviewAnswer.findUnique({
    where: { id: Number(answerId) },
  });

  if (answer?.expertId) {
    await prisma.expert.update({
      where: { id: answer.expertId },
      data: {
        totalAnswers: { decrement: 1 },
      },
    });
  }

  return await prisma.reviewAnswer.delete({
    where: { id: Number(answerId) },
  });
};
