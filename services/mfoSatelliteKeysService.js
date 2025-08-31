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
