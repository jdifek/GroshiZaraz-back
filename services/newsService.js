const prisma = require("../utils/prisma");

exports.getAll = async () => {
  return await prisma.news.findMany({
    include: {
      author: true,
      NewsCategory: true,
    },
  });
};
exports.getByCategorySlug = async (slug) => {
  return await prisma.news.findMany({
    where: {
      NewsCategory: {
        slug: slug,
      },
      published: true, // если нужно только опубликованные
    },
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
exports.getBySlug = async (slug) => {
  return await prisma.news.findUnique({
    where: { slug },
    include: {
      author: true,
      NewsCategory: true,
    },
  });
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
