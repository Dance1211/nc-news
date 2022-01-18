const { isValidPositiveInteger } = require("../util/validation");

module.exports.validateArticleId = (req, res, next) => {
  if (!isValidPositiveInteger(req.params.article_id)) {
    next({ status: 400, msg: "Invalid article id" });
  } else {
    next()
  }
}