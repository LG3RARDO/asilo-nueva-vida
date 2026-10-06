const express = require('express');
const router = express.Router();
const {
  obtenerPacientes,
  obtenerPacientePorId,
  crearPaciente,
  actualizarPaciente,
  cambiarEstado
} = require('../controllers/pacienteController');
const { verificarToken } = require('../middlewares/auth');

// Rutas de pacientes
router.get('/', verificarToken, obtenerPacientes);
router.get('/:id', verificarToken, obtenerPacientePorId);
router.post('/', verificarToken, crearPaciente);
router.put('/:id', verificarToken, actualizarPaciente);
router.patch('/:id/estado', verificarToken, cambiarEstado);

module.exports = router;