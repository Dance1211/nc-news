const format = require('pg-format');


module.exports.checkExists = async (db, table, column, value) => {
  const queryStr = format('SELECT * FROM %I WHERE %I = $1', table, column)

  const dbOutput = await db.query(`
  SELECT * FROM topics WHERE slug = $1
  `, [value]);

  if (dbOutput.rows.length === 0) {
    return Promise.reject({ status: 404, msg: `${value} not found` })
  }
}