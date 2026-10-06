const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Paciente = sequelize.define('paciente', {
  id_paciente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  nombres: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  fecha_nacimiento: {
    type: DataTypes.DATE
  },
  fecha_ingreso: {
    type: DataTypes.DATE
  },
  motivo_reclusion: {
    type: DataTypes.TEXT
  },
  psicopatologia: {
    type: DataTypes.TEXT
  },
  estado: {
    type: DataTypes.STRING(20),
    defaultValue: 'activo'
  }
}, {
  tableName: 'paciente',
  timestamps: false
});

module.exports = Paciente;