const Sequelize = require("sequelize");
const config = require("../config").postgre_config;

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  port: config.port,
  dialect: "postgres",
  operatorsAliases: false
});

module.exports = sequelize;
