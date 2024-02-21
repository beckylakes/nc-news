const db = require("../db/connection.js");
const { selectCommentsPerArticleID } = require("../models/comments.model.js");
const { selectArticleById } = require("../models/articles.model.js");

function getCommentsPerArticleID(req, res, next) {
  const { article_id } = req.params;
  return selectArticleById(article_id)
    .then(() => {
      return selectCommentsPerArticleID(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getCommentsPerArticleID };
