const db = require('../db/connection.js');
const testData = require('../db/data/test-data');
const { seed } = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());
