module.exports.serverError = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status)
  } else {
    res.status(500).send({msg: "Internal server error"});
    console.log("Error:", err);
  }
}

module.exports.invalidEndpointError = (req, res) => {
  res.status(404).send({msg: `Endpoint '${req.path}' does not exist`});
}