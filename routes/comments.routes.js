const { deleteComment } = require('../controllers/comments.controller');
const { validateId } = require('../middleware/validation');

const commentsRouter = require('express').Router();

// api stuff here
commentsRouter
  .use('/:comment_id', validateId("comment_id"));

commentsRouter
  .route('/:comment_id')
  .delete(deleteComment)

module.exports = commentsRouter;