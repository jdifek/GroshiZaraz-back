const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll = () => prisma.mfoSatelliteKey.findMany({
  include: { satellites: true, mfoLinks: { include: { mfo: true } } }
});

exports.getOne = (id) => prisma.mfoSatelliteKey.findUnique({
  where: { id },
  include: { satellites: true, mfoLinks: { include: { mfo: true } } }
});

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
