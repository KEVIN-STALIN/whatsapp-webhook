const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("./conexion.js")

const Contacto = sequelize.define(
  'Contacto',
  {
    // Model attributes are defined here
    nombre_whatsapp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero_whatsapp: {
      type: DataTypes.STRING,
      allowNull: false,
      // allowNull defaults to true
    },
    saldo: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: true,
      // allowNull defaults to true
    },
  },
  {
    // Other model options go here
  },
);

Contacto.sync()

module.exports = Contacto;