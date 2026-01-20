/**
 * Utilidades de validación para el backend
 */

/**
 * Valida el formato del email
 */
exports.validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida la contraseña (mínimo 6 caracteres)
 */
exports.validatePassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Valida que un campo no esté vacío
 */
exports.validateRequired = (value) => {
  return value && value.trim().length > 0;
};
