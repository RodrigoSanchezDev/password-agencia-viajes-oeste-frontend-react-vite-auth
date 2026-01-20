/**
 * Rutas de autenticación
 * Endpoints para registro, login y logout
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// POST /api/auth/register - Registro de nuevo usuario
router.post('/register', authController.register);

// POST /api/auth/login - Inicio de sesión
router.post('/login', authController.login);

// POST /api/auth/logout - Cierre de sesión (requiere autenticación)
router.post('/logout', authenticateToken, authController.logout);

// GET /api/auth/me - Obtener usuario actual (requiere autenticación)
router.get('/me', authenticateToken, authController.getCurrentUser);

// GET /api/auth/verify - Verificar token válido
router.get('/verify', authenticateToken, authController.verifyToken);

module.exports = router;
