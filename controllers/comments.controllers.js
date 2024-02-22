const db = require("../db/connection.js");
const { selectCommentsPerArticleID } = require("../models/comments.model.js");
const { selectArticleById } = require("../models/articles.model.js");
const { insertComment } = require("../models/comments.model.js");

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

function postComment (req, res, next) {
  const { article_id } = req.params;
  const { username, body } = req.body;
  return selectArticleById(article_id).then(() => {
    return insertComment(article_id, username, body)
  })
    .then((comment) => {
      console.log(comment)
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err)
    });
};

module.exports = { getCommentsPerArticleID, postComment };
