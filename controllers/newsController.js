const { supabase } = require("../utils/supabaseClient");
const service = require("../services/newsService");

async function uploadFile(file) {
  if (!file) return null;

  const { data, error } = await supabase.storage
    .from("news-images")
    .upload(`news/${Date.now()}-${file.originalname}`, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from("news-images")
    .getPublicUrl(data.path);

  return publicUrl.publicUrl;
}

exports.create = async (req, res) => {
  try {
    const imageUrl = await uploadFile(req.file);

    const payload = {
      ...req.body,
      published: req.body.published === "true" || req.body.published === true,
      views: Number(req.body.views) || 0,
      readingMinutes: Number(req.body.readingMinutes) || 0,
      authorId: Number(req.body.authorId),
      newsCategoryId: Number(req.body.newsCategoryId),
      ...(imageUrl ? { image: imageUrl } : {}),
    };

    const news = await service.create(payload);
    res.status(201).json(news);
  } catch (err) {
    console.error("Ошибка при создании новости:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const imageUrl = await uploadFile(req.file);

    const payload = {
      ...req.body,
      published: req.body.published === "true" || req.body.published === true,
      views: Number(req.body.views) || 0,
      readingMinutes: Number(req.body.readingMinutes) || 0,
      authorId: Number(req.body.authorId),
      newsCategoryId: Number(req.body.newsCategoryId),
      ...(imageUrl ? { image: imageUrl } : {}),
    };

    const news = await service.update(req.params.id, payload);
    res.json(news);
  } catch (err) {
    console.error("Ошибка при обновлении новости:", err);
    res.status(400).json({ error: err.message });
  }
};


exports.getAll = async (req, res) => {
  const { limit } = req.query
  try {
    const result = await service.getAll(limit);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAllSitemap = async (req, res) => {
  try {
    const result = await service.getAllSitemap();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getBySlug = async (req, res) => {
  try {
    const result = await service.getBySlug(req.params.slug);
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const result = await service.getOne(req.params.id);
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getByCategorySlug = async (req, res) => {
  try {
    console.log(`[INFO] Request for news by category slug: ${req.params.slug}`);
    const result = await service.getByCategorySlug(req.params.slug);
    console.log(`[INFO] Found ${result.length} news articles for category slug '${req.params.slug}'`);

    if (!result || result.length === 0) {
      console.warn(`[WARN] No news found for category slug '${req.params.slug}'`);
      return res.status(404).json({ error: "No news found for this category slug" });
    }

    res.json(result);
  } catch (err) {
    console.error(`[ERROR] Error fetching news by category slug '${req.params.slug}':`, err);
    res.status(500).json({ error: err.message });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const totalViews = await service.getStatistics();
    res.json({ totalViews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.remove = async (req, res) => {
  try {
    await service.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
