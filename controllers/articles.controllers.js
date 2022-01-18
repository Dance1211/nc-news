const { selectSingleArticle, updateArticleVotes, selectArticles, selectCommentsByArticleId } = require("../models/articles.models");
const { isValidPositiveInteger, hasSpecificPropertyOnly } = require("../util/validation");


module.exports.getArticles = (req, res, next) => {
  selectArticles(req.query)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    })
}

module.exports.getSingleArticle = (req, res, next) => {
  const { article_id } = req.params;


  selectSingleArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    })
}

module.exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (!hasSpecificPropertyOnly(req.body, "inc_votes", Number)) {
    // Fail if the body is incorrectly formatted
    next({ status: 400, msg: "Ill-formed body" });
  } else if (!Number.isInteger(inc_votes)) {
    // Fail if inc_votes is not an integer
    next({ status: 400, msg: "inc_votes is not an integer" })
  } else {
    updateArticleVotes(article_id, inc_votes)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    })
}