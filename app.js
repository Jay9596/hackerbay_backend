const express = require("express");
var passport = require("passport");
var cors = require('cors')

var users = require("./routes/users");

var app = express();
// Middleware to parse request body
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json objects
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use("/users", users);

const PORT = 8000;
app.listen(PORT, err => {
  if (err) {
    throw err;
  }
  console.log("Server started on " + PORT);
});

module.exports = app;
