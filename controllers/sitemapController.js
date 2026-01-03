const MfoService = require("../services/mfoService");
const NewsService = require("../services/newsService");
const AuthorService = require("../services/authorsService"); // ✅ ДОБАВИТЬ
const MfoSatelliteKeyService = require("../services/mfoSatelliteKeysService");
const MfoSatelliteService = require("../services/mfoSatellitesService");

exports.getHumanSitemap = async (req, res) => {
  try {
    const [mfos, news, newsCategories, authors, satelliteKeys, satellites] = await Promise.all([
      MfoService.getAllSitemap(),
      NewsService.getAllSitemap(),
      NewsService.getAllCategoriesSitemap(), // ✅ ВЫНЕСЛИ
      AuthorService.getAllSitemap(), // ✅ ВЫНЕСЛИ
      MfoSatelliteKeyService.getAllSitemap(),
      MfoSatelliteService.getAllSitemap(),
    ]);

    const sitemap = {
      static: [
        { titleUk: "Головна", titleRu: "Главная", pathUk: "/", pathRu: "/" },
        { titleUk: "МФО", titleRu: "МФО", pathUk: "/mfos", pathRu: "/mfos" },
        { titleUk: "Обмін валют", titleRu: "Обмен валют", pathUk: "/currency-exchange", pathRu: "/currency-exchange" },
        { titleUk: "Про нас", titleRu: "О нас", pathUk: "/about", pathRu: "/about" },
        { titleUk: "Відгуки", titleRu: "Отзывы", pathUk: "/reviews", pathRu: "/reviews" },
        { titleUk: "Журнал", titleRu: "Журнал", pathUk: "/journal", pathRu: "/journal" },
        { titleUk: "Конфіденційність", titleRu: "Конфиденциальность", pathUk: "/privacy", pathRu: "/privacy" },
        { titleUk: "Умови", titleRu: "Условия", pathUk: "/terms", pathRu: "/terms" },
        { titleUk: "Карта сайту", titleRu: "Карта сайта", pathUk: "/sitemap", pathRu: "/sitemap" },
      ],
      mfos: mfos.map(m => ({
        id: m.id,
        name: m.name,
        slug: m.slug,
        updatedAt: m.updatedAt,
      })),
      news: news.map(n => ({
        id: n.id,
        title: n.title,
        titleUk: n.titleUk,
        slug: n.slug,
        slugUk: n.slugUk,
        updatedAt: n.updatedAt,
      })),
      newsCategories: newsCategories.map(c => ({
        id: c.id,
        name: c.name,
        nameUk: c.nameUk,
        slug: c.slug,
      })),
      authors: authors.map(a => ({
        id: a.id,
        name: a.name,
        nameUk: a.nameUk,
        slug: a.slug,
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