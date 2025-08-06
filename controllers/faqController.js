const service = require("../services/faqService");

// --- Categories ---

exports.getAllCategories = async (req, res) => {
  try {
    const result = await service.getAllCategories();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const result = await service.getCategoryById(req.params.id);
    if (!result) return res.status(404).json({ error: "Category not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const result = await service.createCategory(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const result = await service.updateCategory(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeCategory = async (req, res) => {
  try {
    await service.removeCategory(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// --- Questions ---

exports.getAllQuestions = async (req, res) => {
  try {
    const result = await service.getAllQuestions();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const result = await service.getQuestionById(req.params.id);
    if (!result) return res.status(404).json({ error: "Question not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const result = await service.createQuestion(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const result = await service.updateQuestion(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeQuestion = async (req, res) => {
  try {
    await service.removeQuestion(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
