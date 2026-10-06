const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Usuario = sequelize.define('usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_rol: {
    type: DataTypes.INTEGER
  },
  correo: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true
  },
  contrasena_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(20),
    defaultValue: 'activo'
  }
}, {
  tableName: 'usuario',
  timestamps: false
});

module.exports = Usuario;