const prisma = require("../utils/prisma");

exports.getAllCategories = async () => {
  return await prisma.faqCategory.findMany({
    orderBy: { order: "asc" },
    include: { questions: true },
  });
};

exports.getCategoryById = async (id) => {
  return await prisma.faqCategory.findUnique({
    where: { id: Number(id) },
    include: { questions: true },
  });
};

exports.createCategory = async (data) => {
  return await prisma.faqCategory.create({ data });
};

exports.updateCategory = async (id, data) => {
  return await prisma.faqCategory.update({
    where: { id: Number(id) },
    data,
  });
};

exports.removeCategory = async (id) => {
  return await prisma.faqCategory.delete({ where: { id: Number(id) } });
};


// ----------- FAQ Questions ------------------

exports.getAllQuestions = async () => {
  return await prisma.faqQuestion.findMany({
    orderBy: { order: "asc" },
    include: { category: true },
  });
};

exports.getQuestionById = async (id) => {
  return await prisma.faqQuestion.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });
};

exports.createQuestion = async (data) => {
  return await prisma.faqQuestion.create({ data });
};

exports.updateQuestion = async (id, data) => {
  return await prisma.faqQuestion.update({
    where: { id: Number(id) },
    data,
  });
};

exports.removeQuestion = async (id) => {
  return await prisma.faqQuestion.delete({ where: { id: Number(id) } });
};
