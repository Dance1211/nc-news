const db = require("../db/connection");

module.exports.selectUsers = async () => {
	const users = await db.query(`
    SELECT username FROM users;
  `);
	return users.rows.map(({ username }) => username);
};

module.exports.selectUserByUsername = async (username) => {
	const user = await db.query(`
    SELECT * FROM users
  	WHERE username = $1;
  `, [username]);
	return user.rows[0];
};