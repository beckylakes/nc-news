const db = require("../db/connection.js");

function selectArticleById(article_id) {
  let queryString =
    "SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.body) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id ";
  const endOfQueryString = `GROUP BY articles.article_id ORDER BY articles.created_at DESC`;
  const queryValues = [];

  queryString += "WHERE articles.article_id = $1 ";
  queryValues.push(article_id);

  queryString += endOfQueryString;

  return db.query(queryString, queryValues).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        statusCode: 404,
        msg: "article not found",
      });
    }
    return result.rows;
  });
}

async function selectAllArticles(
  topic,
  sort_by = "created_at",
  order = "DESC"
) {
  const validTopics = [];

  await db.query(`SELECT slug FROM topics`).then((result) => {
    result.rows.forEach((topic) => {
      validTopics.push(topic.slug);
    });
  });

  if (!validTopics.includes(topic) && topic !== undefined) {
    return Promise.reject({
      statusCode: 404,
      msg: "topic not found",
    });
  }
  const validSortBys = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const validOrderBys = ["ASC", "DESC"];
  if (
		!validSortBys.includes(sort_by.toLowerCase()) ||
		!validOrderBys.includes(order.toUpperCase())
	) {
		return Promise.reject({
			status: 400,
			msg: "Invalid queries",
		});
	}

  let queryString =
    "SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.body) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id ";
  const endOfQueryString = `GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
  const queryValues = [];

  if (validTopics.includes(topic)) {
    queryString += "WHERE articles.topic = $1 ";
    queryValues.push(topic);
  }

  queryString += endOfQueryString;

  return db.query(queryString, queryValues).then((result) => {
    return result.rows;
  });
}

function updateArticle(article_id, inc_votes) {
  return db
    .query(
      `UPDATE articles 
    SET votes = votes + $1 
    WHERE article_id = $2 
    RETURNING *;`,
      [inc_votes, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
}

module.exports = { selectArticleById, selectAllArticles, updateArticle };
