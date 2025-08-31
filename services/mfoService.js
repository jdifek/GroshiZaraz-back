const prisma = require("../utils/prisma");
exports.getAll = async () => {
  return await prisma.mfo.findMany({
    include: {
      promoCodes: true, // включаем промокоды
    },
  });
};


exports.getBySlug = async (slug) => {
  // Сначала ищем в ключах (RU или UK)
  const key = await prisma.mfoSatelliteKey.findFirst({
    where: {
      OR: [
        { slugRu: slug },
        { slugUk: slug }
      ]
    },
    include: {
      satellites: true, // подтягиваем связанные сателлиты
    },
  });

  if (key) {
    return {
      type: "key",
      nameRu: key.keyRu,
      nameUk: key.keyUk,
      slugRu: key.slugRu,
      slugUk: key.slugUk,
      satellites: key.satellites.map(s => ({
        nameRu: s.titleRu,
        nameUk: s.titleUk,
        slugRu: s.slugRu,
        slugUk: s.slugUk,
      })),
    };
  }

  // Если не нашли в ключах, ищем в сателлитах
  const satellite = await prisma.mfoSatellite.findFirst({
    where: {
      OR: [
        { slugRu: slug },
        { slugUk: slug }
      ]
    },
    include: {
      key: true, // подтягиваем родительский ключ
    },
  });

  if (satellite) {
    return {
      type: "satellite",
      nameRu: satellite.titleRu,
      nameUk: satellite.titleUk,
      slugRu: satellite.slugRu,
      slugUk: satellite.slugUk,
      parentKey: {
        nameRu: satellite.key.keyRu,
        nameUk: satellite.key.keyUk,
        slugRu: satellite.key.slugRu,
        slugUk: satellite.key.slugUk,
      },
    };
  }

  throw new Error("Not found");
};

exports.randomKeys = async () => {
  const keys = await prisma.mfoSatelliteKey.findMany({
    select: {
      id: true,
      keyRu: true,
      keyUk: true,
      slugRu: true,
      slugUk: true,
    },
  });

  if (!keys.length) return [];

  // перемешиваем
  const shuffled = keys.sort(() => 0.5 - Math.random());

  // берем 20
  return shuffled.slice(0, 20).map((k) => ({
    nameRu: k.keyRu,
    nameUk: k.keyUk,
    slugRu: k.slugRu,
    slugUk: k.slugUk,
  }));
};

exports.getOne = async (id) => {
  return await prisma.mfo.findUnique({
    where: { id: Number(id) },
    include: { promoCodes: true }, // включаем промокоды
  });
};

exports.getBySlug = async (slug) => {
  const mfoWithQuestions = await prisma.mfo.findUnique({
    where: { slug },
    include: { promoCodes: true }, // включаем промокоды
  });

  if (!mfoWithQuestions) {
    throw new Error(`MFO with slug "${slug}" not found`);
  }

  const questions = await prisma.question.findMany({
    where: { targetType: 'mfo', targetId: mfoWithQuestions.id },
    include: { answers: { include: { expert: true }, orderBy: { createdAt: 'desc' } } },
  });

  return {
    ...mfoWithQuestions,
    questions,
  };
};


exports.create = async (data) => {
  const { promoCodes, ...mfoData } = data;

  return await prisma.mfo.create({
    data: {
      ...mfoData,
      ...(promoCodes && Array.isArray(promoCodes)
        ? {
            promoCodes: {
              create: promoCodes.map(pc => ({
                code: pc.code,
                discount: pc.discount,
                condition: pc.condition,
                validTill: new Date(pc.validTill),
              })),
            },
          }
        : {}),
    },
  });
};



exports.update = async (id, data) => {
  const { promoCodes, ...mfoData } = data;

  return await prisma.mfo.update({
    where: { id: Number(id) },
    data: {
      ...mfoData,
      // Обновляем промокоды только если они есть
      ...(promoCodes && Array.isArray(promoCodes)
        ? {
            promoCodes: {
              // Очищаем старые промокоды
              deleteMany: {},
              // Создаём новые
              create: promoCodes.map(pc => ({
                code: pc.code,
                discount: pc.discount,
                condition: pc.condition,
                validTill: new Date(pc.validTill),
              })),
            },
          }
        : {}),
    },
  });
};

exports.remove = async (id) => {
  return await prisma.mfo.delete({ where: { id: Number(id) } });
};
