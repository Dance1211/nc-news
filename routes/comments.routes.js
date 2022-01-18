const { deleteComment } = require('../controllers/comments.controller');
const { validateCommentId } = require('../middleware/validation');

const commentsRouter = require('express').Router();

// api stuff here
commentsRouter
  .use('/:comment_id', validateCommentId);

commentsRouter
  .route('/:comment_id')
  .delete(deleteComment)

module.exports = commentsRouter;