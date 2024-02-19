const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers.js");

app.use(express.json())

app.get(`/api/topics`, getTopics);

app.listen(9090, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("listening on port 9090!");
  }
});

module.exports = app;
