'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('SearchCoursesFeedbacks', {
      id: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      price: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      language: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      foundedCourses: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      userFeedback: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        ),
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('SearchCoursesFeedbacks');
  },
};
