const Sequelize = require("sequelize");
const sequelize = require("./index");

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
