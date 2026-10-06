const express = require('express');
const router = express.Router();
const { registrar, login, verificarSesion } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/auth');

// Rutas de autenticación
router.post('/registrar', registrar);
router.post('/login', login);
router.get('/sesion', verificarToken, verificarSesion);

module.exports = router;