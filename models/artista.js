'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Artista extends Model {
    static associate(models) {
      Artista.belongsToMany(models.Genero, {
        through: 'ArtistaGenero', // tabela intermediária
        as: 'generos', // alias usado para a associação
        foreignKey: 'artistaId',
        otherKey: 'generoId'
      });

      Artista.hasMany(models.Disco, {
        foreignKey: 'artistaId',
        as: 'discos'
      });
    }
  }

  Artista.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nacionalidade: DataTypes.STRING,
    foto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Artista',
    tableName: 'Artista',
  });

  return Artista;
};