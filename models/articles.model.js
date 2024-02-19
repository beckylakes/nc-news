const db = require("../db/connection.js");

function selectArticleById(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ statusCode: 404, msg: "team does not exist" });
      }
      return result.rows[0];
    });
}

module.exports = { selectArticleById };
