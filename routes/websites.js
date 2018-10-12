// const Sequelize = require("sequelize");
const Op = require("sequelize").Op;
var router = require("express").Router();
var jwt = require("jsonwebtoken");
const isURL = require("is-url").isURL;
var Website = require("../model/website");
var secretKey = require("../config").secret.secretKey;

router.post("/add", (req, res) => {
  let userID;
  const auth = req.headers["authorization"];
  if (!auth) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  } else {
    const token = auth.split(" ")[1];
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: "Unauthorized" });
      }
      userID = decoded;
    });
  }
  if (!userID) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  } else if (!req.body.name || !req.body.url) {
    res.status(400).json({ error: "No Name or URL provided" });
    return;
  } else {
    Website.findOne({
      where: {
        [Op.or]: [{ url: req.body.url }, { name: req.body.name }]
      }
    }).then(site => {
      if (site) {
        res
          .status(400)
          .json({ error: "Website already exists with Name or URL" });
        return;
      } else if (!isURL(req.body.url)) {
        res.status(400).json({ error: "Invalid URL" });
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
  let userID;
  const auth = req.headers["authorization"];
  if (!auth) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  } else {
    const token = auth.split(" ")[1];

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: "Unauthorized" });
      }
      userID = decoded;
    });
  }
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
