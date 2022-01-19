const express = require("express");
const apiRouter = require("./routes/api.routes");
const app = express();
const errors = require("./middleware/errors");

app.use(express.json());

app.use("/api", apiRouter);

// Handle errors
app.use(errors.serverError);

// Handle general 404's
app.use(errors.invalidEndpointError);

module.exports = app;