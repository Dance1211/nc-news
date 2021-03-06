const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/notAnEndpoint", () => {
	describe("ALL", () => {
		test("Return a 404 for a non-existant endpoint", () => {
			return request(app)
				.get("/api/notAnEndpoint")
				.expect(404)
				.then((res) => {
					expect(res.body.msg).toBe("Endpoint '/api/notAnEndpoint' does not exist");
				});
		});
		test("Ignores the query part of the URL in the response", () => {
			return request(app)
				.get("/api/notAnEndpoint?isIgnored=true")
				.expect(404)
				.then((res) => {
					expect(res.body.msg).toBe("Endpoint '/api/notAnEndpoint' does not exist");
				});
		});
		test("Return a 404 for another request method", () => {
			return request(app)
				.patch("/api/notAnEndpoint")
				.expect(404)
				.then((res) => {
					expect(res.body.msg).toBe("Endpoint '/api/notAnEndpoint' does not exist");
				});
		});
	});
});

describe("/api", () => {
	describe("GET", () => {
		test("Returns an object describing the various endpoints", () => {
			return request(app)
				.get("/api")
				.expect(200)
				.then((res) => {
					const { endpoints } = res.body;
					expect(typeof endpoints).toBe("object");
					for (const endpoint of Object.values(endpoints)) {
						expect(typeof endpoint["description"]).toBe("string");
					}
				});
		});
	});
});

describe("/api/articles", () => {
	describe("GET", () => {
		test("Returns all the article objects wtih status 200", () => {
			return request(app)
				.get("/api/articles?limit=100") // Have to query to get all articles
				.expect(200)
				.then((res) => {
					const { articles } = res.body;
					expect(articles).toHaveLength(12);
					articles.forEach(article => {
						expect(article).toEqual({
							author: expect.any(String),
							title: expect.any(String),
							article_id: expect.any(Number),
							topic: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							comment_count: expect.any(Number)
						});
					});
				});
		});
		test("Sorts the data by date descending by default", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then((res) => {
					const { articles } = res.body;
					expect(articles).toBeSortedBy("created_at", { descending: true });
				});
		});
		test("Sorts the data by date ascending given the ASC order query", () => {
			return request(app)
				.get("/api/articles?order=ASC")
				.expect(200)
				.then((res) => {
					const { articles } = res.body;
					expect(articles).toBeSortedBy("created_at", { descending: false });
				});
		});
		test("Sorts the data by votes given the sort_by query", () => {
			return request(app)
				.get("/api/articles?sort_by=votes")
				.expect(200)
				.then((res) => {
					const { articles } = res.body;
					expect(articles).toBeSortedBy("votes", { descending: true });
				});
		});
		test("Sorts the data by votes given the comment_count query", () => {
			return request(app)
				.get("/api/articles?sort_by=comment_count")
				.expect(200)
				.then((res) => {
					const { articles } = res.body;
					expect(articles).toBeSortedBy("comment_count", { descending: true });
				});
		});
		test("Returns a 400 for an invalid sort_by query", () => {
			return request(app)
				.get("/api/articles?sort_by=viral") //Non-existant query
				.expect(400)
				.then((res) => {
					expect(res.body.msg).toBe("Invalid sort_by query");
				});
		});
		test("Returns a 400 for an invalid order query", () => {
			return request(app)
				.get("/api/articles?order=SIDEWAYS") //Non-existant query
				.expect(400)
				.then((res) => {
					expect(res.body.msg).toBe("Invalid order query");
				});
		});
		test("Selects the articles if given a topic slug query", () => {
			return request(app)
				.get("/api/articles?topic=mitch&limit=100") // Have to query limit to get all articles
				.expect(200)
				.then((res) => {
					const { articles } = res.body;
					expect(articles).toHaveLength(11);
					articles.forEach(article => {
						expect(article.topic).toBe("mitch");
					});
				});
		});
		test("Returns a 404 for an invalid slug", () => {
			return request(app)
				.get("/api/articles?topic=INVALIDASCANBE")
				.expect(404)
				.then((res) => {
					expect(res.body.msg).toBe("Topic INVALIDASCANBE not found");
				});
		});
		test("Returns a 200 if an existing topic gives an empty array", () => {
			return request(app)
				.get("/api/articles?topic=paper")
				.expect(200)
				.then((res) => {
					expect(res.body.articles).toHaveLength(0);
				});
		});
		test("Querying with page 2 limit 10 will return 2 articles", () => {
			return request(app)
				.get("/api/articles?p=2")
				.expect(200)
				.then((res) => {
					const { articles } = res.body;
					expect(articles).toHaveLength(2) //First page has 10, second page has 2
				});
		});
		test("Querying with page 3, limit 3 will return 3 articles", () => {
			return request(app)
				.get("/api/articles?limit=3&p=3")
				.expect(200)
				.then((res) => {
					const { articles } = res.body;
					expect(articles).toHaveLength(3);
				});
		});
	});
	describe("POST", () => {
		test("Publish the article and return a copy of the new article entry", () => {
			const newArticleInfo = {
				author: "lurker",
				title: "My first post",
				body: "Check out my new paper website >w>;;;; https://shadylink.co.az",
				topic: "paper"
			}
			return request(app)
				.post("/api/articles")
				.send(newArticleInfo)
				.expect(201)
				.then((res) => {
					const { article } = res.body;
					expect(article).toEqual({
						...newArticleInfo,
						article_id: 13,
						votes: 0,
						created_at: expect.any(String),
						comment_count: 0
					})
				})
		});
		test("Return a 404 for a non-existing username", () => {
			const newArticleInfo = {
				author: "lurkerBrother",
				title: "My first post",
				body: "Check out my new paper website owo;;;; https://shadierlink.co.az",
				topic: "paper"
			}
			return request(app)
				.post("/api/articles")
				.send(newArticleInfo)
				.expect(404);
		});
		test("Return a 404 for a non-existing topic", () => {
			const newArticleInfo = {
				author: "lurker",
				title: "My second post",
				body: "Check out my new tissue paper website uwu;;;; https://shadierlink.co.az",
				topic: "tissuepaper"
			}
			return request(app)
				.post("/api/articles")
				.send(newArticleInfo)
				.expect(404);
		});
		test("Return a 400 for a malformed body", () => {
			const newArticleInfo = {
				author: "lurker",
				title: "My third post on the topic of paper",
				body: "Check out my new tissue paper website :3 https://shadiestlink.co.az/pleaseClickAlready",
			}
			return request(app)
				.post("/api/articles")
				.send(newArticleInfo)
				.expect(400)
				.then((res) => {
					expect(res.body.msg).toEqual("Malformed body");
				})
		});
	});
});

describe("/api/articles/:article_id", () => {
	describe("GET", () => {
		test("Returns the article with the given id and a 200 status", () => {
			return request(app)
				.get("/api/articles/1")
				.expect(200)
				.then((res) => {
					const { article } = res.body;
					expect(article).toEqual({
						author: "butter_bridge",
						title: "Living in the shadow of a great man",
						article_id: 1,
						body: "I find this existence challenging",
						topic: "mitch",
						created_at: "2020-07-09T20:11:00.000Z",
						votes: 100,
						comment_count: 11
					});
				});
		});
		test("Return a 400 for an invalid id format", () => {
			return request(app)
				.get("/api/articles/not_a_number")
				.expect(400)
				.then((res) => {
					const { msg } = res.body;
					expect(msg).toBe("Invalid article_id");
				});
		});
		test("Return a 404 for a valid id format but not in database", () => {
			return request(app)
				.get("/api/articles/4000") //ID possible but too big for the test data
				.expect(404)
				.then((res) => {
					const { msg } = res.body;
					expect(msg).toBe("Article not found");
				});
		});
	});

	describe("PATCH", () => {
		test("Update the votes of the article and return it as an object", () => {
			return request(app)
				.patch("/api/articles/1")
				.send({ inc_votes: 1 })
				.expect(200)
				.then((res) => {
					const { article } = res.body;
					expect(article).toEqual({
						author: "butter_bridge",
						title: "Living in the shadow of a great man",
						article_id: 1,
						body: "I find this existence challenging",
						topic: "mitch",
						created_at: "2020-07-09T20:11:00.000Z",
						votes: 101, //Updated from 100 with 1 more vote
					});
				});
		});
		test("Return a 400 error for an invalid article_id", () => {
			return request(app)
				.patch("/api/articles/first")
				.send({ inc_votes: 1 })
				.expect(400)
				.then((res) => {
					const { msg } = res.body;
					expect(msg).toBe("Invalid article_id");
				});
		});
		test("Return a 404 for a valid id format but not in database", () => {
			return request(app)
				.patch("/api/articles/9878")
				.send({ inc_votes: 1 })
				.expect(404)
				.then((res) => {
					const { msg } = res.body;
					expect(msg).toBe("Article not found");
				});
		});
		test("Return a 400 for an illformed body", () => {
			return request(app)
				.patch("/api/articles/1")
				.send({ inc_vote: 1 }) // misspelling of inc_votes
				.expect(400)
				.then((res) => {
					const { msg } = res.body;
					expect(msg).toBe("Ill-formed body");
				});
		});
		test("Return a 400 for a non-integer inc_votes", () => {
			return request(app)
				.patch("/api/articles/1")
				.send({ inc_votes: -1.99 }) // Negative inc_votes
				.expect(400)
				.then((res) => {
					const { msg } = res.body;
					expect(msg).toBe("inc_votes is not an integer");
				});
		});
	});

	describe("DELETE", () => {
		test("Deletes the article of the given ID, returning a 204 status", () => {
			return request(app)
				.delete("/api/articles/1")
				.expect(204)
				.then(() => {
					return request(app)
						.get("/api/articles?sort_by=article_id&order=asc&limit=100")
						.expect(200)
						.then((res) => {
							const { articles } = res.body;
							expect(articles).toHaveLength(11);
							articles.forEach((article) => {
								expect(article.article_id).not.toBe(1);
							})
						});
				});
		});
	});
});

describe("/api/articles/:article_id/comments", () => {
	describe("GET", () => {
		test("Returns an array of comments with status 200", () => {
			return request(app)
				.get("/api/articles/1/comments")
				.expect(200)
				.then((res) => {
					const { comments } = res.body;
					expect(comments).toHaveLength(11);
					comments.forEach(comment => {
						expect(comment).toEqual({
							comment_id: expect.any(Number),
							votes: expect.any(Number),
							created_at: expect.any(String),
							author: expect.any(String),
							body: expect.any(String)
						});
					});
				});
		});
		test("Returns a status 404 if the article_id does not exist", () => {
			return request(app)
				.get("/api/articles/1294/comments")
				.expect(404)
				.then((res) => {
					const { msg } = res.body;
					expect(msg).toBe("Article not found");
				});
		});
	});
	describe("POST", () => {
		test("Return a 200 and the new comment ", () => {
			return request(app)
				.post("/api/articles/1/comments")
				.send({ username: "rogersop", body: "Yo. I want to make a post" })
				.expect(201)
				.then((res) => {
					const { comment } = res.body;
					expect(comment).toEqual({
						comment_id: 19,
						body: "Yo. I want to make a post",
						votes: 0,
						author: "rogersop",
						article_id: 1,
						created_at: expect.any(String)
					});
				});
		});
		test("Return a 404 if body has nonexistant username", () => {
			return request(app)
				.post("/api/articles/1/comments")
				.send({ username: "mysteryman", body: "Who am I?" })
				.expect(404)
				.then((res) => {
					expect(res.body.msg).toBe("username not found");
				});
		});
		test("Return a 400 if the body is malformed", () => {
			return request(app)
				.post("/api/articles/1/comments")
				.send({ helpme: "It's all gone wrong", whoops: "YOWZA!!" })
				.expect(400)
				.then((res) => {
					expect(res.body.msg).toBe("Malformed body");
				});
		});
	});
});

describe("/api/comments/:comment_id", () => {
	describe("PATCH", () => {
		test("Update a comment by incrementing its votes", () => {
			return request(app)
				.patch("/api/comments/1")
				.send({ inc_votes: 1 })
				.expect(200)
				.then((res) => {
					const { comment } = res.body;
					expect(comment).toEqual({
						comment_id: 1,
						body: expect.any(String),
						votes: 17, // Updated from 16
						author: "butter_bridge",
						article_id: 9,
						created_at: expect.any(String)
					});
				});
		});
		test("Decrement the votes if given a negative number", () => {
			return request(app)
				.patch("/api/comments/1")
				.send({ inc_votes: -1 })
				.expect(200)
				.then((res) => {
					const { comment } = res.body;
					expect(comment).toEqual({
						comment_id: 1,
						body: expect.any(String),
						votes: 15, // Updated from 16
						author: "butter_bridge",
						article_id: 9,
						created_at: expect.any(String)
					});
				});
		});
		test("Throw a 400 if the body is malformed", () => {
			return request(app)
				.patch("/api/comments/2")
				.send({ inc_vote: 1 }) // Wrong variable
				.expect(400)
				.then((res) => {
					expect(res.body.msg).toBe("Body does not have only one key of 'inc_votes'");
				});
		});
		test("Throw a 400 if inc_votes is not an integer", () => {
			return request(app)
				.patch("/api/comments/2")
				.send({ inc_votes: 1.5 })
				.expect(400)
				.then((res) => {
					expect(res.body.msg).toBe("inc_votes is not an integer");
				});
		});
	});
	describe("DELETE", () => {
		test("Delete the given comment", () => {
			return request(app)
				.delete("/api/comments/2")
				.expect(204)
				.then(() => {
					return request(app)
						.get("/api/articles/1/comments")
						.then((res) => {
							expect(res.body.comments).toHaveLength(10);
						});
				});
		});
	});
});

describe("/api/topics", () => {
	describe("GET", () => {
		test("Returns a topics array of the topics with 200 status", () => {
			return request(app)
				.get("/api/topics")
				.expect(200)
				.then((res) => {
					const { topics } = res.body;
					// Test topics file has 3 topics
					expect(topics).toHaveLength(3);
					// Expect the correct format for each topic
					topics.forEach((topic) => {
						expect(topic).toEqual({
							slug: expect.any(String),
							description: expect.any(String)
						});
					});
				});
		});
	});
	describe("POST", () => {
		test('Creates a new topic for the database, returning the created topic', () => {
			const topic = { slug: "racing", description: "Vroom Vroom!" };
			return request(app)
				.post("/api/topics")
				.send(topic)
				.expect(201)
				.then((res) => {
					expect(res.body.topic).toEqual(topic);
					return request(app)
						.get("/api/topics")
						.expect(200)
						.then((res) => {
							const { topics } = res.body;
							expect(topics).toHaveLength(4); // Previously 3
						});
				});
		});
		test("Return a 400 for a malformed body", () => {
			return request(app)
				.post("/api/topics")
				.send({ topic: "generalfun", description: "We have a good time" }) // slug not a key
				.expect(400)
				.then((res) => {
					expect(res.body.msg).toBe("Malformed body");
				});
		});
	});
});

describe("/api/users", () => {
	describe("GET", () => {
		test("Returns the full array of users", () => {
			return request(app)
				.get("/api/users")
				.expect(200)
				.then((res) => {
					const { users } = res.body;
					expect(users).toHaveLength(4);
					users.forEach(user => {
						expect(user).toEqual(expect.any(String));
					});
				});
		});
	});
});

describe("/api/users/:user_id", () => {
	describe("GET", () => {
		test("Returns the user with the given username", () => {
			return request(app)
				.get("/api/users/butter_bridge")
				.expect(200)
				.then((res) => {
					const { user } = res.body;
					expect(user).toEqual({
						username: "butter_bridge",
						name: "jonny",
						avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
					});
				});
		});
		test("Throw a 404 if the username cannot be found", () => {
			return request(app)
				.get("/api/users/isNotAUser")
				.expect(404)
				.then((res) => {
					expect(res.body.msg).toBe("User isNotAUser not found");
				});
		});
	});
});