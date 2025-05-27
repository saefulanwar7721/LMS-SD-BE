'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('classes', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      school_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'schools', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      grade: {
        type: Sequelize.ENUM('1', '2', '3', '4', '5', '6'),
        allowNull: false,
      },
      academic_year: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('classes', ['school_id']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('classes');
  }
};
