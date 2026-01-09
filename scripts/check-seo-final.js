// check-seo-final-fixed.js
const https = require('https');
const { URL } = require('url');

const fetchWithRedirects = (url, redirectCount = 0) => {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    https.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let newUrl = res.headers.location;
        if (!newUrl.startsWith('http')) {
          newUrl = new URL(newUrl, url).href;
        }
        return fetchWithRedirects(newUrl, redirectCount + 1).then(resolve);
      }

      let html = '';
      res.on('data', (chunk) => html += chunk);
      res.on('end', () => resolve({ html }));
    }).on('error', () => resolve({ html: '' }));
  });
};

const checkPage = async (url) => {
  const { html } = await fetchWithRedirects(url);
  
  const canonical = html.includes('rel="canonical"') ? 1 : 0;
  // ✅ ИСПРАВЛЕНО: ищем hrefLang с заглавной L
  const alternates = (html.match(/hrefLang=/g) || []).length;
  
  return { url, canonical, alternates };
};

const getSitemapUrls = async (sitemapUrl) => {
  const { html } = await fetchWithRedirects(sitemapUrl);
  return (html.match(/<loc>(.*?)<\/loc>/g) || []).map(m => m.replace(/<\/?loc>/g, ''));
};

(async () => {
  console.log('🔍 SEO Alternates Checker (Final Fixed)\n');
  
  console.log('📥 Fetching sitemap index...');
  const sitemapIndex = await getSitemapUrls('https://finoglyad.com.ua/sitemap.xml');
  console.log(`Found ${sitemapIndex.length} sitemap files\n`);
  
  let total = 0, passed = 0, failed = 0;
  const failedUrls = [];
  
  for (const sitemap of sitemapIndex) {
    console.log(`📄 Processing: ${sitemap.split('/').pop()}`);
    const urls = await getSitemapUrls(sitemap);
    
    for (const url of urls) {
      total++;
      
      if (total % 20 === 0) {
        console.log(`  ⏳ Checked ${total} URLs... (Passed: ${passed}, Failed: ${failed})`);
      }
      
      const result = await checkPage(url);
      
      if (result.canonical === 1 && result.alternates >= 2) {
        passed++;
      } else {
        failed++;
        failedUrls.push(`❌ ${url} (C:${result.canonical} A:${result.alternates})`);
      }
    }
  }
  
  console.log('\n════════════════════════════════════════');
  console.log('📊 Final Summary:');
  console.log('════════════════════════════════════════');
  console.log(`Total URLs:  ${total}`);
  console.log(`Passed:      ${passed} ✅ (${(passed*100/total).toFixed(1)}%)`);
  console.log(`Failed:      ${failed} ❌ (${(failed*100/total).toFixed(1)}%)`);
  
  if (failed > 0 && failed <= 30) {
    console.log('\n❌ Failed URLs:');
    console.log('────────────────────────────────────────');
    failedUrls.forEach(url => console.log(url));
  }
  
  console.log('\n════════════════════════════════════════');
  console.log('✅ Check completed!');
})();