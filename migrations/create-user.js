module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
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
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("user");
  }
};
