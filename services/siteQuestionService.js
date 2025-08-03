const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll = async () => {
  return await prisma.siteQuestion.findMany();
};

exports.getOne = async (id) => {
  return await prisma.siteQuestion.findUnique({ where: { id: Number(id) } });
};

exports.create = async (data) => {
  return await prisma.siteQuestion.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.siteQuestion.update({
    where: { id: Number(id) },
    data,
  });
};

exports.remove = async (id) => {
  return await prisma.siteQuestion.delete({ where: { id: Number(id) } });
};
