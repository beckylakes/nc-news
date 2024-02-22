const db = require("../db/connection.js");

function selectCommentsPerArticleID(article_id) {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
}

function insertComment(article_id, username, body) {
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *",
      [article_id, username, body]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject();
      }
      return result.rows[0];
    });
}

module.exports = { selectCommentsPerArticleID, insertComment };
