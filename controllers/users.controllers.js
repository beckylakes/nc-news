const db = require("../db/connection.js");
const { selectAllUsers } = require("../models/users.model.js")

function getAllUsers(req, res, next) {
    return selectAllUsers()
    .then((users) => {
        res.status(200).send({ users })
    })
    .catch((err) => {
        next(err)
    });
};

module.exports = { getAllUsers }
