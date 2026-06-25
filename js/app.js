import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
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
const provider = new GoogleAuthProvider();

console.log("Cliente Firebase inicializado");

async function handleUserAccess(user, isGoogle) {
  const email = user.email;
  
  if (email.toLowerCase() === "jkag.montoya@gmail.com") {
    console.log("Master login");
    const adminBtn = document.getElementById("adminBtn");
    if (adminBtn) adminBtn.style.display = "flex";
    
    // Auto aprobar si venía del correo
    const pendingUid = sessionStorage.getItem('pendingApproveUid');
    if (pendingUid) {
      try {
        await updateDoc(doc(db, "users", pendingUid), { approved: true });
        alert("¡Usuario aprobado automáticamente con éxito!");
        sessionStorage.removeItem('pendingApproveUid');
      } catch(e) {
        console.error("Error al auto-aprobar:", e);
      }
    }
    return true;
  }
  
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);
  
  if (userDoc.exists()) {
    if (userDoc.data().approved === true) {
      console.log("Usuario aprobado");
      return true;
    } else {
      console.log("Usuario no aprobado");
      await signOut(auth);
      throw new Error("pending_approval");
    }
  } else {
    // Si es nuevo (solo Google permite registro ahora)
    if (!isGoogle) {
      await signOut(auth);
      throw new Error("auth/user-not-found");
    }
    
    await setDoc(userDocRef, {
      email: email,
      approved: false,
      createdAt: new Date().toISOString()
    });
    
    // Send email via FormSubmit
    try {
      await fetch("https://formsubmit.co/ajax/jkag.montoya@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            subject: "Aprobación de usuario - Portal J3K",
            message: `El usuario ${email} ha iniciado sesión por primera vez y solicita acceso.`,
            link: `https://portal-j3-k.vercel.app/?approveUser=${user.uid}`
        })
      });
    } catch(e) {
      console.error("Error al enviar correo:", e);
    }

    await signOut(auth);
    throw new Error("new_user_pending");
  }
}

window.probarLogin = async function(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return await handleUserAccess(userCredential.user, false);
  } catch (error) {
    if (error.message === "pending_approval") throw new Error("Tu cuenta está pendiente de aprobación.");
    if (error.message === "auth/user-not-found") throw new Error("Credenciales incorrectas o cuenta no registrada.");
    if (error.code === "auth/invalid-credential") throw new Error("Credenciales incorrectas.");
    throw error;
  }
};

window.loginConGoogle = async function() {
  try {
    const result = await signInWithPopup(auth, provider);
    return await handleUserAccess(result.user, true);
  } catch (error) {
    if (error.message === "pending_approval") throw new Error("Tu cuenta está pendiente de aprobación.");
    if (error.message === "new_user_pending") throw new Error("Cuenta creada. Se ha enviado un correo al administrador para tu aprobación.");
    if (error.code !== "auth/popup-closed-by-user") throw new Error("Error al iniciar sesión con Google.");
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

window.cerrarSesionAuth = async function() {
  await signOut(auth);
};