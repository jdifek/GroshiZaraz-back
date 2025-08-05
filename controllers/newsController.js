const service = require("../services/newsService");

exports.getAll = async (req, res) => {
  try {
    const result = await service.getAll();
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
exports.create = async (req, res) => {
  try {
    const result = await service.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await service.update(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
