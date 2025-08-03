const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll = async () => {
  return await prisma.question.findMany({
    include: { answers: true }
  });
};

exports.getOne = async (id) => {
  return await prisma.question.findUnique({
    where: { id: Number(id) },
    include: { answers: true }
  });
};

exports.create = async (data) => {
  return await prisma.question.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.question.update({
    where: { id: Number(id) },
    data,
  });
};

exports.remove = async (id) => {
  return await prisma.question.delete({ where: { id: Number(id) } });
};
