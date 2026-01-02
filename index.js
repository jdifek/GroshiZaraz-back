require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { subDays, startOfDay } = require('date-fns');

const userRoutes = require("./routes/userRoutes");
const mfoRoutes = require("./routes/mfoRoutes");
const authorsRoutes = require("./routes/authorsRoutes");
const newsCategoriesRoutes = require("./routes/newsCategoriesRoutes");
const licenseRoutes = require("./routes/licenseRoutes");
const questionRoutes = require("./routes/questionRoutes");
const newsRoutes = require("./routes/newsRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes");
const siteReviewRoutes = require("./routes/siteReviewRoutes");
const siteQuestionRoutes = require("./routes/siteQuestionRoutes");
const faqRoutes = require("./routes/faqRoutes");
const mfoSatelliteKeysRoutes = require("./routes/mfoSatelliteKeysRoutes");
const mfoSatellitesRoutes = require("./routes/mfoSatellitesRoutes");
const authRoutes = require("./routes/authRoutes");
const questionAnswerRoutes = require("./routes/questionAnswerRoutes");
const expertsRoutes = require("./routes/expertRoutes.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api/question-answers", questionAnswerRoutes);
app.use("/api/mfo-satellite-keys", mfoSatelliteKeysRoutes);
app.use("/api/mfo-satellites", mfoSatellitesRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mfos", mfoRoutes);
app.use("/api/authors", authorsRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/category", newsCategoriesRoutes);
app.use("/api/experts", expertsRoutes);
app.use("/api/licenses", licenseRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/site-reviews", siteReviewRoutes);
app.use("/api/site-questions", siteQuestionRoutes);
app.use("/api/sitemap", require("./routes/sitemap"));

app.get("/api/dashboard", async (req, res) => {
  try {
    // 1. МФО
    const totalMfos = await prisma.mfo.count();
    const newMfos = await prisma.mfo.count({
      where: { createdAt: { gte: subDays(new Date(), 30) } },
    });

    // 2. Новости
    const totalNews = await prisma.news.count();
    const newArticles = await prisma.news.count({
      where: { createdAt: { gte: subDays(new Date(), 30) } },
    });

    // 3. Просмотры
    const totalViewsAgg = await prisma.news.aggregate({
      _sum: { views: true },
    });
    const totalViews = totalViewsAgg._sum.views || 0;

    // 4. Отзывы на модерации
    const pendingReviews = await prisma.review.count({
      where: { isModerated: false },
    });

    // 5. Активность за неделю (кол-во новых отзывов по дням)
    const weeklyViews = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = startOfDay(subDays(new Date(), i));
      const dayEnd = subDays(dayStart, -1); // конец дня
      const count = await prisma.review.count({
        where: { createdAt: { gte: dayStart, lt: dayEnd } },
      });
      weeklyViews.push(count);
    }

    // 6. Последние действия (3 последних по типу)
    const recentMfos = await prisma.mfo.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, name: true, createdAt: true },
    });

    const recentNews = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, title: true, createdAt: true },
    });

    const recentReviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, textOriginal: true, createdAt: true },
    });

    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, email: true, createdAt: true },
    });

    const recentActivity = [
      ...recentMfos.map((m) => ({ type: "mfo", title: `Добавлено МФО "${m.name}"`, time: m.createdAt })),
      ...recentNews.map((n) => ({ type: "article", title: `Опубликована статья "${n.title}"`, time: n.createdAt })),
      ...recentReviews.map((r) => ({ type: "review", title: `Новый отзыв`, time: r.createdAt })),
      ...recentUsers.map((u) => ({ type: "user", title: `Новый пользователь ${u.email}`, time: u.createdAt })),
    ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 10);

    res.json({
      mfos: totalMfos,
      monthlyStats: { newMfos, newArticles, newReviews: 0, totalUsers: await prisma.user.count() },
      totalNews,
      totalViews,
      pendingReviews,
      weeklyViews,
      recentActivity,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.get("/api/rates", async (req, res) => {
  try {
    const response = await fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json");
    const data = await response.json();

    const filtered = data.filter(item =>
      ["USD", "EUR", "GBP", "PLN", "CHF", "CAD", "JPY", "CNY"].includes(item.cc)
    );

    res.json({ date: data[0]?.exchangedate, rates: filtered });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении курсов" });
  }
});

app.get("/api/convert", async (req, res) => {
  const { from, to, amount } = req.query;
  if (!from || !to || !amount) return res.status(400).json({ error: "Missing parameters" });

  try {
    const response = await fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json");
    const data = await response.json();

    // Create rates object, explicitly including UAH with rate 1
    const rates = Object.fromEntries(
      data.map(item => [item.cc, item.rate])
    );
    rates['UAH'] = 1; // Add UAH with rate 1

    if (!rates[from] || !rates[to]) return res.status(400).json({ error: "Unsupported currency" });

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return res.status(400).json({ error: "Invalid amount" });

    const result = (parsedAmount * rates[from]) / rates[to];
    res.json({ result: result.toFixed(2), rate: (rates[from] / rates[to]).toFixed(4) });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при конвертации" });
  }
});

app.get("/api/dynamics", async (req, res) => {
  const { valcode } = req.query;
  if (!valcode) return res.status(400).json({ error: "Missing valcode" });

  const now = new Date();
  const endDate = formatDate(now);
  const startDate = formatDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));

  try {
    const [start, end] = await Promise.all([
      fetchRateOnDate(valcode, startDate),
      fetchRateOnDate(valcode, endDate),
    ]);

    if (!start || !end) return res.status(400).json({ error: "No rate data" });

    const diff = ((end - start) / start) * 100;

    res.json({
      currency: valcode,
      startRate: start,
      endRate: end,
      changePercent: diff.toFixed(2),
      direction: diff >= 0 ? "up" : "down",
    });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении динамики" });
  }
});

async function fetchRateOnDate(valcode, date) {
  const res = await fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${valcode}&date=${date}&json`);
  const data = await res.json();
  return data[0]?.rate;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

app.get("/api/keyrate", (req, res) => {
  res.json({
    rate: 20,
    effective_from: "2025-06-09",
    source: "https://bank.gov.ua/ua/monetary/stages"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});