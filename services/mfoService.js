const prisma = require("../utils/prisma");

exports.getAll = async () => {
  return await prisma.mfo.findMany();
};

exports.getOne = async (id) => {
  return await prisma.mfo.findUnique({ where: { id: Number(id) } });
};
exports.getBySlug = async (slug) => {
  const mfoWithQuestions = await prisma.mfo.findUnique({
    where: { slug: slug },
  });

  if (!mfoWithQuestions) {
    // Можно кинуть ошибку или вернуть null/undefined
    // Вариант с ошибкой:
    throw new Error(`MFO with slug "${slug}" not found`);
  }

  const questions = await prisma.question.findMany({
    where: {
      targetType: 'mfo',
      targetId: mfoWithQuestions.id,
    },
  });

  return {
    ...mfoWithQuestions,
    questions,
  };
};

exports.create = async (data) => {
  return await prisma.mfo.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.mfo.update({
    where: { id: Number(id) },
    data,
  });
};

exports.remove = async (id) => {
  return await prisma.mfo.delete({ where: { id: Number(id) } });
};
