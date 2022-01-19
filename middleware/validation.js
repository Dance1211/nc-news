const { checkExists } = require("../models/util");
const { isValidPositiveInteger } = require("../util/validation");

module.exports.validateArticleId = (req, res, next) => {
  const { article_id } = req.params
  // Check the article_id is of the right format
  if (!isValidPositiveInteger(article_id)) {
    next({ status: 400, msg: "Invalid article id" });
  } else {
    // Check the article exists in the database
    checkExists(require('../db/connection'), 'articles', 'article_id', article_id, "Article not found")
      .then(() => {
        // Article exists. Go for it.
        next();
      })
      .catch((err) => {
        // Article doesn't exist so just leave early.
        next(err);
      })
  }
}

module.exports.validateCommentId = (req, res, next) => {
  const { comment_id } = req.params
  // Check the comment_id is of the right format
  if (!isValidPositiveInteger(comment_id)) {
    next({ status: 400, msg: "Invalid comment id" });
  } else {
    // Check the comment exists in the database
    checkExists(require('../db/connection'), 'comments', 'comment_id', comment_id, "comment not found")
      .then(() => {
        // Comment exists. Go for it.
        next();
      })
      .catch((err) => {
        // Comment doesn't exist so just leave early.
        next(err);
      })
  }
}

/**
 * Returns a middleware function to valididate the given request parameter key,
 * checking that it's a valid positive integer (which otherwise returns a 400)
 * and that it exists in the database (which otherwise returns a 404)
 * @param {String} key The key to be checked. Must be of the form "*_id"
 * @returns A middleware function that will valididate the id
 */
module.exports.validateId = (key) => {
  return (req, res, next) => {
    const id = req.params[key];
    const keyWithout_ID = key.slice(0, -3); // Remove "_id" at end of key
    const table = keyWithout_ID + "s"; // Make it plural
    if (!isValidPositiveInteger(id)) {
      next({status: 400, msg: `Invalid ${key}`})
    } else {
      checkExists(require('../db/connection'), table, key, id,
      `${keyWithout_ID[0].toUpperCase() + keyWithout_ID.slice(1)} not found`)
        .then(() => {
          next();
        })
        .catch((err) => {
          next(err);
        })
    }
  }
}