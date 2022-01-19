const { getUsers, getUserByUsername } = require("../controllers/users.controller");
const { validateUsername } = require("../middleware/validation");

const usersRouter = require("express").Router();

// api stuff here
usersRouter
	.use("/:username", validateUsername);

usersRouter
	.route("/")
	.get(getUsers);

usersRouter
	.route("/:username")
	.get(getUserByUsername);

module.exports = usersRouter;