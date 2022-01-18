const db = require('../db/connection');

module.exports.removeCommentById = async (comment_id) => {
  // Thanks to the middleware, we know comment_id exists
  try {
    await db.query(`
    DELETE FROM comments
    WHERE comment_id = $1;
  `, [comment_id]);
    return;
  } catch (err) {
    return Promise.reject(err);
  }
}