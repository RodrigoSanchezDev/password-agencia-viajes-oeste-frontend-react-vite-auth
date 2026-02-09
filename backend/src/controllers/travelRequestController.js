/**
 * Controlador de Solicitudes de Viaje
 * Maneja la lógica de registro y gestión de solicitudes
 */

const travelRequestModel = require('../models/travelRequestModel');
const { 
  validateRequired, 
  validateEmail, 
  validateDni, 
  validateDateTime,
  validateTripType,
  validateStatus 
} = require('../utils/validation');

/**
 * Obtener todas las solicitudes de viaje
 * GET /api/travel-requests
 */
exports.getAll = async (req, res) => {
  try {
    const requests = travelRequestModel.getAll();
    
    console.log(`[TravelRequest] Listando ${requests.length} solicitudes`);
    
    res.json({
      message: 'Solicitudes obtenidas exitosamente',
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('[TravelRequest] Error al obtener solicitudes:', error.message);
    res.status(500).json({
      error: 'Error del servidor',
      message: 'Error al obtener las solicitudes de viaje'
    });
  }
};

/**
 * Obtener una solicitud por ID
 * GET /api/travel-requests/:id
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = travelRequestModel.findById(parseInt(id));

    if (!request) {
      return res.status(404).json({
        error: 'No encontrada',
        message: 'La solicitud de viaje no existe'
      });
    }

    res.json({
      message: 'Solicitud obtenida exitosamente',
      data: request
    });
  } catch (error) {
    console.error('[TravelRequest] Error al obtener solicitud:', error.message);
    res.status(500).json({
      error: 'Error del servidor',
      message: 'Error al obtener la solicitud de viaje'
    });
  }
};

/**
 * Crear nueva solicitud de viaje
 * POST /api/travel-requests
 */
exports.create = async (req, res) => {
  try {
    const {
      clientDni,
      clientName,
      clientEmail,
      origin,
      destination,
      tripType,
      departureDateTime,
      returnDateTime,
      status
    } = req.body;

    // Validaciones del lado del servidor
    const errors = [];

    // Validar campos requeridos
    if (!validateRequired(clientDni)) {
      errors.push({ field: 'clientDni', message: 'El DNI del cliente es requerido' });
    } else if (!validateDni(clientDni)) {
      errors.push({ field: 'clientDni', message: 'El formato del DNI no es válido (ej: 12345678-9)' });
    }

    if (!validateRequired(clientName)) {
      errors.push({ field: 'clientName', message: 'El nombre del cliente es requerido' });
    }

    if (!validateRequired(clientEmail)) {
      errors.push({ field: 'clientEmail', message: 'El email del cliente es requerido' });
    } else if (!validateEmail(clientEmail)) {
      errors.push({ field: 'clientEmail', message: 'El formato del email no es válido' });
    }

    if (!validateRequired(origin)) {
      errors.push({ field: 'origin', message: 'El origen es requerido' });
    }

    if (!validateRequired(destination)) {
      errors.push({ field: 'destination', message: 'El destino es requerido' });
    }

    if (!validateRequired(tripType)) {
      errors.push({ field: 'tripType', message: 'El tipo de viaje es requerido' });
    } else if (!validateTripType(tripType)) {
      errors.push({ field: 'tripType', message: 'El tipo de viaje debe ser: negocios, turismo u otros' });
    }

    if (!validateRequired(departureDateTime)) {
      errors.push({ field: 'departureDateTime', message: 'La fecha y hora de salida es requerida' });
    } else if (!validateDateTime(departureDateTime)) {
      errors.push({ field: 'departureDateTime', message: 'El formato de fecha y hora de salida no es válido' });
    }

    if (!validateRequired(returnDateTime)) {
      errors.push({ field: 'returnDateTime', message: 'La fecha y hora de regreso es requerida' });
    } else if (!validateDateTime(returnDateTime)) {
      errors.push({ field: 'returnDateTime', message: 'El formato de fecha y hora de regreso no es válido' });
    }

    // Validar que la fecha de regreso sea posterior a la de salida
    if (departureDateTime && returnDateTime) {
      const departure = new Date(departureDateTime);
      const returnDate = new Date(returnDateTime);
      if (returnDate <= departure) {
        errors.push({ field: 'returnDateTime', message: 'La fecha de regreso debe ser posterior a la fecha de salida' });
      }
    }

    if (status && !validateStatus(status)) {
      errors.push({ field: 'status', message: 'El estado debe ser: pendiente, en_proceso o finalizada' });
    }

    // Si hay errores de validación, retornar
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Errores de validación',
        message: 'Por favor corrige los siguientes errores',
        errors
      });
    }

    // Crear la solicitud
    const newRequest = travelRequestModel.create({
      clientDni,
      clientName,
      clientEmail,
      origin,
      destination,
      tripType,
      departureDateTime,
      returnDateTime,
      status: status || 'pendiente'
    });

    console.log(`[TravelRequest] Solicitud creada: ${newRequest.id} para ${clientName}`);

    res.status(201).json({
      message: 'Solicitud de viaje registrada exitosamente',
      data: newRequest
    });
  } catch (error) {
    console.error('[TravelRequest] Error al crear solicitud:', error.message);
    res.status(500).json({
      error: 'Error del servidor',
      message: 'Error al registrar la solicitud de viaje'
    });
  }
};

/**
 * Actualizar una solicitud de viaje
 * PUT /api/travel-requests/:id
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verificar que la solicitud existe
    const existingRequest = travelRequestModel.findById(parseInt(id));
    if (!existingRequest) {
      return res.status(404).json({
        error: 'No encontrada',
        message: 'La solicitud de viaje no existe'
      });
    }

    // Validaciones opcionales para campos actualizados
    const errors = [];

    if (updateData.clientEmail && !validateEmail(updateData.clientEmail)) {
      errors.push({ field: 'clientEmail', message: 'El formato del email no es válido' });
    }

    if (updateData.clientDni && !validateDni(updateData.clientDni)) {
      errors.push({ field: 'clientDni', message: 'El formato del DNI no es válido' });
    }

    if (updateData.tripType && !validateTripType(updateData.tripType)) {
      errors.push({ field: 'tripType', message: 'El tipo de viaje debe ser: negocios, turismo u otros' });
    }

    if (updateData.status && !validateStatus(updateData.status)) {
      errors.push({ field: 'status', message: 'El estado debe ser: pendiente, en_proceso o finalizada' });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Errores de validación',
        message: 'Por favor corrige los siguientes errores',
        errors
      });
    }

    const updatedRequest = travelRequestModel.update(parseInt(id), updateData);

    console.log(`[TravelRequest] Solicitud actualizada: ${id}`);

    res.json({
      message: 'Solicitud de viaje actualizada exitosamente',
      data: updatedRequest
    });
  } catch (error) {
    console.error('[TravelRequest] Error al actualizar solicitud:', error.message);
    res.status(500).json({
      error: 'Error del servidor',
      message: 'Error al actualizar la solicitud de viaje'
    });
  }
};

/**
 * Actualizar estado de una solicitud
 * PATCH /api/travel-requests/:id/status
 */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!validateStatus(status)) {
      return res.status(400).json({
        error: 'Estado inválido',
        message: 'El estado debe ser: pendiente, en_proceso o finalizada'
      });
    }

    const existingRequest = travelRequestModel.findById(parseInt(id));
    if (!existingRequest) {
      return res.status(404).json({
        error: 'No encontrada',
        message: 'La solicitud de viaje no existe'
      });
    }

    const updatedRequest = travelRequestModel.updateStatus(parseInt(id), status);

    console.log(`[TravelRequest] Estado actualizado: ${id} -> ${status}`);

    res.json({
      message: 'Estado de solicitud actualizado exitosamente',
      data: updatedRequest
    });
  } catch (error) {
    console.error('[TravelRequest] Error al actualizar estado:', error.message);
    res.status(500).json({
      error: 'Error del servidor',
      message: 'Error al actualizar el estado de la solicitud'
    });
  }
};

/**
 * Eliminar una solicitud de viaje
 * DELETE /api/travel-requests/:id
 */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const existingRequest = travelRequestModel.findById(parseInt(id));
    if (!existingRequest) {
      return res.status(404).json({
        error: 'No encontrada',
        message: 'La solicitud de viaje no existe'
      });
    }

    travelRequestModel.delete(parseInt(id));

    console.log(`[TravelRequest] Solicitud eliminada: ${id}`);

    res.json({
      message: 'Solicitud de viaje eliminada exitosamente'
    });
  } catch (error) {
    console.error('[TravelRequest] Error al eliminar solicitud:', error.message);
    res.status(500).json({
      error: 'Error del servidor',
      message: 'Error al eliminar la solicitud de viaje'
    });
  }
};

/**
 * Obtener estadísticas de solicitudes
 * GET /api/travel-requests/stats
 */
exports.getStats = async (req, res) => {
  try {
    const stats = travelRequestModel.getStats();

    res.json({
      message: 'Estadísticas obtenidas exitosamente',
      data: stats
    });
  } catch (error) {
    console.error('[TravelRequest] Error al obtener estadísticas:', error.message);
    res.status(500).json({
      error: 'Error del servidor',
      message: 'Error al obtener las estadísticas'
    });
  }
};

/**
 * Buscar solicitudes por DNI del cliente
 * GET /api/travel-requests/search/dni/:dni
 */
exports.searchByDni = async (req, res) => {
  try {
    const { dni } = req.params;
    const requests = travelRequestModel.findByClientDni(dni);

    res.json({
      message: 'Búsqueda completada',
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('[TravelRequest] Error en búsqueda:', error.message);
    res.status(500).json({
      error: 'Error del servidor',
      message: 'Error al buscar solicitudes'
    });
  }
};

/**
 * Renderizado SSR - Genera HTML de la lista de solicitudes
 * GET /api/travel-requests/ssr/list
 */
exports.getListSSR = async (req, res) => {
  try {
    const requests = travelRequestModel.getAll();
    const stats = travelRequestModel.getStats();

    // Generar HTML renderizado desde el servidor
    const html = generateRequestsListHTML(requests, stats);

    res.json({
      message: 'HTML generado desde el servidor (SSR)',
      html,
      data: requests,
      stats
    });
  } catch (error) {
    console.error('[TravelRequest] Error en SSR:', error.message);
    res.status(500).json({
      error: 'Error del servidor',
      message: 'Error al generar el contenido SSR'
    });
  }
};

/**
 * Genera el HTML de la lista de solicitudes (SSR)
 */
function generateRequestsListHTML(requests, stats) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pendiente': '<span class="status-badge status-badge--pending">Pendiente</span>',
      'en_proceso': '<span class="status-badge status-badge--processing">En Proceso</span>',
      'finalizada': '<span class="status-badge status-badge--completed">Finalizada</span>'
    };
    return badges[status] || status;
  };

  const getTripTypeBadge = (type) => {
    const badges = {
      'negocios': '<span class="trip-badge trip-badge--business">Negocios</span>',
      'turismo': '<span class="trip-badge trip-badge--tourism">Turismo</span>',
      'otros': '<span class="trip-badge trip-badge--other">Otros</span>'
    };
    return badges[type] || type;
  };

  const requestsHTML = requests.length > 0 
    ? requests.map(request => `
      <tr class="table-row" data-id="${request.id}">
        <td class="table-cell table-cell--id">#${request.id}</td>
        <td class="table-cell">${request.clientDni}</td>
        <td class="table-cell">${request.clientName}</td>
        <td class="table-cell">${request.origin}</td>
        <td class="table-cell">${request.destination}</td>
        <td class="table-cell">${getTripTypeBadge(request.tripType)}</td>
        <td class="table-cell">${formatDate(request.departureDateTime)}</td>
        <td class="table-cell">${formatDate(request.returnDateTime)}</td>
        <td class="table-cell">${getStatusBadge(request.status)}</td>
        <td class="table-cell table-cell--date">${formatDate(request.createdAt)}</td>
      </tr>
    `).join('')
    : `<tr><td colspan="10" class="table-empty">No hay solicitudes registradas</td></tr>`;

  return `
    <div class="ssr-content">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.total}</div>
          <div class="stat-label">Total Solicitudes</div>
        </div>
        <div class="stat-card stat-card--pending">
          <div class="stat-value">${stats.pendientes}</div>
          <div class="stat-label">Pendientes</div>
        </div>
        <div class="stat-card stat-card--processing">
          <div class="stat-value">${stats.enProceso}</div>
          <div class="stat-label">En Proceso</div>
        </div>
        <div class="stat-card stat-card--completed">
          <div class="stat-value">${stats.finalizadas}</div>
          <div class="stat-label">Finalizadas</div>
        </div>
      </div>
      
      <div class="table-container">
        <table class="requests-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DNI Cliente</th>
              <th>Nombre Cliente</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Tipo</th>
              <th>Salida</th>
              <th>Regreso</th>
              <th>Estado</th>
              <th>Fecha Registro</th>
            </tr>
          </thead>
          <tbody>
            ${requestsHTML}
          </tbody>
        </table>
      </div>
      
      <div class="ssr-footer">
        <p class="ssr-timestamp">Contenido renderizado desde el servidor: ${new Date().toLocaleString('es-CL')}</p>
      </div>
    </div>
  `;
}
