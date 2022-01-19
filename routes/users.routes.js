const { getUsers } = require('../controllers/users.controller');
const { validateId } = require('../middleware/validation');

const usersRouter = require('express').Router();

// api stuff here
usersRouter
  .use('/:user_id', validateId('user_id'));

usersRouter
  .route('/')
  .get(getUsers);

module.exports = usersRouter;