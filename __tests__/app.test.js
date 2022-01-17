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
          const {msg} = res.body;
          expect(msg).toBe("Invalid article id");
        });
    });
    test('Return a 404 for a valid id format but not in database', () => {
      return request(app)
        .get('/api/articles/4000') //ID possible but too big for the test data
        .expect(404)
        .then((res) => {
          const {msg} = res.body;
          expect(msg).toBe("Article not found");
        })
    });
  });
})