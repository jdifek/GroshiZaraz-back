const prisma = require("../utils/prisma");

exports.getAll = async (limit) => {
  return await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    where: { published: true },
    take: limit,
    include: {
      author: true,
      NewsCategory: true,
    },
  });
};
exports.getAllSitemap = async () => {
  return await prisma.news.findMany({
    select: {
      slug: true,
      slugUk: true,
      id: true,
      updatedAt: true
    }
  });
};
exports.getByCategorySlug = async (slug) => {
  return await prisma.news.findMany({
    where: {
      NewsCategory: {
        slug: slug,
      },
      published: true,
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
  // ищем новость по slug или slugUk и увеличиваем views
  const news = await prisma.news.update({
    where: {
      // Используем findFirst, если хотим искать по нескольким полям
      id: (
        await prisma.news.findFirst({
          where: {
            OR: [
              { slug },
              { slugUk: slug } // ищем и по украинскому слагу
            ]
          }
        })
      )?.id,
    },
    data: {
      views: { increment: 1 }, // увеличиваем на 1
    },
    include: {
      author: true,
      NewsCategory: true,
    },
  });

  return news;
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
