const { defineString, defineSecret } = require('firebase-functions/params');

// En v2, definimos los parámetros que se leerán desde el entorno.
// Si no están configurados, solicitarán su configuración al desplegar.
const geminiApiKey = defineString('GEMINI_API_KEY');
const sunatApiKey = defineString('SUNAT_API_KEY');
const masterPin = defineString('MASTER_PIN', { default: 'J3K2026' });

module.exports = {
  // Los valores se obtienen invocando .value() durante la ejecución de la función
  get GEMINI_API_KEY() { return geminiApiKey.value(); },
  get SUNAT_API_KEY() { return sunatApiKey.value(); },
  get MASTER_PIN() { return masterPin.value(); }
};
