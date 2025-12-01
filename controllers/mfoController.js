const service = require("../services/mfoService");
const { supabase } = require("../utils/supabaseClient");

const numericFields = [
  "rating", "reviews", "minAmount", "maxAmount",
  "minTerm", "maxTerm", "rateMin", "rateMax",
  "approvalRate", "ageFrom", "ageTo", "dailyRate", "commission"
];

const booleanFields = [
  "isActive", "isFirstLoanZero", "isInstantApproval",
  "isNoIncomeProof", "is24Support", "isSafeTransactions",
  "isFlexibleTerms"
];

function normalizeBody(body, logoUrl) {
  const data = {
    ...body,
    promoCodes: body.promoCodes ? JSON.parse(body.promoCodes) : [],
    ...(logoUrl ? { logo: logoUrl } : {}),
  };

  numericFields.forEach((field) => {
    if (data[field] !== undefined) data[field] = parseFloat(data[field]);
  });

  booleanFields.forEach((field) => {
    if (data[field] !== undefined) data[field] = data[field] === "true" || data[field] === true;
  });

  return data;
}

exports.create = async (req, res) => {
  try {
    let logoUrl;
    if (req.file) {
      const { data, error } = await supabase.storage
        .from("logos")
        .upload(`logos/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
          contentType: req.file.mimetype,
        });
      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from("logos")
        .getPublicUrl(data.path);

      logoUrl = publicUrl.publicUrl;
    }

    const body = normalizeBody(req.body, logoUrl);
    const result = await service.create(body);
    res.status(201).json(result);
  } catch (err) {
    console.error("Ошибка при создании МФО:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let logoUrl;
    if (req.file) {
      const { data, error } = await supabase.storage
        .from("logos")
        .upload(`logos/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
          contentType: req.file.mimetype,
        });
      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from("logos")
        .getPublicUrl(data.path);

      logoUrl = publicUrl.publicUrl;
    }

    const body = normalizeBody(req.body, logoUrl);
    const result = await service.update(req.params.id, body);
    res.json(result);
  } catch (err) {
    console.error("Ошибка при обновлении МФО:", err);
    res.status(400).json({ error: err.message });
  }
};

// Контроллер
exports.getAll = async (req, res) => {
  try {

    const result = await service.getAll();
    res.json(result);
  } catch (err) {
    console.error("Error in getAll:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.getAllSitemap = async (req, res) => {
  try {

    const result = await service.getAllSitemap();
    res.json(result);
  } catch (err) {
    console.error("Error in getAll:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.randomKeys = async (req, res) => {
  try {
    const result = await service.randomKeys();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getBySlugKey = async (req, res) => {
  try {
    const result = await service.getBySlugKey(req.params.slug);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getBySlug = async (req, res) => {
  try {
    const result = await service.getBySlug(req.params.slug, req.isSite); // передаём флаг
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


exports.remove = async (req, res) => {
  try {
    await service.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.hidden = async (req, res) => {
  try {
    await service.hidden(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
