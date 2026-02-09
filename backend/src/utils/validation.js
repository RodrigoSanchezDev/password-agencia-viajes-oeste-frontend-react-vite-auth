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
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
};

/**
 * Valida el formato del DNI chileno (RUT)
 * Formato: 12345678-9 o 12.345.678-9
 */
exports.validateDni = (dni) => {
  if (!dni) return false;
  // Limpiamos el DNI de puntos y espacios
  const cleanDni = dni.replace(/\./g, '').replace(/\s/g, '').toUpperCase();
  // Validamos el formato: números-dígito verificador (número o K)
  const dniRegex = /^[0-9]{7,8}-[0-9K]$/;
  return dniRegex.test(cleanDni);
};

/**
 * Valida formato de fecha y hora ISO
 */
exports.validateDateTime = (dateTime) => {
  if (!dateTime) return false;
  const date = new Date(dateTime);
  return !isNaN(date.getTime());
};

/**
 * Valida el tipo de viaje
 */
exports.validateTripType = (tripType) => {
  const validTypes = ['negocios', 'turismo', 'otros'];
  return validTypes.includes(tripType);
};

/**
 * Valida el estado de la solicitud
 */
exports.validateStatus = (status) => {
  const validStatuses = ['pendiente', 'en_proceso', 'finalizada'];
  return validStatuses.includes(status);
};
