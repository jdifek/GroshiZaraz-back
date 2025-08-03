const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll = async () => {
  return await prisma.mfo.findMany();
};

exports.getOne = async (id) => {
  return await prisma.mfo.findUnique({ where: { id: Number(id) } });
};

exports.create = async (data) => {
  return await prisma.mfo.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.mfo.update({
    where: { id: Number(id) },
    data,
  });
};

exports.remove = async (id) => {
  return await prisma.mfo.delete({ where: { id: Number(id) } });
};
