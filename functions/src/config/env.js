const functions = require('firebase-functions');

// Maneja las variables de entorno de Firebase Functions
// Uso: firebase functions:config:set gemini.key="XXX"
const config = functions.config();

module.exports = {
  GEMINI_API_KEY: config.gemini ? config.gemini.key : process.env.GEMINI_API_KEY,
  SUNAT_API_KEY: config.sunat ? config.sunat.key : process.env.SUNAT_API_KEY,
};
