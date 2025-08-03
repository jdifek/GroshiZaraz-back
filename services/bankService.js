const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getAll = async () => {
  return await prisma.bank.findMany();
};

exports.getOne = async (id) => {
  return await prisma.bank.findUnique({ where: { id: Number(id) } });
};

exports.create = async (data) => {
  return await prisma.bank.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.bank.update({
    where: { id: Number(id) },
    data,
  });
};

exports.remove = async (id) => {
  return await prisma.bank.delete({ where: { id: Number(id) } });
};
