const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll = async () => {
  return await prisma.user.findMany();
};

exports.getOne = async (id) => {
  return await prisma.user.findUnique({ where: { id: Number(id) } });
};

exports.create = async (data) => {
  return await prisma.user.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.user.update({
    where: { id: Number(id) },
    data,
  });
};

exports.remove = async (id) => {
  return await prisma.user.delete({ where: { id: Number(id) } });
};
