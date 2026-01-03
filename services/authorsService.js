const prisma = require("../utils/prisma");

exports.getAllStatic = async (req, res) => {
  try {
    console.log('📝 Getting all authors...');
    const authors = await prisma.author.findMany(); 
    console.log(`✅ Found ${authors.length} authors`);
    return authors
  } catch (error) {
    console.error('❌ Error in getAll controller:', error);
    res.status(500).json({ error: 'Ошибка при получении авторов' });
  }
};
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

exports.getAllSitemap = async () => {
  return await prisma.author.findMany({
    select: {
      id: true,
      name: true,
      nameUk: true,
      slug: true,
    },
  });
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
