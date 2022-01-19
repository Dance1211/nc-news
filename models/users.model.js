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