const express = require("express");
const apiRouter = require("./routes/api.routes");
const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  res.status(500).send(err);
})

module.exports = app;