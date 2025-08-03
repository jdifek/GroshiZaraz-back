const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll = async () => {
  return await prisma.newsCategory.findMany();
};

exports.getOne = async (id) => {
  return await prisma.newsCategory.findUnique({ where: { id: Number(id) } });
};

exports.create = async (data) => {
  return await prisma.newsCategory.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.newsCategory.update({
    where: { id: Number(id) },
    data,
  });
};

exports.remove = async (id) => {
  return await prisma.newsCategory.delete({ where: { id: Number(id) } });
};
