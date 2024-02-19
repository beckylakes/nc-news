const db = require('../db/connection.js')
const { selectArticleById } = require('../models/articles.model.js');

function getArticleById(req, res, next) {
    const { article_id } = req.params;
    return selectArticleById(article_id).then((article) => {
        res.status(200).send({ article })
    }).catch((err) => {
        next(err)
    })
}

module.exports = { getArticleById }