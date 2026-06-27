// public/js/firebase_config.js
const firebaseConfig = {
  apiKey: "AIzaSyCpk750OMf__JHzpaRzj7kY_ZT_JQcN8So",
  authDomain: "portal-j3k.firebaseapp.com",
  databaseURL: "https://portal-j3k-default-rtdb.firebaseio.com",
  projectId: "portal-j3k",
  storageBucket: "portal-j3k.firebasestorage.app",
  messagingSenderId: "207672062499",
  appId: "1:207672062499:web:40ee4e50ea1762e7d97796",
  measurementId: "G-D22515RW53"
};

// Initialize Firebase using the Compat SDK
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
let auth;
if (typeof firebase.auth === 'function') {
  auth = firebase.auth();
  window.firebaseAuth = auth;
}
if (auth) {
  auth.onAuthStateChanged(user => {
    if (user) {
      // Recargar página tras autenticación para actualizar cotizaciones
      location.reload();
    }
  });
}
window.waitForAuth = function() {
  return new Promise((resolve) => {
    if (window.firebaseAuth) {
      const unsubscribe = window.firebaseAuth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    } else {
      resolve(null);
    }
  });
};
// Universal function to sync DB updates
window.saveToFirebase = async function(path, data) {
  try {
    // Ensure user is authenticated before writing
    if (window.waitForAuth) await window.waitForAuth();
    await db.ref(path).set(data);
  } catch (error) {
    console.error("Firebase save error:", error);
    alert("Error al guardar en la nube: " + error.message);
  }
};

window.loadFromFirebase = async function(path) {
  try {
    // Ensure user is authenticated before reading
    if (window.waitForAuth) await window.waitForAuth();
    const snapshot = await db.ref(path).once('value');
    return snapshot.val();
  } catch (error) {
    console.error("Firebase load error:", error);
    return null;
  }
};
