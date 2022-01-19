const format = require("pg-format");
const {
	USER_USERNAME_LENGTH,
	USER_AVATAR_URL_LENGTH,
	USER_NAME_LENGTH,
	TOPIC_SLUG_LENGTH,
	TOPIC_DESCRIPTION_LENGTH,
	ARTICLE_TITLE_LENGTH,
	COMMENT_BODY_LENGTH } = require("../constants");
const {
	formatUsersData, formatTopicsData, formatArticlesData, formatCommentData } = require("./util");
const db = require("../connection");

const seed = async (data) => {
	const { articleData, commentData, topicData, userData } = data;
	/*
  * Table Heirarchy:
  * 1 TOPIC, USER
  * 2 ARTICLE
  * 3 COMMENT
  * 
  * TODO: 
  * POPULATE TABLES
  */

	// Drop all tables in order.
	await db.query("DROP TABLE IF EXISTS comments");
	await db.query("DROP TABLE IF EXISTS articles");
	await db.query("DROP TABLE IF EXISTS topics");
	await db.query("DROP TABLE IF EXISTS users");

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
      author VARCHAR(${USER_USERNAME_LENGTH}) REFERENCES users(username) ON DELETE CASCADE,
      article_id INT REFERENCES articles(article_id),
      votes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT Now()
    )
  `);

	// Seed tables
	// Create correctly formatted queries 
	const insertUsersData = (userData) => format(`
    INSERT INTO users (username, name, avatar_url)
    VALUES %L
    RETURNING *;
  `, formatUsersData(userData));

	const insertTopicsData = (topicData) => format(`
    INSERT INTO topics (slug, description)
    VALUES %L
    RETURNING *;
  `, formatTopicsData(topicData));

	const insertArticlesData = (articleData) => format(`
    INSERT INTO articles (title, body, votes, topic, author, created_at)
    VALUES %L
    RETURNING *;
  `, formatArticlesData(articleData));

	const insertCommentsData = (commentData) => format(`
    INSERT INTO comments (body, article_id, votes, author, created_at)
    VALUES %L
    RETURNING *;
  `, formatCommentData(commentData));
  
	// Run insertion queries
	const users = (await db.query(insertUsersData(userData))).rows;
	const topics = (await db.query(insertTopicsData(topicData))).rows;
	const articles = (await db.query(insertArticlesData(articleData))).rows;
	const comments = (await db.query(insertCommentsData(commentData))).rows;

	// Return all data
	return {users, topics, articles, comments};
};

module.exports = seed;
