const format = require('pg-format');

/**
 * Checks the database to see if a value exists in a table's column.
 * Returns a rejected 404 along with an error message
 * @param {*} db Database to be checked
 * @param {*} table Table to be checked
 * @param {*} column Column to be checked
 * @param {*} value value to be checked
 * @param {*} msg return message
 * @returns Rejected promise only if value is not found.
 */
module.exports.checkExists = async (db, table, column, value, msg) => {
  const queryStr = format('SELECT * FROM %I WHERE %I = $1', table, column)

  const dbOutput = await db.query(queryStr, [value]);

  if (dbOutput.rows.length === 0) {
    return Promise.reject({ status: 404, msg})
  }
}