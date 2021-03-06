const articlesRouter = require("./articles.routes");
const commentsRouter = require("./comments.routes");
const topicsRouter = require("./topics.routes");
const usersRouter = require("./users.routes");
const {
	getEndpoints
} = require("../controllers/api.controller");

const apiRouter = require("express").Router();


// Sub routers
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

apiRouter.get("/", getEndpoints);

module.exports = apiRouter;