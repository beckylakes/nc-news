const db = require("../db/connection.js");
const endpoints = require('../endpoints.json')

function getAllEndpoints(req, res, next) {
    return res.status(200).send(endpoints)
    .catch((err) => {
        next(err)
    })
}

module.exports = { getAllEndpoints };
