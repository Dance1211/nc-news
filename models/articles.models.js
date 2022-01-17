const db = require("../db/connection");

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

    // Check the article exists. Return a 404 error otherwise.
    if (article.rows[0]){
      return article.rows[0];
    } else {
      return Promise.reject({msg: "Article not found", status: 404});
    }
  } catch (err) {
    // Catch miscellaneous errors
    return Promise.reject(err); 
  }
};