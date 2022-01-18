const { removeCommentById } = require("../models/comments.model")

module.exports.deleteComment = (req, res, next) => {
  removeCommentById(req.params.comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    })
}