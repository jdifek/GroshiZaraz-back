const prisma = require("../utils/prisma");

exports.getAll = async () => {
  const authors = await prisma.author.findMany({
    include: {
      _count: {
        select: { articles: true },
      },
      articles: {
        select: { views: true },
      },
    },
  });

  return authors.map(a => ({
    ...a,
    totalPosts: a._count.articles,
    totalViews: a.articles.reduce((sum, n) => sum + n.views, 0),
  }));
};


exports.getOne = async (id) => {
  return await prisma.author.findUnique({ where: { id: Number(id) } });
};

exports.create = async (data) => {
  return await prisma.author.create({ data });
};

exports.getAuthorBySlug = async (slug) => {
  return await prisma.author.findUnique({
    where: { slug }
  });
}

exports.update = async (id, data) => {
  return await prisma.author.update({
    where: { id: Number(id) },
    data,
  });
};

exports.remove = async (id) => {
  return await prisma.author.delete({ where: { id: Number(id) } });
};
