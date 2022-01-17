const { getSingleArticle } = require('../controllers/articles.controllers');

const articlesRouter = require('express').Router();

// api stuff here
articlesRouter.get('/:article_id', getSingleArticle);

module.exports = articlesRouter;