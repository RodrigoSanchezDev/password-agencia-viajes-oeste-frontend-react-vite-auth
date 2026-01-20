/**
 * Controlador de autenticación
 * Maneja la lógica de registro, login y logout
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { validateEmail, validatePassword } = require('../utils/validation');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Set para almacenar tokens invalidados (blacklist)
const tokenBlacklist = new Set();

/**
 * Registro de nuevo usuario
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Campos requeridos faltantes',
        message: 'El email y la contraseña son requeridos'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        error: 'Email inválido',
        message: 'El formato del email no es válido'
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        error: 'Contraseña inválida',
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = userModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Usuario existente',
        message: 'Ya existe un usuario registrado con este email'
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const newUser = userModel.create({
      email,
      password: hashedPassword
    });

    // Generar token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    console.log(`[Auth] Usuario registrado exitosamente: ${email}`);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      id: newUser.id,
      token
    });

  } catch (error) {
    console.error('[Auth] Error en registro:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor',
      message: 'Error al procesar el registro'
    });
  }
};

/**
 * Inicio de sesión
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Campos requeridos faltantes',
        message: 'El email y la contraseña son requeridos'
      });
    }

    // Buscar usuario
    const user = userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Actualizar último login
    userModel.updateLastLogin(user.id);

    console.log(`[Auth] Login exitoso: ${email}`);

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('[Auth] Error en login:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor',
      message: 'Error al procesar el inicio de sesión'
    });
  }
};

/**
 * Cierre de sesión
 * POST /api/auth/logout
 */
exports.logout = (req, res) => {
  try {
    // Obtener token del header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      // Agregar token a la blacklist
      tokenBlacklist.add(token);
      console.log(`[Auth] Token invalidado para usuario: ${req.user.email}`);
    }

    res.json({ 
      message: 'Sesión cerrada exitosamente' 
    });

  } catch (error) {
    console.error('[Auth] Error en logout:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor',
      message: 'Error al cerrar sesión'
    });
  }
};

/**
 * Obtener usuario actual
 * GET /api/auth/me
 */
exports.getCurrentUser = (req, res) => {
  try {
    const user = userModel.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado',
        message: 'No se encontró el usuario'
      });
    }

    res.json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    });

  } catch (error) {
    console.error('[Auth] Error al obtener usuario:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor',
      message: 'Error al obtener información del usuario'
    });
  }
};

/**
 * Verificar token válido
 * GET /api/auth/verify
 */
exports.verifyToken = (req, res) => {
  res.json({ 
    valid: true,
    user: {
      id: req.user.id,
      email: req.user.email
    }
  });
};

/**
 * Verificar si un token está en la blacklist
 */
exports.isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};
