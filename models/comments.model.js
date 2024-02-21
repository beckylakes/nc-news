const db = require("../db/connection.js");

function selectCommentsPerArticleID(article_id) {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [article_id]
    )
    .then((result) => {
        if (result.rows.length === 0) {
            return []
          }
      return result.rows;
    })
}

module.exports = { selectCommentsPerArticleID };