const { removeCommentById, updateCommentVotes } = require("../models/comments.model");
const { hasSpecificPropertyOnly } = require("../util/validation");

module.exports.deleteComment = (req, res, next) => {
	removeCommentById(req.params.comment_id)
		.then(() => {
			res.status(204).send();
		})
		.catch((err) => {
			next(err);
		});
};

module.exports.patchCommentVotes = (req, res, next) => {
	const { comment_id } = req.params;
	const { inc_votes } = req.body;
	if (!hasSpecificPropertyOnly(req.body, "inc_votes", Number)) {
		// Make sure the body is well formed
		next({ status: 400, msg: "Body does not have only one key of 'inc_votes'" });
	} else if (!Number.isInteger(inc_votes)) {
		// Check inc_votes is an integer
		next({ status: 400, msg: "inc_votes is not an integer"});
	} else {
		updateCommentVotes(comment_id, inc_votes)
			.then((comment) => {
				res.status(200).send({ comment });
			})
			.catch((err) => {
				next(err);
			});
	}
};