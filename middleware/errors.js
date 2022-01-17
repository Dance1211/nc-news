module.exports.serverError = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({msg: err.msg});
  } else {
    console.log(err);
    res.status(500).send({msg: "Internal server error"});
  }
}

module.exports.invalidEndpointError = (req, res) => {
  res.status(404).send({msg: `Endpoint '${req.path}' does not exist`});
}