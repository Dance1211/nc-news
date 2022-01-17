const { selectTopics } = require("../models/topics.model");

module.exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({topics});
    })
    .catch((err) => {
      next(err);
    })
}