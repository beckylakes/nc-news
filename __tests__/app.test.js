const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  db.end();
});

describe("GET /api/topics", () => {
  test("should respond with a 200 status code", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("should respond with a 404 status code with invalid endpoint", () => {
    return request(app).get("/api/topix").expect(404);
  });
  test("should respond with an array with appropriate length", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
      });
  });
  test("each topic in the array should have a slug and description property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics[0]).toHaveProperty("slug");
        expect(topics[0]).toHaveProperty("description");
      });
  });
});
