const { getTopics, postTopic } = require("../controllers/topics.controller");

const topicsRouter = require("express").Router();

// api stuff here
topicsRouter
  .route("/")
  .get(getTopics)
  .post(postTopic);

module.exports = topicsRouter;