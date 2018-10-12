const sequelize = require("./index");
const Sequelize = require("sequelize");
const User = require("./user");
const Website = sequelize.define("websites", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  url: Sequelize.STRING,
  status: Sequelize.STRING
});

Website.belongsTo(User);

module.exports = Website;
