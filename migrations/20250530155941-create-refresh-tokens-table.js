// migrations/20250530010000-create-refresh-tokens-table.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("refresh_tokens", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      token_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_revoked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("refresh_tokens", ["user_id"]);
    await queryInterface.addIndex("refresh_tokens", ["token_hash"]);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("refresh_tokens");
  },
};
