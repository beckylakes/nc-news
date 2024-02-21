const db = require('../db/connection.js')
const { selectArticleById, selectAllArticles } = require('../models/articles.model.js');

function getArticleById(req, res, next) {
    const { article_id } = req.params;
    return selectArticleById(article_id).then((article) => {
        res.status(200).send({ article })
    }).catch((err) => {
        next(err)
    })
}

function getAllArticles(req, res, next) {
    return selectAllArticles().then((articles) => {
        res.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
}

module.exports = { getArticleById, getAllArticles }