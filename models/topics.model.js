const db = require("../db/connection");

module.exports.selectTopics = async () => {
	const topics = await db.query(`
    SELECT * FROM topics;
  `);
	return topics.rows;
};

module.exports.insertTopic = async (slug, description) => {
  const topic = await db.query(`
    INSERT INTO topics
    (slug, description)
    VALUES ($1, $2)
    RETURNING *;
  `, [slug, description])
  return topic.rows[0];
}