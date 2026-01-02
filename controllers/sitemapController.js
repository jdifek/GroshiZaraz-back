const MfoService = require("../services/mfoService");
const NewsService = require("../services/newsService");
const MfoSatelliteKeyService = require("../services/mfoSatelliteKeysService");
const MfoSatelliteService = require("../services/mfoSatellitesService");

exports.getHumanSitemap = async (req, res) => {
  try {
    const [mfos, news, satelliteKeys, satellites] = await Promise.all([
      MfoService.getAllSitemap(),
      NewsService.getAllSitemap(),
      MfoSatelliteKeyService.getAllSitemap(),
      MfoSatelliteService.getAllSitemap(),
    ]);

    const sitemap = {
      static: [
        { titleUk: "Головна", titleRu: "Главная", pathUk: "/", pathRu: "/" },
        { titleUk: "Про нас", titleRu: "О нас", pathUk: "/about", pathRu: "/about" },
        { titleUk: "Відгуки", titleRu: "Отзывы", pathUk: "/reviews", pathRu: "/reviews" },
        { titleUk: "Журнал", titleRu: "Журнал", pathUk: "/journal", pathRu: "/journal" },
        { titleUk: "Конфіденційність", titleRu: "Конфиденциальность", pathUk: "/privacy", pathRu: "/privacy" },
        { titleUk: "Умови", titleRu: "Условия", pathUk: "/terms", pathRu: "/terms" },
      ],
      mfos: mfos.map(m => ({
        id: m.id,
        name: m.name,
        slug: m.slug,
        updatedAt: m.updatedAt,
      })),
      news: news.map(n => ({ // ❌ БЫЛО: m => { без return
        id: n.id,
        title: n.title,        // ✅ RU заголовок
        titleUk: n.titleUk,    // ✅ UK заголовок
        slug: n.slug,          // ✅ RU slug
        slugUk: n.slugUk,      // ✅ UK slug
        updatedAt: n.updatedAt,
      })),
      satelliteKeys: satelliteKeys.map(s => ({
        id: s.id,
        titleUk: s.titleUk,
        titleRu: s.titleRu,
        slugUk: s.slugUk,
        slugRu: s.slugRu,
        updatedAt: s.updatedAt,
      })),
      satellites: satellites.map(s => ({
        id: s.id,
        titleUk: s.titleUk,
        titleRu: s.titleRu,
        slugUk: s.slugUk,
        slugRu: s.slugRu,
        updatedAt: s.updatedAt,
      })),
    };

    res.json(sitemap);
  } catch (error) {
    console.error("Ошибка получения sitemap:", error);
    res.status(500).json({ error: error.message });
  }
};