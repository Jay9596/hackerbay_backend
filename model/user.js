const config = require("../config").postgre_config;
const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  port: config.port,
  dialect: "postgres",
  operatorsAliases: false
});

const UserModel = sequelize.define(
  "users",
  {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: Sequelize.TEXT
  },
  {
    timestamps: false
  }
);

module.exports = UserModel;
