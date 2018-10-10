const Sequelize = require("sequelize");
const sequelize = require("./index");

const UserModel = sequelize.define(
  "user",
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
