const { DataTypes } = require('sequelize');

function model(sequelize) {
  const attributes = {
    fullName: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      // allowNull: false,
    },
    facebookId: {
      type: DataTypes.STRING,
    },
    isActived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
    hash: {
      type: DataTypes.STRING,
    },
  };

  const options = {
    defaultScope: {
      // exclude hash by default
      attributes: { exclude: ['hash'] },
    },
    scopes: {
      // include hash with this scope
      withHash: { attributes: {} },
    },
    paranoid: true,
  };

  return sequelize.define('user', attributes, options);
}

module.exports = model;
