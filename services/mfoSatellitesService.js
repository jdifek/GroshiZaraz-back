const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll = () => prisma.mfoSatellite.findMany({
  include: { key: true, mfoLinks: { include: { mfo: true } } }
});

exports.getOne = (id) => prisma.mfoSatellite.findUnique({
  where: { id },
  include: { key: true, mfoLinks: { include: { mfo: true } } }
});

// Создание страницы с привязкой ко всем МФО
exports.createWithAllMfo = async (data) => {
  const allMfos = await prisma.mfo.findMany({ select: { id: true } });

  return prisma.mfoSatellite.create({
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

exports.update = (id, data) => prisma.mfoSatellite.update({
  where: { id },
  data
});

exports.remove = (id) => prisma.mfoSatellite.delete({ where: { id } });
