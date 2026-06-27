const admin = require('firebase-admin');

// Inicializar la aplicación de Firebase Admin
// Evita errores cuando se ejecuta fuera del entorno de Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://dummy-url.firebaseio.com"
  });
}

// Inicializar BD solo si es necesario o manejar perezosamente
const getDb = () => admin.database();

module.exports = {
  admin,
  get db() { return getDb(); }
};
