const prisma = require("../utils/prisma");

exports.getAll = () => prisma.mfoSatelliteKey.findMany({
  include: { satellites: true, mfoLinks: { include: { mfo: true } } }
});
exports.getBySlug = (slug) => prisma.mfoSatelliteKey.findFirst({
  where: {
    OR: [
      { slugRu: slug },
      { slugUk: slug }
    ]
  },
  include: {
    satellites: true,
    mfoLinks: { include: { mfo: true } }
  }
});

exports.getOne = (id) => prisma.mfoSatelliteKey.findUnique({
  where: { id },
  include: { satellites: true, mfoLinks: { include: { mfo: true } } }
});
exports.getShort = (q) => {
  const where = {};

  if (q) {
    where.OR = [
      { keyUk: { contains: q, mode: "insensitive" } },
      { keyRu: { contains: q, mode: "insensitive" } },
    ];
  }

  return prisma.mfoSatelliteKey.findMany({
    where,
    select: {
      id: true,
      keyUk: true,
      keyRu: true,
    },
    orderBy: { id: "asc" },
  });
};



// Создание ключа и привязка ко всем МФО
exports.createWithAllMfo = async (data) => {
  const allMfos = await prisma.mfo.findMany({ select: { id: true } });

  return prisma.mfoSatelliteKey.create({
    data: {
      ...data,
      mfoLinks: {
        create: allMfos.map(mfo => ({
          mfo: { connect: { id: mfo.id } }
        }))
      }
    },
    include: { mfoLinks: { include: { mfo: true } } }
  });
};

exports.update = (id, data) => prisma.mfoSatelliteKey.update({
  where: { id },
  data
});

exports.remove = (id) => prisma.mfoSatelliteKey.delete({ where: { id } });

exports.updateMfoLinks = async (keyId, addMfoIds, removeMfoIds) => {
  // Начинаем транзакцию
  return prisma.$transaction(async (tx) => {
    // Удаляем связи
    if (removeMfoIds.length > 0) {
      await tx.mfoSatelliteKeyMfo.deleteMany({
        where: {
          keyId: keyId,
          mfoId: { in: removeMfoIds }
        }
      });
    }

    // Добавляем новые связи
    if (addMfoIds.length > 0) {
      // Проверяем, какие связи уже существуют
      const existingLinks = await tx.mfoSatelliteKeyMfo.findMany({
        where: {
          keyId: keyId,
          mfoId: { in: addMfoIds }
        },
        select: { mfoId: true }
      });

      const existingMfoIds = existingLinks.map(link => link.mfoId);
      const newMfoIds = addMfoIds.filter(id => !existingMfoIds.includes(id));

      if (newMfoIds.length > 0) {
        await tx.mfoSatelliteKeyMfo.createMany({
          data: newMfoIds.map(mfoId => ({
            keyId: keyId,
            mfoId: mfoId
          }))
        });
      }
    }

    // Возвращаем обновленный ключ
    return tx.mfoSatelliteKey.findUnique({
      where: { id: keyId },
      include: { 
        satellites: true, 
        mfoLinks: { 
          include: { mfo: true } 
        } 
      }
    });
  });
};

exports.addMfoToKey = async (keyId, mfoId) => {
  // Проверяем, не существует ли уже такая связь
  const existingLink = await prisma.mfoSatelliteKeyMfo.findUnique({
    where: {
      keyId_mfoId: { keyId, mfoId }
    }
  });

  if (existingLink) {
    throw new Error('МФО уже привязано к этому ключу');
  }

  await prisma.mfoSatelliteKeyMfo.create({
    data: { keyId, mfoId }
  });

  return prisma.mfoSatelliteKey.findUnique({
    where: { id: keyId },
    include: { 
      satellites: true, 
      mfoLinks: { 
        include: { mfo: true } 
      } 
    }
  });
};

exports.removeMfoFromKey = async (keyId, mfoId) => {
  return prisma.mfoSatelliteKeyMfo.delete({
    where: {
      keyId_mfoId: { keyId, mfoId }
    }
  });
};