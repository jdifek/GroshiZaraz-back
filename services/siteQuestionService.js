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
      answers: true,
    },
  });
};


exports.getOne = async (id) => {
  return await prisma.question.findUnique({ where: { id } });
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
