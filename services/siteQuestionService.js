const prisma = require("../utils/prisma");

// service.js
exports.getAllSiteQuestions = async ({ onlyModerated, sortByModerated }) => {
  const where = {
    targetType: "site",
    targetId: 1,
    ...(onlyModerated === 'true' && { isModerated: true }),
  };

  const orderBy = [];

  if (sortByModerated === 'true') {
    orderBy.push({ isModerated: 'asc' }); // сначала не промодерированные
  }

  orderBy.push({ createdAt: 'desc' }); // всегда по дате

  return await prisma.question.findMany({
    where,
    orderBy,
    include: {
      answers: {
        include: {
          expert: true 
        },
        orderBy: { createdAt: 'desc' }
      },
    },
  });
};


exports.getOne = async (id) => {
  return await prisma.question.findUnique({ where: { id } });
};
exports.getOneBySlug = async (slug) => {
  return await prisma.question.findFirst({
    where: {
      slug,
      isModerated: true,
      targetType: 'site',
    },
    include: {
      answers: {
        where: {
          isModerated: true
        },
        include: {
          expert: true,
        },
      },
    },
  });
};
exports.getByCategory = async (category, limit = 10) => {
  // 1️⃣ Берём вопросы нужной категории
  const primary = await prisma.question.findMany({
    where: {
      category: category,
      isModerated: true,
      targetType: "site",
    },
    include: {
      answers: true,
    },
    take: +limit,
  });

  // Если хватило — сразу возвращаем
  if (primary.length >= +limit) {
    return primary;
  }

  // 2️⃣ Считаем сколько не хватает
  const remaining = +limit - primary.length;

  // 3️⃣ Добираем из других категорий
  const fallback = await prisma.question.findMany({
    where: {
      category: {
        not: category,
      },
      isModerated: true,
      targetType: "site",
      id: {
        notIn: primary.map((q) => q.id),
      },
    },
    include: {
      answers: true,
    },
    take: +remaining,
  });

  // 4️⃣ Склеиваем результат
  return [...primary, ...fallback];
};


exports.create = async (data) => {
  return await prisma.question.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.question.update({
    where: { id },
    data,
  });
};

exports.remove = async (id) => {
  return await prisma.question.delete({ where: { id } });
};
