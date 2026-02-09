/**
 * Rutas de Solicitudes de Viaje
 * Endpoints para gestionar solicitudes de viaje
 */

const express = require('express');
const router = express.Router();
const travelRequestController = require('../controllers/travelRequestController');
const { authenticateToken } = require('../middleware/authMiddleware');

// =============================================
// RUTAS DE SOLICITUDES DE VIAJE
// =============================================

// GET /api/travel-requests/stats - Obtener estadísticas (antes de :id para evitar conflictos)
router.get('/stats', authenticateToken, travelRequestController.getStats);

// GET /api/travel-requests/ssr/list - Obtener lista renderizada desde servidor (SSR)
router.get('/ssr/list', authenticateToken, travelRequestController.getListSSR);

// GET /api/travel-requests/search/dni/:dni - Buscar por DNI
router.get('/search/dni/:dni', authenticateToken, travelRequestController.searchByDni);

// GET /api/travel-requests - Obtener todas las solicitudes
router.get('/', authenticateToken, travelRequestController.getAll);

// GET /api/travel-requests/:id - Obtener una solicitud por ID
router.get('/:id', authenticateToken, travelRequestController.getById);

// POST /api/travel-requests - Crear nueva solicitud
router.post('/', authenticateToken, travelRequestController.create);

// PUT /api/travel-requests/:id - Actualizar solicitud
router.put('/:id', authenticateToken, travelRequestController.update);

// PATCH /api/travel-requests/:id/status - Actualizar estado
router.patch('/:id/status', authenticateToken, travelRequestController.updateStatus);

// DELETE /api/travel-requests/:id - Eliminar solicitud
router.delete('/:id', authenticateToken, travelRequestController.delete);

module.exports = router;
