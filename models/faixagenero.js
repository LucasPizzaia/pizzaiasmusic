'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FaixaGenero extends Model {
    static associate(models) {
      // Relacionamento entre FaixaGenero e Faixa
      FaixaGenero.belongsTo(models.Faixa, { foreignKey: 'faixaId', as: 'faixa' });

      // Relacionamento entre FaixaGenero e Genero
      FaixaGenero.belongsTo(models.Genero, { foreignKey: 'generoId', as: 'genero' });
    }
  }

  FaixaGenero.init({
    faixaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Faixas', // Nome da tabela de faixas
        key: 'id'
      }
    },
    generoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Generos', // Nome da tabela de gêneros
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'FaixaGenero',
  });

  return FaixaGenero;
};