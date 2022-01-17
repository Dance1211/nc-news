const { readEndpoints } = require("../models/api.model")

module.exports.getEndpoints = (req, res, next) => {
  readEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch((err) => {
      next({status: 500, msg: "Failed to access endpoints data"});
    })
}