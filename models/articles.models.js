const db = require("../db/connection");

module.exports.selectArticles = async (queries) => {
  try {
    const articles = await db.query(`
      SELECT articles.article_id, title, articles.author, topic, articles.created_at, articles.votes, COUNT(*)::INT as comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id;
    `)
    return articles.rows;
  } catch (err) {
    return Promise.reject(err);
  }
}

module.exports.selectSingleArticle = async (article_id) => {
  // Return all the infomation regarding a specific article
  // given by article_id along the count of comments associated with it.

  try {
    const article = await db.query(`
      SELECT articles.*, COUNT(*)::INT as comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;
    `, [article_id]);

    return articleIfExists(article);

  } catch (err) {
    // Catch miscellaneous errors
    return Promise.reject(err);
  }
};

module.exports.updateArticleVotes = async (article_id, inc_votes) => {
  // Updates the given article in the articles table with new votes.
  try {
    const article = await db.query(`
      UPDATE articles
      SET votes = (votes + $2)
      WHERE article_id = $1
      RETURNING *;
    `, [article_id, inc_votes]);

    return articleIfExists(article);

  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
}

function articleIfExists(articleArray) {
  // Returns the full array if there are multiple articles,
  // Return a single article if there is just one
  // Returns a 404 if array is empty
  if (articleArray.rows.length > 1) {
    return articleArray.rows;
  } else if (articleArray.rows.length == 1) {
    return articleArray.rows[0];
  } else {
    return Promise.reject({ msg: "Article not found", status: 404 });
  }
}