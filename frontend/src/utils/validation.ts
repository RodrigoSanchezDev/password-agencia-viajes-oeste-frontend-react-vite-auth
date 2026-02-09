// Validation utilities

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validatePassword = (password: string): boolean => {
  // Minimum 6 characters for ReqRes API
  return password.length >= 6;
};

/**
 * Valida el formato del DNI chileno (RUT)
 * Formato: 12345678-9 o 12.345.678-9
 */
export const validateDni = (dni: string): boolean => {
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
export const validateDateTime = (dateTime: string): boolean => {
  if (!dateTime) return false;
  const date = new Date(dateTime);
  return !isNaN(date.getTime());
};

/**
 * Valida que la fecha de regreso sea posterior a la de salida
 */
export const validateReturnAfterDeparture = (departure: string, returnDate: string): boolean => {
  if (!departure || !returnDate) return false;
  const departureTime = new Date(departure).getTime();
  const returnTime = new Date(returnDate).getTime();
  return returnTime > departureTime;
};

/**
 * Valida el tipo de viaje
 */
export const validateTripType = (tripType: string): boolean => {
  const validTypes = ['negocios', 'turismo', 'otros'];
  return validTypes.includes(tripType);
};

/**
 * Valida el estado de la solicitud
 */
export const validateStatus = (status: string): boolean => {
  const validStatuses = ['pendiente', 'en_proceso', 'finalizada'];
  return validStatuses.includes(status);
};
