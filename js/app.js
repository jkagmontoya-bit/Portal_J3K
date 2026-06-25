import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCpk750OMf__JHzpaRzj7kY_ZT_JQcN8So",
  authDomain: "portal-j3k.firebaseapp.com",
  projectId: "portal-j3k",
  storageBucket: "portal-j3k.firebasestorage.app",
  messagingSenderId: "207672062499",
  appId: "1:207672062499:web:40ee4e50ea1762e7d97796",
  measurementId: "G-D22515RW53"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("Cliente Firebase inicializado");

window.probarLogin = async function(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    if (email.toLowerCase() === "jkag.montoya@gmail.com") {
      console.log("Master login");
      const adminBtn = document.getElementById("adminBtn");
      if (adminBtn) adminBtn.style.display = "flex";
      return true;
    }
    
    // Verificar si está aprobado
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists() && userDoc.data().approved === true) {
      console.log("Usuario aprobado");
      return true;
    } else {
      console.log("Usuario no aprobado");
      await signOut(auth);
      throw new Error("pending_approval");
    }
  } catch (error) {
    console.log("Error Firebase:", error.code, error.message);
    if (error.message === "pending_approval") {
      throw new Error("Tu cuenta está pendiente de aprobación por el administrador.");
    }
    if (error.code === "auth/invalid-credential") {
      throw new Error("Credenciales incorrectas.");
    }
    throw error;
  }
};

window.registrarUsuario = async function(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      approved: false,
      createdAt: new Date().toISOString()
    });
    
    await signOut(auth);
    return true;
  } catch(error) {
    console.log("Error Register:", error.code, error.message);
    if (error.code === "auth/email-already-in-use") {
      throw new Error("El correo ya está registrado.");
    }
    if (error.code === "auth/weak-password") {
      throw new Error("La contraseña debe tener al menos 6 caracteres.");
    }
    throw error;
  }
};

window.cargarPendientes = async function() {
  const q = query(collection(db, "users"), where("approved", "==", false));
  const querySnapshot = await getDocs(q);
  const pendientes = [];
  querySnapshot.forEach((d) => {
    pendientes.push({ id: d.id, ...d.data() });
  });
  return pendientes;
};

window.aprobarUsuario = async function(uid) {
  await updateDoc(doc(db, "users", uid), {
    approved: true
  });
};