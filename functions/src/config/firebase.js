const admin = require('firebase-admin');

// Inicializar la aplicación de Firebase Admin
admin.initializeApp();

const db = admin.database();

module.exports = {
  admin,
  db
};
