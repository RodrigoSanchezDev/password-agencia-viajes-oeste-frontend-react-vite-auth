/**
 * Middleware de autenticación JWT
 * Verifica y valida tokens de acceso
 */

const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

/**
 * Middleware para verificar el token JWT
 * Extrae el token del header Authorization
 */
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Token no proporcionado',
      message: 'Se requiere autenticación para acceder a este recurso'
    });
  }

  // Verificar si el token está en la blacklist
  if (authController.isTokenBlacklisted(token)) {
    return res.status(401).json({ 
      error: 'Token inválido',
      message: 'La sesión ha sido cerrada. Por favor inicie sesión nuevamente'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado',
        message: 'La sesión ha expirado. Por favor inicie sesión nuevamente'
      });
    }
    
    return res.status(403).json({ 
      error: 'Token inválido',
      message: 'El token de autenticación no es válido'
    });
  }
};

/**
 * Middleware opcional de autenticación
 * No bloquea si no hay token, solo añade req.user si existe
 */
exports.optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    // Token inválido, pero continuamos sin usuario
    console.log('[Auth] Token opcional inválido, continuando sin autenticación');
  }

  next();
};
