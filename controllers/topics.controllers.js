const db = require('../db/connection.js')
const {selectAllTopics} = require('../models/topics.model.js')

function getTopics(req, res, next) {
    return selectAllTopics().then((topics) => {
        res.status(200).send({ topics });
      }).catch((err) => {
        next(err)
      })
}

module.exports = { getTopics }