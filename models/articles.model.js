const db = require("../db/connection");
const { checkExists } = require("./util");

module.exports.selectArticles = async ({ sort_by = "created_at", order = "DESC", topic, p = 1, limit = 10 }) => {
  // Format the ORDER BY query. sort_by needs an "articles." prefix 
  // except for comment_count.
  const sortByQuery = `ORDER BY ${sort_by !== "comment_count" ? "articles." : ""}${sort_by} ${order}`;
  const whereQuery = topic ? "WHERE topic = $1 " : " ";

  const queries = topic ? [topic] : [];

  //Run the async functions
  const articles = await db.query(`
    SELECT articles.article_id, title, articles.author, topic, articles.created_at, articles.votes, COUNT(*)::INT as comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    ${whereQuery}
    GROUP BY articles.article_id
    ${sortByQuery}
    OFFSET ${limit * (p - 1)} ROWS FETCH NEXT ${limit} ROWS ONLY;
    ;
  `, queries);

  // Throw a 404 if the topic doesn't exists.
  if (topic) await checkExists(db, "topics", "slug", topic, `Topic ${topic} not found`);

  return articles.rows;
};

module.exports.selectSingleArticle = async (article_id) => {
  // Return all the infomation regarding a specific article
  // given by article_id along the count of comments associated with it.
  const article = await db.query(`
    SELECT articles.*, COUNT(*)::INT as comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;
  `, [article_id]);

  return article.rows[0];
};

module.exports.updateArticleVotes = async (article_id, inc_votes) => {
  // Updates the given article in the articles table with new votes.

  const article = await db.query(`
    UPDATE articles
    SET votes = (votes + $2)
    WHERE article_id = $1
    RETURNING *;
  `, [article_id, inc_votes]);

  return article.rows[0];
};

module.exports.selectCommentsByArticleId = async (article_id) => {
  const comments = await db.query(`
    SELECT comment_id, votes, created_at, author, body
    FROM comments
    WHERE article_id = $1;
  `, [article_id]);
  await checkExists(db, "articles", "article_id", article_id, "Article not found");
  return comments.rows;
};

module.exports.insertCommentByArticleId = async (article_id, username, body) => {

  await checkExists(db, "users", "username", username, "username not found");
  const comment = await db.query(`
    INSERT INTO comments
    (article_id, author, body)
    VALUES
    ($1, $2, $3)
    RETURNING *;
  `, [article_id, username, body]);
  return comment.rows[0];
};

module.exports.insertArticle = async (newArticle) => {
  const { author, title, body, topic } = newArticle;

  // Run these validations first before committing to a query.
  await Promise.all([
    checkExists(db, "users", "username", author, `User ${author} not found`),
    checkExists(db, "topics", "slug", topic, `Topic ${topic} not found`)
  ])

  const article = await db.query(`
    INSERT INTO articles
      (author, title, body, topic)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `, [author, title, body, topic])
  article.rows[0].comment_count = 0; // Default value, no need to query again.
  return article.rows[0];
}