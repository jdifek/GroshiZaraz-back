const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll = async () => {
  return await prisma.license.findMany();
};

exports.getOne = async (id) => {
  return await prisma.license.findUnique({ where: { id: Number(id) } });
};

exports.create = async (data) => {
  return await prisma.license.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.license.update({
    where: { id: Number(id) },
    data,
  });
};

exports.remove = async (id) => {
  return await prisma.license.delete({ where: { id: Number(id) } });
};
