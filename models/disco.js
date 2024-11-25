'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Disco extends Model {
    static associate(models) {

      // Associação com Artista
      Disco.belongsTo(models.Artista, { 
        foreignKey: 'artistaId',
        as: 'artista'
      });

      Disco.hasMany(models.Faixa, { 
        foreignKey: 'discoId',  // Isso permite que o Disco tenha muitas faixas
        as: 'faixas'  // Pode definir um alias aqui para acessar as faixas
      });
    }
  }

  Disco.init({
    titulo: DataTypes.STRING,
    ano_lancamento: DataTypes.INTEGER,
    capa: DataTypes.STRING,
    artistaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Disco',
  });
  return Disco;
};