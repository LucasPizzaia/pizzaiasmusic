'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Faixa extends Model {
    static associate(models) {

      // Associação com Disco
      Faixa.belongsTo(models.Disco, { 
        foreignKey: 'discoId' 
      });

      // Associação com Genero através de FaixaGenero
      Faixa.belongsToMany(models.Genero, {
        through: models.FaixaGenero,
        foreignKey: 'faixaId',
        otherKey: 'generoId'
      });
    }
  }

  Faixa.init({
    titulo: DataTypes.STRING,
    discoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Faixa',
  });
  return Faixa;
};