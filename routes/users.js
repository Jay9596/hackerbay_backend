var router = require("express").Router();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var User = require("../model/user");
var secretKey = require("../config").secret.secretKey;

router.post("/signup", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.json({ success: false, message: "Please enter email and password." });
  } else {
    User.create({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    })
      .then(newUser => {
        res.status(200).json({ token: jwt.sign(newUser.id, secretKey) });
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({ error: "User already exists" });
      });
  }
});

router.post("/login", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(data => {
      if (!data) {
        res.status(400).json({ error: "User does not exist" });
      } else {
        let values = data.dataValues;
        if (bcrypt.compareSync(req.body.password, values.password)) {
          res.status(200).json({ token: jwt.sign(values.id, secretKey) });
        } else {
          res.status(400).json({ error: "Invalid Password" });
        }
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

module.exports = router;
