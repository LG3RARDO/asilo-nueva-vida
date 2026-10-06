const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const Usuario = require('../models/usuario');
require('dotenv').config();

// Registrar usuario
const registrar = async (req, res) => {
  try {
    const { correo, contrasena, id_rol } = req.body;

    // Verificar si ya existe
    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasena_hash = await bcrypt.hash(contrasena, salt);

    // Crear usuario
    const usuario = await Usuario.create({
      correo,
      contrasena_hash,
      id_rol,
      estado: 'activo'
    });

    res.status(201).json({ 
      mensaje: 'Usuario registrado exitosamente.',
      usuario: { id: usuario.id_usuario, correo: usuario.correo }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario', error });
  }
};

// Iniciar sesión
const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos.' });
    }

    // Verificar estado
    if (usuario.estado !== 'activo') {
      return res.status(403).json({ mensaje: 'Usuario inactivo. Contacte al administrador.' });
    }

    // Verificar contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!contrasenaValida) {
      return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos.' });
    }

    // Generar token
    const token = jwt.sign(
      { 
        id: usuario.id_usuario, 
        correo: usuario.correo,
        rol: usuario.id_rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso.',
      token,
      usuario: {
        id: usuario.id_usuario,
        correo: usuario.correo,
        rol: usuario.id_rol
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error });
  }
};

// Verificar token
const verificarSesion = async (req, res) => {
  try {
    res.json({ 
      mensaje: 'Sesión válida.',
      usuario: req.usuario 
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al verificar sesión', error });
  }
};

module.exports = { registrar, login, verificarSesion };