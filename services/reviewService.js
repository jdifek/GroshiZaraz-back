const prisma = require("../utils/prisma");

exports.getAll = async () => {
  return await prisma.review.findMany();
};

exports.getOne = async (id) => {
  return await prisma.review.findUnique({ where: { id: Number(id) } });
};

exports.create = async (data) => {
  return await prisma.review.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.review.update({
    where: { id: Number(id) },
    data,
  });
};

exports.remove = async (id) => {
  return await prisma.review.delete({ where: { id: Number(id) } });
};
