const prisma = require("../utils/prisma");

exports.getAll = async () => {
  return await prisma.expert.findMany({
    where: { isActive: true },
    orderBy: { totalAnswers: 'desc' }
  });
};

exports.getOne = async (id) => {
  return await prisma.expert.findUnique({
    where: { id: Number(id) },
    include: {
      questionAnswers: {
        include: {
          question: true
        },
        orderBy: { createdAt: 'desc' }
      },
      reviewAnswers: {
        include: {
          review: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
};

exports.create = async (data) => {
  // Генерируем slug если не указан
  if (!data.slug) {
    data.slug = data.name.toLowerCase()
      .replace(/[^a-z0-9а-я]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  return await prisma.expert.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.expert.update({
    where: { id: Number(id) },
    data,
  });
};

exports.remove = async (id) => {
  // Мягкое удаление - просто делаем неактивным
  return await prisma.expert.update({
    where: { id: Number(id) },
    data: { isActive: false }
  });
};