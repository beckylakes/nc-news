const express = require("express");
const app = express();
const { getArticleById } = require("./controllers/articles.controllers.js");
const { getTopics } = require("./controllers/topics.controllers.js");
const {
  getAllEndpoints,
} = require("./controllers/all-endpoints.controllers.js");

app.get(`/api/topics`, getTopics);

app.get(`/api`, getAllEndpoints);

app.get("/api/articles/:article_id", getArticleById);


app.use((err, req, res, next) => {
    if(err.code === '22P02'){
        res.status(400).send({msg: "Bad request"})
    }
    next(err)
})

app.use((err, req, res, next) => {
  if (err.statusCode && err.msg) {
    res.status(err.statusCode).send(err);
  }
});

module.exports = app;
