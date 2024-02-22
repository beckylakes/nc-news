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
      return result.rows[0];
    });
}

function deleteComment(comment_id) {
  return db
    .query(`DELETE FROM comments WHERE comment_id=$1`, [comment_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          statusCode: 404,
          msg: "comment does not exist",
        });
      }
      return result;
    });
}

module.exports = { selectCommentsPerArticleID, insertComment, deleteComment };
