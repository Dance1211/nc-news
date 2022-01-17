const db = require("../connection");
const {
  USER_USERNAME_LENGTH,
  USER_AVATAR_URL_LENGTH,
  USER_NAME_LENGTH,
  TOPIC_SLUG_LENGTH,
  TOPIC_DESCRIPTION_LENGTH,
  ARTICLE_TITLE_LENGTH,
  COMMENT_BODY_LENGTH } = require("../constants");

const seed = async (data) => {
  const { articleData, commentData, topicData, userData } = data;
  /*
  * Table Heirarchy:
  * 1 TOPIC, USER
  * 2 ARTICLE
  * 3 COMMENT
  * 
  * TODO: 
  * DELETE CURRENT TABLES
  * CREATE TABLES
  * POPULATE TABLES
  */

  // Drop all tables in order.
  await db.query(`DROP TABLE IF EXISTS comments`);
  await db.query(`DROP TABLE IF EXISTS articles`);
  await db.query(`DROP TABLE IF EXISTS topics`);
  await db.query(`DROP TABLE IF EXISTS users`);

  // Create tables
  await db.query(`
    CREATE TABLE users(
      username VARCHAR(${USER_USERNAME_LENGTH}) PRIMARY KEY,
      avatar_url VARCHAR(${USER_AVATAR_URL_LENGTH}),
      name VARCHAR(${USER_NAME_LENGTH})
    )
  `);
  await db.query(`
    CREATE TABLE topics(
      slug VARCHAR(${TOPIC_SLUG_LENGTH}) PRIMARY KEY,
      description VARCHAR(${TOPIC_DESCRIPTION_LENGTH})
    )
  `);
  await db.query(`
    CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(${ARTICLE_TITLE_LENGTH}) NOT NULL,
      body TEXT,
      topic VARCHAR(${TOPIC_SLUG_LENGTH}) REFERENCES topics(slug),
      author VARCHAR(${USER_USERNAME_LENGTH}) REFERENCES users(username),
      votes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT Now()
    )
  `);
  await db.query(`
    CREATE TABLE comments(
      comment_id SERIAL PRIMARY KEY,
      body VARCHAR(${COMMENT_BODY_LENGTH}),
      author VARCHAR(${USER_USERNAME_LENGTH}) REFERENCES users(username),
      article_id INT REFERENCES articles(article_id),
      votes INT DEFAULT 0,
      created_ad TIMESTAMP DEFAULT Now()
    )
  `);

};

module.exports = seed;
