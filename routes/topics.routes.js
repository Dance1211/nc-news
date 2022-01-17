const { getTopics } = require('../controllers/topics.controller');

const topicsRouter = require('express').Router();

// api stuff here
topicsRouter.get('/', getTopics);

module.exports = topicsRouter;