module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('ArtistaGeneros', {
          artistaId: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'Artistas', // Nome da tabela Artistas
                  key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
          },
          generoId: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'Generos', // Nome da tabela Generos
                  key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
          },
          createdAt: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Garante valor padrão
          },
          updatedAt: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Garante valor padrão
          },
      });
  },
  down: async (queryInterface) => {
      await queryInterface.dropTable('ArtistaGeneros');
  },
};