const fs = require("fs").promises;

module.exports.readEndpoints = async () => {
	try {
		const endpoints = await fs.readFile(`${__dirname}/../endpoints.json`, "utf-8"); 
		return JSON.parse(endpoints);
	} catch (error) {
		return Promise.reject(error);
	}
};