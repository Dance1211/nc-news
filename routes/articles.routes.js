const { getSingleArticle, patchArticle, getArticles } = require('../controllers/articles.controllers');

const articlesRouter = require('express').Router();

// api stuff here

articlesRouter
  .route('/')
  .get(getArticles);

articlesRouter
  .route('/:article_id')
  .get(getSingleArticle)
  .patch(patchArticle);

module.exports = articlesRouter;