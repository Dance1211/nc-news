const { selectSingleArticle, updateArticleVotes } = require("../models/articles.models");
const { isValidPositiveInteger, hasSpecificPropertyOnly } = require("../util/validation");

module.exports.getSingleArticle = (req, res, next) => {
  const { article_id } = req.params;

  // Since article_id is a string, check it's a positive integer.
  if (!isValidPositiveInteger(article_id)) {
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

module.exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (!isValidPositiveInteger(article_id)) {
    // Fail if article_id is of the wrong form
    next({ status: 400, msg: "Invalid article id" });
  } else if(!hasSpecificPropertyOnly(req.body, "inc_votes", Number) || !Number.isInteger(inc_votes)) {
    // Fail if the body is incorrectly formatted
    next({ status: 400, msg: "Ill-formed body"});
  } else {
    updateArticleVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({article});
    })
    .catch((err) => {
      next(err);
    });
  }
}