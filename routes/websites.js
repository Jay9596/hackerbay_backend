// const Sequelize = require("sequelize");
const Op = require("sequelize").Op;
var router = require("express").Router();
var jwt = require("jsonwebtoken");
var Website = require("../model/website");
var secretKey = require("../config").secret.secretKey;

router.post("/add", (req, res) => {
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];

  let userID;
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      res.status(401).json({ error: "Unauthorized" });
    }
    userID = decoded;
  });
  if (!userID) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  } else if (!req.body.name || !req.body.url) {
    res.status(400).json({ error: "Enter proper name and URL" });
    return;
  } else {
    Website.findOne({
      where: {
        [Op.or]: [{ url: req.body.url }, { name: req.body.name }]
      }
    }).then(site => {
      if (site) {
        res.status(400).json({ error: "Website already exists" });
        return;
      } else {
        Website.create({
          name: req.body.name,
          url: req.body.url,
          status: "online",
          userId: userID
        })
          .then(newSite => {
            res.status(200).json({
              id: newSite.id,
              name: newSite.name,
              url: newSite.url,
              userId: newSite.userId
            });
          })
          .catch(err => {
            console.log(err);
            res
              .status(500)
              .json({ error: "Could not create new website entry" });
          });
      }
    });
  }
});

router.get("/list", (req, res) => {
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];

  let userID;
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      res.status(401).json({ error: "Unauthorized" });
    }
    userID = decoded;
  });
  if (!userID) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  } else {
    Website.findAll({
      attributes: ["name", "url", "status", "userId"],
      where: {
        userId: userID
      }
    })
      .then(sites => {
        res.status(200).json(sites);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Cannot query the database" });
      });
  }
});

module.exports = router;
