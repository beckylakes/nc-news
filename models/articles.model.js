const db = require("../db/connection.js");

function selectArticleById(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          statusCode: 404,
          msg: "article not found",
        });
      }
      return result.rows[0];
    });
}

function selectAllArticles() {
  return db
    .query(
      `
SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.body) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC`
    )
    .then((result) => {
      return result.rows;
    })
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
    })
}

module.exports = { selectArticleById, selectAllArticles, updateArticle };
