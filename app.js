const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers.js");
const { getAllEndpoints } = require("./controllers/all-endpoints.controllers.js")

app.get(`/api/topics`, getTopics);

app.get(`/api`, getAllEndpoints)

module.exports = app;
