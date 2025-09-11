const prisma = require("../utils/prisma");
exports.getAll = async () => {
  const where = {
    targetType: "site",
    targetId: 1,
  };

  // Считаем количество непромодерированных
  const pendingCount = await prisma.review.count({
    where: {
      ...where,
      isModerated: false,
    },
  });

  // Получаем отзывы, сортируем так, чтобы сначала были isModerated = false
  const reviews = await prisma.review.findMany({
    where,
    orderBy: [
      { isModerated: "asc" },   // false (0) будет идти выше true (1)
      { createdAt: "desc" },    // внутри сортируем по дате
    ],
  });

  return {
    pendingCount,
    reviews,
  };
};


exports.getOne = async (id) => {
  return await prisma.review.findUnique({ where: { id: Number(id) } });
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
