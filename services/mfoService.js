const prisma = require("../utils/prisma");
exports.getAll = async (sortBy = "rating", order = "desc") => {
  // mapping для безопасности
  const sortableFields = {
    rating: "rating",
    rate: "dailyRate",
    approval: "approvalRate",
    decisionTime: "decisionTime",
    maxAmount: "maxAmount",
  };

  // если передан некорректный ключ, используем рейтинг по умолчанию
  const orderField = sortableFields[sortBy] || "rating";

  return await prisma.mfo.findMany({
    include: {
      promoCodes: true, // включаем промокоды
    },
    orderBy: {
      [orderField]: order, // 'asc' или 'desc'
    },
  });
};
exports.getAllSitemap = async () => {

  return await prisma.mfo.findMany({
    select: {
      slug: true,
      id: true,
      updatedAt: true
    }
  });
};


exports.getBySlugKey = async (slug) => {
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

exports.getBySlug = async (slug, isSite = false) => {
  const mfoWithData = await prisma.mfo.findUnique({
    where: { slug },
    include: { promoCodes: true },
  });

  if (!mfoWithData) {
    throw new Error(`MFO with slug "${slug}" not found`);
  }

  // Вопросы
  const questions = await prisma.question.findMany({
    where: { targetType: "mfo", targetId: mfoWithData.id, ...(isSite ? { isModerated: true } : {}), },
    include: { answers: { include: { expert: true }, where: { ...(isSite ? { isModerated: true } : {}) } } },
    orderBy: { createdAt: "desc" },
  });

  // Отзывы с фильтром isModerated для сайта
  const reviews = await prisma.review.findMany({
    where: {
      targetType: "mfo",
      targetId: mfoWithData.id,
      ...(isSite ? { isModerated: true } : {}),
    },
    include: { answers: { include: { expert: true } } },
    orderBy: { createdAt: "desc" },
  });

  return {
    ...mfoWithData,
    questions,
    reviews,
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
  const mfoId = Number(id);

  // Удаляем связи с сателлитами
  await prisma.mfoSatelliteMfo.deleteMany({
    where: { mfoId },
  });

  // Удаляем связи с ключами
  await prisma.mfoSatelliteKeyMfo.deleteMany({
    where: { mfoId },
  });

  // Удаляем промокоды и лицензии
  await prisma.promoCode.deleteMany({ where: { mfoId } });
  await prisma.license.deleteMany({ where: { mfoId } });

  // Теперь можно удалить сам Mfo
  return await prisma.mfo.delete({ where: { id: mfoId } });
};

exports.hidden = async (id) => {
  const mfoId = Number(id);


  return await prisma.mfo.update({ where: { id: mfoId }, data: { isActive: false } });
};

