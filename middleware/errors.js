module.exports.serverError = (err, req, res, next) => {
  res.status(500).send({msg: "Internal server error"});
}

module.exports.invalidEndpointError = (req, res, next) => {
  res.status(404).send({msg: "Endpoint does not exist"});
}