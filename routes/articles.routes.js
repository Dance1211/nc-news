const { getSingleArticle, patchArticle, getArticles, getCommentsByArticleId, postCommentByArticleId } = require('../controllers/articles.controller');
const { validateArticleId, validateId } = require('../middleware/validation');

const articlesRouter = require('express').Router();

// Api stuff here

// Throw a 400 error for invalid article_id formats
articlesRouter
  .use('/:article_id', validateId("article_id")) 

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