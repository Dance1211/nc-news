const { checkExists } = require("../models/util");
const { isValidPositiveInteger } = require("../util/validation");

/**
 * Returns a middleware function to valididate the given request parameter key,
 * checking that it's a valid positive integer (which otherwise returns a 400)
 * and that it exists in the database (which otherwise returns a 404)
 * @param {String} key The key to be checked. Must be of the form "*_id"
 * @returns A middleware function that will valididate the id
 */
module.exports.validateId = (key) => {
	return (req, res, next) => {
		const id = req.params[key];
		const keyWithout_ID = key.slice(0, -3); // Remove "_id" at end of key
		const table = keyWithout_ID + "s"; // Make it plural
		if (!isValidPositiveInteger(id)) {
			next({ status: 400, msg: `Invalid ${key}` });
		} else {
			checkExists(require("../db/connection"), table, key, id,
				`${keyWithout_ID[0].toUpperCase() + keyWithout_ID.slice(1)} not found`)
				.then(() => {
					next();
				})
				.catch((err) => {
					next(err);
				});
		}
	};
};

module.exports.validateUsername = (req, res, next) => {
	const { username } = req.params;
	checkExists(require("../db/connection"), "users", "username",
		req.params.username, `User ${username} not found`)
		.then(() => {
			next();
		})
		.catch((err) => {
			next(err);
		});
};