'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ArtistaGenero extends Model {
    static associate(models) {
      // Associações
      ArtistaGenero.belongsTo(models.Artista, {
        foreignKey: 'artistaId',
        as: 'artista',
      });

      ArtistaGenero.belongsTo(models.Genero, {
        foreignKey: 'generoId',
        as: 'genero',
      });
    }
  }

  ArtistaGenero.init(
    {
      artistaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Artistas', // Nome da tabela de artistas no banco de dados
          key: 'id',
        },
      },
      generoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Generos', // Nome da tabela de gêneros no banco de dados
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'ArtistaGenero',
      timestamps: true, 
      tableName: 'ArtistaGeneros', // Nome da tabela

    }
  );

  return ArtistaGenero;
};