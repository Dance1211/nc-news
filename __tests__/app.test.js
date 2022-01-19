const request = require('supertest');
const seed = require('../db/seeds/seed.js');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api/notAnEndpoint', () => {
  test('Return a 404 for a non-existant endpoint', () => {
    return request(app)
      .get('/api/notAnEndpoint')
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Endpoint '/api/notAnEndpoint' does not exist")
      })
  });
  test('Ignores the query part of the URL in the response', () => {
    return request(app)
      .get('/api/notAnEndpoint?isIgnored=true')
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Endpoint '/api/notAnEndpoint' does not exist")
      })
  });
});

describe('/api', () => {
  describe('GET', () => {
    test('Returns an object describing the various endpoints', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then((res) => {
          const { endpoints } = res.body;
          expect(typeof endpoints).toBe('object');
          for (const endpoint of Object.values(endpoints)) {
            expect(typeof endpoint['description']).toBe('string');
          }
        })
    });
  });
});

describe('/api/articles', () => {
  describe('GET', () => {
    test('Returns all the article objects wtih status 200', () => {
      return request(app)
        .get("/api/articles")
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
        })
    });
    test('Sorts the data by date descending by default', () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles).toBeSortedBy('created_at', { descending: true });
        })
    });
    test('Sorts the data by date ascending given the ASC order query', () => {
      return request(app)
        .get("/api/articles?order=ASC")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles).toBeSortedBy('created_at', { descending: false });
        })
    });
    test('Sorts the data by votes given the sort_by query', () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles).toBeSortedBy('votes', { descending: true });
        })
    });
    test('Sorts the data by votes given the comment_count query', () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles).toBeSortedBy('comment_count', { descending: true });
        })
    });
    test('Returns a 400 for an invalid sort_by query', () => {
      return request(app)
        .get("/api/articles?sort_by=viral") //Non-existant query
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid sort_by query");
        })
    });
    test('Returns a 400 for an invalid order query', () => {
      return request(app)
        .get("/api/articles?order=SIDEWAYS") //Non-existant query
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid order query");
        })
    })
    test('Selects the articles if given a topic slug query', () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles).toHaveLength(11);
          articles.forEach(article => {
            expect(article.topic).toBe('mitch');
          });
        })
    })
    test('Returns a 404 for an invalid slug', () => {
      return request(app)
        .get("/api/articles?topic=INVALIDASCANBE")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Topic INVALIDASCANBE not found")
        })
    })
    test('Returns a 200 if an existing topic gives an empty array', () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toHaveLength(0);
        })
    })
  });
});

describe('/api/articles/:article_id', () => {
  describe('GET', () => {
    test('Returns the article with the given id and a 200 status', () => {
      return request(app)
        .get('/api/articles/1')
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
          })
        })
    });
    test('Return a 400 for an invalid id format', () => {
      return request(app)
        .get('/api/articles/not_a_number')
        .expect(400)
        .then((res) => {
          const { msg } = res.body;
          expect(msg).toBe("Invalid article_id");
        });
    });
    test('Return a 404 for a valid id format but not in database', () => {
      return request(app)
        .get('/api/articles/4000') //ID possible but too big for the test data
        .expect(404)
        .then((res) => {
          const { msg } = res.body;
          expect(msg).toBe("Article not found");
        })
    });
  });

  describe('PATCH', () => {
    test('Update the votes of the article and return it as an object', () => {
      return request(app)
        .patch('/api/articles/1')
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
    test('Return a 400 error for an invalid article_id', () => {
      return request(app)
        .patch('/api/articles/first')
        .send({ inc_votes: 1 })
        .expect(400)
        .then((res) => {
          const { msg } = res.body;
          expect(msg).toBe("Invalid article_id");
        });
    });
    test('Return a 404 for a valid id format but not in database', () => {
      return request(app)
        .patch('/api/articles/9878')
        .send({ inc_votes: 1 })
        .expect(404)
        .then((res) => {
          const { msg } = res.body;
          expect(msg).toBe("Article not found");
        });
    });
    test('Return a 400 for an illformed body', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_vote: 1 }) // misspelling of inc_votes
        .expect(400)
        .then((res) => {
          const { msg } = res.body;
          expect(msg).toBe("Ill-formed body");
        })
    });
    test('Return a 400 for a non-integer inc_votes', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: -1.99 }) // Negative inc_votes
        .expect(400)
        .then((res) => {
          const { msg } = res.body;
          expect(msg).toBe("inc_votes is not an integer");
        })
    });
  });
});

describe('/api/articles/:article_id/comments', () => {
  describe('GET', () => {
    test('Returns an array of comments with status 200', () => {
      return request(app)
        .get('/api/articles/1/comments')
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
          })
        })
    });
    test('Returns a status 404 if the article_id does not exist', () => {
      return request(app)
        .get('/api/articles/1294/comments')
        .expect(404)
        .then((res) => {
          const { msg } = res.body;
          expect(msg).toBe("Article not found");
        })
    })
  });
  describe('POST', () => {
    test('Return a 200 and the new comment ', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({ username: "rogersop", body: "Yo. I want to make a post" })
        .expect(200)
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
        })
    });
    test('Return a 404 if body has nonexistant username', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({ username: "mysteryman", body: "Who am I?" })
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("username not found");
        })
    });
    test('Return a 400 if the body is malformed', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({ helpme: "It's all gone wrong", whoops: "YOWZA!!" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Malformed body");
        })
    });
  });
});

describe('/api/comments/:comment_id', () => {
  describe('DELETE', () => {
    test('Delete the given comment', () => {
      return request(app)
        .delete('/api/comments/2')
        .expect(204)
        .then(() => {
          return request(app)
            .get('/api/articles/1/comments')
            .then((res) => {
              expect(res.body.comments).toHaveLength(10)
            })
        })
    });
  });
});

describe('/api/topics', () => {
  describe('GET', () => {
    test('Returns a topics array of the topics with 200 status', () => {
      return request(app)
        .get('/api/topics')
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
          })
        })
    })
  });
})

describe('/api/users', () => {
  describe('GET', () => {
    
  });
});