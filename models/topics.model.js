const db = require("../db/connection");

module.exports.selectTopics = async () => {
	try {
		const topics = await db.query(`
      SELECT * FROM topics;
    `);
		return topics.rows;
	} catch (error) {
		return Promise.reject(error);
	}
};