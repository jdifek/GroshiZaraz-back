const { ReviewTargetType } = require("@prisma/client");
const prisma = require("../utils/prisma");

exports.getAll = async () => {
  // Получаем все вопросы, кроме тех, где targetType = site
  const questions = await prisma.question.findMany({
    where: {
      NOT: {
        targetType: ReviewTargetType.site,
      },
    },
    include: {
      answers: {
        include: {
          expert: true // Включаем информацию об эксперте
        },
        orderBy: { createdAt: 'desc' }
      },
    },
  });

  // Получаем уникальные targetId для вопросов с targetType 'mfo'
  const mfoIds = [
    ...new Set(
      questions
        .filter(q => q.targetType === ReviewTargetType.mfo)
        .map(q => q.targetId)
    ),
  ];

  // Запрашиваем все МФО сразу по этим id
  const mfos = await prisma.mfo.findMany({
    where: {
      id: { in: mfoIds },
    },
  });

  // Формируем мапу для быстрого поиска МФО по id
  const mfoMap = new Map(mfos.map(mfo => [mfo.id, mfo]));

  // Добавляем к каждому вопросу поле mfo (если targetType=mfo)
  const questionsWithMfo = questions.map(q => {
    if (q.targetType === ReviewTargetType.mfo) {
      return { ...q, mfo: mfoMap.get(q.targetId) || null };
    }
    return { ...q, mfo: null };
  });

  return questionsWithMfo;
};

exports.getOne = async (id) => {
  return await prisma.question.findUnique({
    where: { id: Number(id) },
    include: { 
      answers: {
        include: {
          expert: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
};

exports.create = async (data) => {
  // Валидация: если нет имени и email, не разрешаем создание
  if (!data.name && !data.email) {
    throw new Error('Необходимо указать имя или email');
  }
  
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

// Методы для работы с ответами
exports.createAnswer = async (questionId, data) => {
  // Валидация: либо должны быть указаны имя/email пользователя, либо expertId
  if (!data.expertId && (!data.authorName || !data.authorEmail)) {
    throw new Error('Необходимо указать данные автора или выбрать эксперта');
  }

  const answer = await prisma.questionAnswer.create({
    data: {
      ...data,
      questionId: Number(questionId)
    },
    include: {
      expert: true
    }
  });

  // Если ответ от эксперта, увеличиваем счетчик его ответов
  if (data.expertId) {
    await prisma.expert.update({
      where: { id: data.expertId },
      data: {
        totalAnswers: {
          increment: 1
        }
      }
    });
  }

  return answer;
};

exports.updateAnswer = async (answerId, data) => {
  return await prisma.questionAnswer.update({
    where: { id: Number(answerId) },
    data,
    include: {
      expert: true
    }
  });
};

exports.deleteAnswer = async (answerId) => {
  const answer = await prisma.questionAnswer.findUnique({
    where: { id: Number(answerId) }
  });

  if (answer?.expertId) {
    // Уменьшаем счетчик ответов эксперта
    await prisma.expert.update({
      where: { id: answer.expertId },
      data: {
        totalAnswers: {
          decrement: 1
        }
      }
    });
  }

  return await prisma.questionAnswer.delete({ 
    where: { id: Number(answerId) } 
  });
};