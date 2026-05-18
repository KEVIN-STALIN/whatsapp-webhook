const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("./conexion.js")

const Producto = sequelize.define(
  'Producto',
  {
    // Model attributes are defined here
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 0
      // allowNull defaults to true
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
      // allowNull defaults to true
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true,
      // allowNull defaults to true
    },
  },
  {
    // Other model options go here
  },
);

Producto.sync()

module.exports = Producto;