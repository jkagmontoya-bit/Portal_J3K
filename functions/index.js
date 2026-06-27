const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

// Middlewares
const errorHandler = require('./src/middlewares/errorHandler');
const authMiddleware = require('./src/middlewares/auth.middleware');

// Controllers
const sunatController = require('./src/controllers/sunat.controller');
const iaController = require('./src/controllers/ia.controller');
const contabilidadController = require('./src/controllers/contabilidad.controller');
const authController = require('./src/controllers/auth.controller');

// Triggers
const auditoriaTrigger = require('./src/triggers/auditoria.trigger');

// Inicializar App
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Opcional: Proteger todas las rutas con authMiddleware si es necesario
// app.use('/api/v1', authMiddleware);

// Rutas SUNAT
app.get('/api/v1/sunat/consulta-documento', sunatController.consultaDocumento);

// Rutas Contabilidad (SIRE / PLAME)
app.post('/api/v1/contabilidad/generar-sire', contabilidadController.generarSire);
app.post('/api/v1/contabilidad/generar-plame', contabilidadController.generarPlame);

// Rutas IA
app.post('/api/v1/ia/extraer-factura', iaController.extraerFactura);

// Rutas Auth
app.use('/api/v1/auth', authController);

// Error Handler Centralizado (Debe ir al final)
app.use(errorHandler);

// Exportar Express app
exports.api = functions.https.onRequest(app);

// Exportar Triggers
exports.auditoriaExpedientes = auditoriaTrigger.onExpedienteWrite;
