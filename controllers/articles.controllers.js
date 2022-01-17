const { selectSingleArticle } = require("../models/articles.models");

module.exports.getSingleArticle = (req, res, next) => {
  const { article_id } = req.params;

  // Since article_id is a string, check it's a positive integer.
  if (!(/^[1-9]\d*$/.test(article_id))) {
    // Pass to the error middle-ware
    next({ status: 400, msg: "Invalid article id" });
  } else {
    selectSingleArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    })
  }
}