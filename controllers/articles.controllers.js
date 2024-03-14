const db = require("../db/connection.js");
const {
  selectArticleById,
  selectAllArticles,
  updateArticle,
} = require("../models/articles.model.js");

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  return selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function getAllArticles(req, res, next) {
  const { topic, sort_by, order } = req.query;
  return selectAllArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

function patchArticle(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if(inc_votes === undefined){
    return selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({article})
    })
    .catch((err) => {
      next(err)
    })
  }

  return Promise.all([
    selectArticleById(article_id),
    updateArticle(article_id, inc_votes),
  ])
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getArticleById, getAllArticles, patchArticle };
