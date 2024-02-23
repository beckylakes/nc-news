const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("should respond with a 404 status code with invalid endpoint", () => {
    return request(app)
      .get("/api/topix")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
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
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api", () => {
  test("should respond with a JSON object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.headers["content-type"]).toEqual(
          "application/json; charset=utf-8"
        );
      });
  });

  test("should respond with an object describing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(endpoints);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("sends a 404 status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article not found");
      });
  });
  test("sends a 400 status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("sends a single article to the client", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article[0].article_id).toBe(1);
        expect(article[0].title).toBe("Living in the shadow of a great man");
        expect(article[0].topic).toBe("mitch");
        expect(article[0].author).toBe("butter_bridge");
        expect(article[0].body).toBe("I find this existence challenging");
        expect(article[0].created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(article[0].votes).toBe(100);
        expect(article[0].article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("should return article object with comment count at specified article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article[0]).toHaveProperty("comment_count");
      });
  });
});

describe("GET /api/articles", () => {
  test("should respond with an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
      });
  });

  test("each article should have the required properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });

  test("should respond with a 404 status code with invalid endpoint", () => {
    return request(app)
      .get("/api/articlez")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });

  test("articles are sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        const sortedByDate = articles.map((article) => article.created_at);
        expect(sortedByDate).toBeSorted({ descending: true });
      });
  });

  test("should not have a body property present on any of the article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });

  test("should have correct comment count for specific article id", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles[0].comment_count).toEqual("2");
      });
  });

  test("should respond with 200 status and articles that correspond with the specified topic query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article.topic).toEqual("mitch");
        });
      });
  });

  test("should respond with 404 status if given non-existent topic query", () => {
    return request(app)
      .get("/api/articles?topic=mith")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("topic not found");
      });
  });

  test("should respond with 404 status if given invalid topic query", () => {
    return request(app)
      .get("/api/articles?topic=1")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("topic not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("should respond with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        const commentArray = comments[1];
        expect(Array.isArray(commentArray)).toBe(true);
        expect(comments.length).toBeGreaterThan(0);
        commentArray.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });

  test("comments are sorted by date in descending order with most recent at top", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        const sortedByDate = comments.map((comment) => {
          return comment.created_at;
        });
        expect(sortedByDate).toBeSorted({ descending: true });
      });
  });

  test("should respond with a 404 status code if article_id does not exist", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });

  test("should respond with a 400 status code if article_id is invalid", () => {
    return request(app)
      .get("/api/articles/not-an-article/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("responds with 200 status even if there are no comments for the specified article (empty array)", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("should respond with the posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment.",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment[1]).toHaveProperty("comment_id");
        expect(comment[1]).toHaveProperty("author");
        expect(comment[1]).toHaveProperty("body");
        expect(comment[1]).toHaveProperty("article_id", 1);
        expect(comment[1]).toHaveProperty("created_at");
        expect(comment[1]).toHaveProperty("votes", 0);
      });
  });

  test("should respond with a 400 status code if any required properties from body are missing", () => {
    const newComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("should ignore extra key if extra keys are found on body", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment.",
      extraKey: "This is extra",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const { comment } = response.body;
        expect(comment[1]).toMatchObject({
          comment_id: 19,
          body: "This is a test comment.",
          article_id: 1,
          author: "butter_bridge",
          votes: 0,
          created_at: expect.any(String),
        });
        expect(comment[1]).not.toHaveProperty("extraKey");
      });
  });

  test("should respond with a 400 status code if invalid article_id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment.",
    };
    return request(app)
      .post("/api/articles/invalid_article/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body.msg).toBe("Bad request");
      });
  });

  test("should respond with a 404 status code if article_id does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment.",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("should respond with the updated article with correct vote incrementation total", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article[1].article_id).toBe(1);
        expect(article[1].votes).toBe(101);
      });
  });
  test("should respond with object with expected properties", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article[1].article_id).toBe(1);
        expect(article[1].title).toBe("Living in the shadow of a great man");
        expect(article[1].topic).toBe("mitch");
        expect(article[1].author).toBe("butter_bridge");
        expect(article[1].body).toBe("I find this existence challenging");
        expect(article[1].created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(article[1].votes).toBe(101);
        expect(article[1].article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("should not change the article's vote count if inc_votes is 0", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 0 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article[1].votes).toBe(100);
      });
  });
  test("should decrement the article's vote count if inc_votes is a negative number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -10 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article[1].votes).toBe(90);
      });
  });
  test("should respond with a 404 status code if article_id does not exist", () => {
    return request(app)
      .patch("/api/articles/999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
  test("should respond with a 400 status code if article_id is invalid", () => {
    return request(app)
      .patch("/api/articles/not-an-article")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("should respond with 200 status and return original single article object if inc_votes is missing", () => {
    const testArticle = {
    "article_id": 1,
    "article_img_url": "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    "author": "butter_bridge",
    "body": "I find this existence challenging",
    "comment_count": "11",
    "created_at": "2020-07-09T20:11:00.000Z",
    "title": "Living in the shadow of a great man",
    "topic": "mitch",
    "votes": 100
    };
  
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(200)
      .then(({body}) => {
        const {article} = body
        expect(article[0]).toEqual(testArticle);
      });
  });
  test("should respond with 400 status if inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "zero" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("should respond with status 204 and comment should be deleted (no return)", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("should respond with status 404 when given a non-existent id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("comment does not exist");
      });
  });
  test("should respond with status 400 when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/not-a-comment")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("should respond with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(Array.isArray(users)).toBe(true);
      });
  });

  test("each user should have the required properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });

  test("should respond with a 404 status code with invalid endpoint", () => {
    return request(app)
      .get("/api/userz")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
});
