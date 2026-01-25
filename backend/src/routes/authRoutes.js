/**
 * Rutas de autenticación
 * Endpoints para registro, login, logout y OAuth con GitHub
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const githubAuthController = require('../controllers/githubAuthController');
const { authenticateToken } = require('../middleware/authMiddleware');

// =============================================
// RUTAS DE AUTENTICACIÓN LOCAL
// =============================================

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

// =============================================
// RUTAS DE AUTENTICACIÓN CON GITHUB OAUTH
// =============================================

// GET /api/auth/github - Obtener URL de autorización de GitHub
router.get('/github', githubAuthController.getGithubAuthUrl);

// POST /api/auth/github/callback - Manejar callback de GitHub OAuth
router.post('/github/callback', githubAuthController.handleGithubCallback);

module.exports = router;
