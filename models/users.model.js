const db = require("../db/connection.js");

function selectAllUsers() {
    return db
      .query(
        `SELECT * FROM users;`
      )
      .then((result) => {
        return result.rows;
      });
  }
  
  module.exports = { selectAllUsers };