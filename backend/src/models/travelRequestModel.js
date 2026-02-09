/**
 * Modelo de Solicitud de Viaje
 * Gestiona el almacenamiento y operaciones de solicitudes en archivo JSON
 */

const fs = require('fs');
const path = require('path');

// Ruta al archivo de datos de solicitudes de viaje
const DATA_FILE = path.join(__dirname, '../../data/travel-requests.json');

/**
 * Asegura que el directorio y archivo de datos existan
 */
const ensureDataFile = () => {
  const dataDir = path.dirname(DATA_FILE);
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('[TravelRequestModel] Directorio de datos creado:', dataDir);
  }

  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      travelRequests: [],
      lastId: 1000
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    console.log('[TravelRequestModel] Archivo de solicitudes creado:', DATA_FILE);
  }
};

/**
 * Lee todas las solicitudes del archivo JSON
 */
const readData = () => {
  ensureDataFile();
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('[TravelRequestModel] Error al leer solicitudes:', error.message);
    return { travelRequests: [], lastId: 1000 };
  }
};

/**
 * Guarda las solicitudes en el archivo JSON
 */
const saveData = (data) => {
  ensureDataFile();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('[TravelRequestModel] Error al guardar solicitudes:', error.message);
    return false;
  }
};

/**
 * Genera el siguiente ID correlativo
 */
const getNextId = () => {
  const data = readData();
  data.lastId += 1;
  saveData(data);
  return data.lastId;
};

/**
 * Obtiene todas las solicitudes de viaje
 */
exports.getAll = () => {
  const data = readData();
  return data.travelRequests;
};

/**
 * Busca una solicitud por ID
 */
exports.findById = (id) => {
  const data = readData();
  return data.travelRequests.find(request => request.id === id);
};

/**
 * Busca solicitudes por DNI del cliente
 */
exports.findByClientDni = (dni) => {
  const data = readData();
  return data.travelRequests.filter(request => request.clientDni === dni);
};

/**
 * Busca solicitudes por estado
 */
exports.findByStatus = (status) => {
  const data = readData();
  return data.travelRequests.filter(request => request.status === status);
};

/**
 * Crea una nueva solicitud de viaje
 */
exports.create = (requestData) => {
  const data = readData();
  
  const newRequest = {
    id: getNextId(),
    clientDni: requestData.clientDni,
    clientName: requestData.clientName,
    clientEmail: requestData.clientEmail,
    origin: requestData.origin,
    destination: requestData.destination,
    tripType: requestData.tripType, // 'negocios', 'turismo', 'otros'
    departureDateTime: requestData.departureDateTime,
    returnDateTime: requestData.returnDateTime,
    status: requestData.status || 'pendiente', // 'pendiente', 'en_proceso', 'finalizada'
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  data.travelRequests.push(newRequest);
  saveData(data);

  console.log(`[TravelRequestModel] Solicitud creada con ID: ${newRequest.id}`);
  return newRequest;
};

/**
 * Actualiza una solicitud de viaje
 */
exports.update = (id, updateData) => {
  const data = readData();
  const index = data.travelRequests.findIndex(request => request.id === id);

  if (index === -1) {
    return null;
  }

  // Actualizar solo los campos proporcionados
  const updatedRequest = {
    ...data.travelRequests[index],
    ...updateData,
    id: id, // Asegurar que el ID no cambie
    updatedAt: new Date().toISOString()
  };

  data.travelRequests[index] = updatedRequest;
  saveData(data);

  console.log(`[TravelRequestModel] Solicitud actualizada: ${id}`);
  return updatedRequest;
};

/**
 * Actualiza el estado de una solicitud
 */
exports.updateStatus = (id, status) => {
  return exports.update(id, { status });
};

/**
 * Elimina una solicitud de viaje
 */
exports.delete = (id) => {
  const data = readData();
  const index = data.travelRequests.findIndex(request => request.id === id);

  if (index === -1) {
    return false;
  }

  data.travelRequests.splice(index, 1);
  saveData(data);

  console.log(`[TravelRequestModel] Solicitud eliminada: ${id}`);
  return true;
};

/**
 * Obtiene estadísticas de solicitudes
 */
exports.getStats = () => {
  const data = readData();
  const requests = data.travelRequests;

  return {
    total: requests.length,
    pendientes: requests.filter(r => r.status === 'pendiente').length,
    enProceso: requests.filter(r => r.status === 'en_proceso').length,
    finalizadas: requests.filter(r => r.status === 'finalizada').length,
    porTipo: {
      negocios: requests.filter(r => r.tripType === 'negocios').length,
      turismo: requests.filter(r => r.tripType === 'turismo').length,
      otros: requests.filter(r => r.tripType === 'otros').length
    }
  };
};
