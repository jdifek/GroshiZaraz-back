const express = require("express");
const router = express.Router();
const sitemapController = require("../controllers/sitemapController");

router.get("/human", sitemapController.getHumanSitemap);

module.exports = router;