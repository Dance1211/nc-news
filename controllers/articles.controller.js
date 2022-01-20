const { selectSingleArticle, updateArticleVotes, selectArticles, selectCommentsByArticleId, insertCommentByArticleId } = require("../models/articles.model");
const { hasSpecificPropertyOnly, isValidPositiveInteger } = require("../util/validation");


module.exports.getArticles = (req, res, next) => {
	const {
		sort_by = "created_at",
		order = "DESC",
		p = 1,
		limit = 10,
		} = req.query;

	// Validate queries via whitelist
	const validSortBy = ["author", "title", "article_id", "topic", "created_at", "votes", "comment_count"];
	const validOrder = ["ASC", "DESC"];
	if (!validSortBy.includes(sort_by)) {
		next({ status: 400, msg: "Invalid sort_by query" });
	}
	if (!validOrder.includes(order.toUpperCase())) {
		next({ status: 400, msg: "Invalid order query"});
	}
	if (!isValidPositiveInteger(p)) {
		next({status: 400, msg: "Invalid (p)age query"})
	}
	if (!isValidPositiveInteger(limit)) {
		next({status: 400, msg: "Invalid limit query"})
	}

	selectArticles(req.query)
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch((err) => {
			next(err);
		});
};

module.exports.getSingleArticle = (req, res, next) => {
	const { article_id } = req.params;

	selectSingleArticle(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch((err) => {
			next(err);
		});
};

module.exports.patchArticle = (req, res, next) => {
	const { article_id } = req.params;
	const { inc_votes } = req.body;

	if (!hasSpecificPropertyOnly(req.body, "inc_votes", Number)) {
		// Fail if the body is incorrectly formatted
		next({ status: 400, msg: "Ill-formed body" });
	} else if (!Number.isInteger(inc_votes)) {
		// Fail if inc_votes is not an integer
		next({ status: 400, msg: "inc_votes is not an integer" });
	} else {
		updateArticleVotes(article_id, inc_votes)
			.then((article) => {
				res.status(200).send({ article });
			})
			.catch((err) => {
				next(err);
			});
	}
};

module.exports.getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;

	selectCommentsByArticleId(article_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch((err) => {
			next(err);
		});
};

module.exports.postCommentByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	const { username, body } = req.body;

	if (!username || !body || Object.keys(req.body).length != 2) {
		next({ status: 400, msg: "Malformed body" });
		return;
	}

	insertCommentByArticleId(article_id, username, body)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch((err) => {
			next(err);
		});
};