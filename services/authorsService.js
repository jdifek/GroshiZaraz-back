const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll = async () => {
  return await prisma.author.findMany();
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
