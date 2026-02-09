/**
 * Servidor principal de la Agencia de Viajes Oeste
 * Backend con Node.js + Express + JWT para autenticación
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const travelRequestRoutes = require('./routes/travelRequestRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // URL del frontend Vite
  credentials: true
}));
app.use(express.json());

// Logging middleware para desarrollo
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/travel-requests', travelRequestRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor de Agencia Viajes Oeste funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   🌴 AGENCIA DE VIAJES OESTE - Backend Server');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`   🚀 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`   📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`   🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log('═══════════════════════════════════════════════════════════');
});

module.exports = app;
