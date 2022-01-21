const { selectTopics, insertTopic } = require("../models/topics.model");

module.exports.getTopics = (req, res, next) => {
	selectTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch((err) => {
			next(err);
		});
};

module.exports.postTopic = (req, res, next) => {
	const {slug, description} = req.body;
	if (!slug || !description || Object.keys(req.body).length !== 2) {
		next({status: 400, msg: "Malformed body"});
	}
	insertTopic(slug, description)
		.then((topic) => {
			res.status(201).send({topic});
		})
		.catch((err) => {
			next(err);
		})
}