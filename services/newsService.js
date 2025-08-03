const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll = async () => {
  return await prisma.news.findMany({
    include: {
      author: true,
      NewsCategory: true,
    },
  });
};
exports.getStatistics = async () => {
  const [viewsResult, countResult] = await Promise.all([
    prisma.news.aggregate({ _sum: { views: true } }),
    prisma.news.count(),
  ]);

  return {
    totalViews: viewsResult._sum.views || 0,
    totalNews: countResult || 0,
  };
};

exports.getOne = async (id) => {
  return await prisma.news.findUnique({ where: { id: Number(id) } });
};

exports.create = async (data) => {
  return await prisma.news.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.news.update({
    where: { id: Number(id) },
    data,
  });
};

exports.remove = async (id) => {
  return await prisma.news.delete({ where: { id: Number(id) } });
};
