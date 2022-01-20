const devData = require("../data/development-data/index.js");
const seed = require("./seed.js");
const db = require("../connection.js");

// After running the seed, end the database connection.
const runSeed = () => {
	return seed(devData).then(() => db.end());
};

runSeed();
