const prisma = require("../utils/prisma");
exports.getAll = async (
  sortBy = "rating",
  order = "desc",
  limit = 20,
  offset = 0
) => {
  const sortableFields = {
    rating: "rating",
    rate: "dailyRate",
    approval: "approvalRate",
    decisionTime: "decisionTime",
    maxAmount: "maxAmount",
  };

  const orderField = sortableFields[sortBy] || "rating";
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  // 1️⃣ Получаем МФО (БЕЗ reviews)
  const mfos = await prisma.mfo.findMany({
    include: {
      promoCodes: true,
      faqs: true,
    },
    orderBy: {
      [orderField]: order === "asc" ? "asc" : "desc",
    },
    take: safeLimit,
    skip: safeOffset,
  });

  // 2️⃣ Считаем отзывы
  const reviewCounts = await prisma.review.groupBy({
    by: ["targetId"],
    where: {
      targetType: "mfo",
      targetId: { in: mfos.map(m => m.id) },
      isModerated: true, // для сайта
    },
    _count: {
      _all: true,
    },
  });

  const reviewMap = new Map(
    reviewCounts.map(r => [r.targetId, r._count._all])
  );

  // 3️⃣ Подставляем В ПОЛЕ reviews
  return mfos.map(mfo => ({
    ...mfo,
    reviews: reviewMap.get(mfo.id) || 0, // 🔥 ВАЖНО
  }));
};



exports.getAllSitemap = async () => {
  return await prisma.mfo.findMany({
    select: {
      id: true,      // ✅ добавил
      slug: true,
      name: true,    // ✅ добавил
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
    include: { promoCodes: true, faqs: true }, // включаем промокоды
  });
};

exports.getBySlug = async (slug, isSite = false) => {
  const mfoWithData = await prisma.mfo.findUnique({
    where: { slug },
    include: { promoCodes: true,  faqs: true },
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






exports.create = async (data, faqs = [], promoCodes = []) => {
  const { ...mfoData } = data;

  return await prisma.mfo.create({
    data: {
      ...mfoData,
      
      // ✅ FAQ
      ...(faqs && Array.isArray(faqs) && faqs.length > 0
        ? {
            faqs: {
              create: faqs.map((faq) => ({
                questionRu: faq.questionRu,
                questionUk: faq.questionUk,
                answerRu: faq.answerRu,
                answerUk: faq.answerUk,
                order: faq.order ?? 0,
                isActive: faq.isActive ?? true,
              })),
            },
          }
        : {}),
      
      // ✅ PromoCodes
      ...(promoCodes && Array.isArray(promoCodes) && promoCodes.length > 0
        ? {
            promoCodes: {
              create: promoCodes.map((pc) => ({
                code: pc.code,
                discount: pc.discount,
                condition: pc.condition,
                validTill: new Date(pc.validTill),
              })),
            },
          }
        : {}),
    },
    include: {
      faqs: true,
      promoCodes: true,
    },
  });
};

exports.update = async (id, data, faqs = [], promoCodes = []) => {
  const { ...mfoData } = data;

  // 🔍 ДОБАВЬТЕ ЭТО ДЛЯ ОТЛАДКИ
  console.log("🔄 Service update:", {
    id,
    mfoData,
    faqs,
    promoCodes
  });

  return await prisma.mfo.update({
    where: { id: Number(id) },
    data: {
      ...mfoData,

      // ✅ FAQ
      ...(faqs && Array.isArray(faqs) && faqs.length > 0
        ? {
            faqs: {
              deleteMany: {},
              create: faqs.map((faq) => ({
                questionRu: faq.questionRu || "",
                questionUk: faq.questionUk || "",
                answerRu: faq.answerRu || "",
                answerUk: faq.answerUk || "",
                order: faq.order ?? 0,
                isActive: faq.isActive ?? true,
              })),
            },
          }
        : {}),

      // ✅ PromoCodes
      ...(promoCodes && Array.isArray(promoCodes) && promoCodes.length > 0
        ? {
            promoCodes: {
              deleteMany: {},
              create: promoCodes.map((pc) => ({
                code: pc.code || "",
                discount: pc.discount || "",
                condition: pc.condition || "",
                validTill: pc.validTill ? new Date(pc.validTill) : new Date(),
              })),
            },
          }
        : {}),
    },
    include: {
      faqs: true,
      promoCodes: true,
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

exports.getBySlugUniversal = async (slug, sortBy = "rating") => {
  try {
    const sortableFields = {
      rating: "rating",
      rate: "dailyRate",
      approval: "approvalRate",
      decisionTime: "decisionTime",
      maxAmount: "maxAmount",
    };
    const orderField = sortableFields[sortBy] || "rating";

    // 1️⃣ Сначала ищем в ключах
    let result = await prisma.mfoSatelliteKey.findFirst({
      where: {
        OR: [{ slugRu: slug }, { slugUk: slug }],
      },
      include: {
        satellites: true,
        mfoLinks: { include: { mfo: true } },
      },
    });

    // 2️⃣ Если не нашли в ключах, ищем в сателлитах
    if (!result) {
      const satellite = await prisma.mfoSatellite.findFirst({
        where: {
          OR: [{ slugRu: slug }, { slugUk: slug }],
        },
        include: {
          key: true,
          mfoLinks: { include: { mfo: true } },
        },
      });

      if (!satellite) return null;

      // Преобразуем сателлит к формату ключа для единообразия
      result = {
        id: satellite.id,
        keyUk: satellite.titleUk,
        keyRu: satellite.titleRu,
        slugUk: satellite.slugUk,
        slugRu: satellite.slugRu,
        metaTitleUk: satellite.metaTitleUk,
        metaTitleRu: satellite.metaTitleRu,
        metaDescUk: satellite.metaDescUk,
        metaDescRu: satellite.metaDescRu,
        titleUk: satellite.titleUk,
        titleRu: satellite.titleRu,
        descriptionUk: satellite.descriptionUk,
        descriptionRu: satellite.descriptionRu,
        seoContentUk: satellite.seoContentUk,
        seoContentRu: satellite.seoContentRu,
        createdAt: satellite.createdAt,
        updatedAt: satellite.updatedAt,
        satellites: [], // сателлит не имеет дочерних сателлитов
        mfoLinks: satellite.mfoLinks,
        isSatellite: true, // флаг что это сателлит
        parentKey: satellite.key, // родительский ключ
      };
    }

    // 3️⃣ Сортировка МФО
    if (result.mfoLinks && result.mfoLinks.length > 0) {
      result.mfoLinks.sort((a, b) => {
        const aVal = a.mfo?.[orderField] ?? 0;
        const bVal = b.mfo?.[orderField] ?? 0;
        return bVal - aVal;
      });
    }

    // 4️⃣ Расчет статистики
    const mfos = result.mfoLinks.map(link => link.mfo).filter(Boolean);
    const totalMfos = mfos.length;
    
    const averageRate = totalMfos > 0 
      ? (mfos.reduce((sum, mfo) => {
          const avgMfoRate = (mfo.rateMin + mfo.rateMax) / 2;
          return sum + avgMfoRate;
        }, 0) / totalMfos).toFixed(2)
      : 0;

    return {
      ...result,
      stats: {
        totalMfos,
        averageRate: parseFloat(averageRate)
      }
    };
  } catch (err) {
    console.error("❌ Error in getBySlugUniversal:", err);
    throw err;
  }
};