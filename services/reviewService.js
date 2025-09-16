const { ReviewTargetType } = require("@prisma/client");
const prisma = require("../utils/prisma");

exports.getAll = async () => {
  // Получаем все отзывы по targetType = mfo
  const reviews = await prisma.review.findMany({
    where: { targetType: ReviewTargetType.mfo },
    include: {
      answers: {
        include: {
          expert: true, // тянем эксперта
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: [
      { isModerated: "asc" }, // сначала не промодерированные
      { createdAt: "desc" },  // потом по дате
    ],
  });

  // Считаем количество непромодерированных
  const pendingCount = await prisma.review.count({
    where: {
      targetType: ReviewTargetType.mfo,
      isModerated: false,
    },
  });

  // Собираем id всех МФО из отзывов
  const mfoIds = [
    ...new Set(reviews.map((r) => r.targetId)),
  ];

  let mfoMap = new Map();
  if (mfoIds.length > 0) {
    const mfos = await prisma.mfo.findMany({ where: { id: { in: mfoIds } } });
    mfoMap = new Map(mfos.map((mfo) => [mfo.id, mfo]));
  }

  // Добавляем в каждый отзыв поле mfo
  return {
    pendingCount,
    reviews: reviews.map((r) => ({
      ...r,
      mfo: mfoMap.get(r.targetId) || null,
    })),
  };
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
