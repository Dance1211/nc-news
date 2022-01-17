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
