const db = require('../db/connection');

module.exports.selectUsers = async () => {
  try {
    const users = await db.query(`
      SELECT username FROM users;
    `)
    return users.rows;
  } catch (err) {
    return Promise.reject(err)
  }
}

module.exports.selectUserByUsername = async (username) => {
  try {
    const user = await db.query(`
      SELECT * FROM users
      WHERE username = $1;
    `, [username]);
    return user.rows[0];
  } catch (err) {
    return Promise.reject(err);
  }
}