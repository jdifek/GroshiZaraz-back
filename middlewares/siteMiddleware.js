module.exports = function siteMiddleware(req, res, next) {
  req.isSite = req.headers["x-site"] === "true";
  next();
};
