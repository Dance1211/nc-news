const { getSingleArticle, patchArticle, getArticles, getCommentsByArticleId, postCommentByArticleId } = require('../controllers/articles.controllers');
const { validateArticleId } = require('../middleware/validation');

const articlesRouter = require('express').Router();

// Api stuff here

// Throw a 400 error for invalid article_id formats
articlesRouter
  .use('/:article_id', validateArticleId) 

articlesRouter
  .route('/')
  .get(getArticles);

articlesRouter
  .route('/:article_id')
  .get(getSingleArticle)
  .patch(patchArticle);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;