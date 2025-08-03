const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll = async () => {
  return await prisma.siteReview.findMany();
};

exports.getOne = async (id) => {
  return await prisma.siteReview.findUnique({ where: { id: Number(id) } });
};

exports.create = async (data) => {
  return await prisma.siteReview.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.siteReview.update({
    where: { id: Number(id) },
    data,
  });
};

exports.remove = async (id) => {
  return await prisma.siteReview.delete({ where: { id: Number(id) } });
};
