'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Artista', 'genero_musical');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Artista', 'genero_musical', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};