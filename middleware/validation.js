const { checkExists } = require("../models/util");
const { isValidPositiveInteger } = require("../util/validation");

module.exports.validateArticleId = (req, res, next) => {
  const { article_id } = req.params
  // Check the article_id is of the right format
  if (!isValidPositiveInteger(article_id)) {
    next({ status: 400, msg: "Invalid article id" });
  } else {
    // Check the article exists in the database
    checkExists(require('../db/connection'), 'articles', 'article_id', article_id, "Article not found")
      .then(() => {
        // Article exists. Go for it.
        next();
      })
      .catch((err) => {
        // Article doesn't exist so just leave early.
        next(err);
      })
  }
}