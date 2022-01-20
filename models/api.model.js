const fs = require("fs").promises;

module.exports.readEndpoints = async () => {
	const endpoints = await fs.readFile(`${__dirname}/../endpoints.json`, "utf-8");
	return JSON.parse(endpoints);
};