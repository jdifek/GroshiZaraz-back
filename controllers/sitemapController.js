/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://finoglyad.com.ua',
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/api/*'],
  
  additionalPaths: async () => {
    const result = [];
    
    // 🔥 Статические страницы для UK и RU
    const staticPages = [
      { path: '/', priority: 1.0 },
      { path: '/mfos', priority: 0.8 },
      { path: '/about', priority: 0.8 },
      { path: '/privacy', priority: 0.5 },
      { path: '/terms', priority: 0.5 },
      { path: '/reviews', priority: 0.7 },
      { path: '/journal', priority: 0.8 },
      { path: '/sitemap', priority: 0.6 },
      { path: '/currency-exchange', priority: 0.7 }, // ✅ ДОБАВИТЬ
    ];

    for (const page of staticPages) {
      result.push({
        loc: `/uk${page.path}`,
        priority: page.priority,
        changefreq: 'weekly',
      });
      result.push({
        loc: `/ru${page.path}`,
        priority: page.priority,
        changefreq: 'weekly',
      });
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL_SITEMAP;
    const subPaths = ["reviews", "contacts", "questions", "promocodes"];

    if (!API_URL) {
      console.log('⚠️ API недоступен – динамические пути пропускаем');
      return result;
    }

    try {
      const sitemapResponse = await fetch(`${API_URL}api/sitemap/human`, { 
        signal: AbortSignal.timeout(10000) 
      });
      
      if (!sitemapResponse.ok) {
        console.error('❌ Ошибка получения sitemap');
        return result;
      }

      const data = await sitemapResponse.json();

      // 1) MFO - отдельные страницы МФО
      // Путь: /[lang]/mfos/[slug]
      if (data.mfos && data.mfos.length > 0) {
        for (const mfo of data.mfos) {
          // ✅ Главные страницы МФО
          result.push({ 
            loc: `/uk/mfos/${mfo.slug}`, 
            lastmod: mfo.updatedAt, 
            priority: 0.9 
          });
          result.push({ 
            loc: `/ru/mfos/${mfo.slug}`, 
            lastmod: mfo.updatedAt, 
            priority: 0.9 
          });

          // ✅ Вложенные страницы МФО
          for (const sub of subPaths) {
            result.push({
              loc: `/uk/mfos/${mfo.slug}/${sub}`,
              lastmod: mfo.updatedAt,
              priority: 0.7,
            });
            result.push({
              loc: `/ru/mfos/${mfo.slug}/${sub}`,
              lastmod: mfo.updatedAt,
              priority: 0.7,
            });
          }
        }
        console.log(`✅ MFO pages: ${data.mfos.length * 2 * (1 + subPaths.length)}`);
      }

      // 2) NEWS/Journal
      // Путь: /[lang]/journal/article/[slug]
      if (data.news && data.news.length > 0) {
        for (const post of data.news) {
          result.push({ 
            loc: `/uk/journal/article/${post.slugUk}`, 
            lastmod: post.updatedAt, 
            priority: 0.8 
          });
          result.push({ 
            loc: `/ru/journal/article/${post.slug}`, 
            lastmod: post.updatedAt, 
            priority: 0.8 
          });
        }
        console.log(`✅ News articles: ${data.news.length * 2}`);
      }

      // 3) MFO Satellite Keys - ключевые страницы категорий
      // Путь: /[lang]/mfo/[slug] ← БЕЗ 's'!
      if (data.satelliteKeys && data.satelliteKeys.length > 0) {
        for (const sat of data.satelliteKeys) {
          if (sat.slugUk) {
            result.push({
              loc: `/uk/mfo/${sat.slugUk}`, // ✅ БЕЗ 's'
              lastmod: sat.updatedAt,
              priority: 0.8, // ✅ Выше приоритет для категорий
              changefreq: 'weekly',
            });
          }
          if (sat.slugRu) {
            result.push({
              loc: `/ru/mfo/${sat.slugRu}`, // ✅ БЕЗ 's'
              lastmod: sat.updatedAt,
              priority: 0.8,
              changefreq: 'weekly',
            });
          }
        }
        console.log(`✅ Satellite keys: ${data.satelliteKeys.length * 2}`);
      }

      // 4) MFO Satellites - подкатегории
      // Путь: /[lang]/mfo/[slug] ← тоже БЕЗ 's'!
      if (data.satellites && data.satellites.length > 0) {
        for (const sat of data.satellites) {
          if (sat.slugUk) {
            result.push({
              loc: `/uk/mfo/${sat.slugUk}`, // ✅ БЕЗ 's'
              lastmod: sat.updatedAt,
              priority: 0.7,
              changefreq: 'weekly',
            });
          }
          if (sat.slugRu) {
            result.push({
              loc: `/ru/mfo/${sat.slugRu}`, // ✅ БЕЗ 's'
              lastmod: sat.updatedAt,
              priority: 0.7,
              changefreq: 'weekly',
            });
          }
        }
        console.log(`✅ MFO satellites: ${data.satellites.length * 2}`);
      }

      console.log(`✨ TOTAL paths in sitemap: ${result.length}`);
      
    } catch (err) {
      console.error('❌ Ошибка загрузки dynamic sitemap:', err.message);
    }

    return result;
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    additionalSitemaps: [],
  },
};