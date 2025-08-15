const prisma = require("../utils/prisma");

exports.getAll = async () => {
  return await prisma.questionAnswer.findMany();
};

exports.getOne = async (id) => {
  return await prisma.questionAnswer.findUnique({
    where: { id: Number(id) },
  });
};

exports.create = async (data) => {
  return await prisma.questionAnswer.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.questionAnswer.update({
    where: { id: Number(id) },
    data,
  });
};

exports.remove = async (id) => {
  return await prisma.questionAnswer.delete({
    where: { id: Number(id) },
  });
};
