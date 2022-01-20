const { getSingleArticle, patchArticle, getArticles, getCommentsByArticleId, postCommentByArticleId, postArticle } = require("../controllers/articles.controller");
const { validateId } = require("../middleware/validation");

const articlesRouter = require("express").Router();

// Api stuff here

// Throw a 400 error for invalid article_id formats
articlesRouter
	.use("/:article_id", validateId("article_id")); 

articlesRouter
	.route("/")
	.get(getArticles)
	.post(postArticle);

articlesRouter
	.route("/:article_id")
	.get(getSingleArticle)
	.patch(patchArticle);

articlesRouter
	.route("/:article_id/comments")
	.get(getCommentsByArticleId)
	.post(postCommentByArticleId);

module.exports = articlesRouter;