$firebaseJs = @"
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: `"AIzaSyCpk750OMf__JHzpaRzj7kY_ZT_JQcN8So`",
  authDomain: `"portal-j3k.firebaseapp.com`",
  projectId: `"portal-j3k`",
  storageBucket: `"portal-j3k.firebasestorage.app`",
  messagingSenderId: `"207672062499`",
  appId: `"1:207672062499:web:40ee4e50ea1762e7d97796`",
  measurementId: `"G-D22515RW53`"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
export { signInWithPopup, signOut, signInWithEmailAndPassword };
"@

$authContext = @"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, provider, signInWithPopup, signOut, signInWithEmailAndPassword } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const email = user.email.toLowerCase();
        if (email === 'jkag.montoya@gmail.com') {
          setIsAdmin(true);
          setCurrentUser(user);
          // Auto approve check
          const pendingUid = sessionStorage.getItem('pendingApproveUid');
          if (pendingUid) {
            try {
              await updateDoc(doc(db, 'users', pendingUid), { approved: true });
              alert('¡Usuario aprobado automáticamente!');
              sessionStorage.removeItem('pendingApproveUid');
            } catch(e) {
              console.error(e);
            }
          }
        } else {
          setIsAdmin(false);
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().approved === true) {
            setCurrentUser(user);
          } else {
            setCurrentUser(null);
            await signOut(auth);
          }
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    if (user.email.toLowerCase() === 'jkag.montoya@gmail.com') return;
    
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, { email: user.email, approved: false, createdAt: new Date().toISOString() });
      await fetch('https://formsubmit.co/ajax/jkag.montoya@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
            subject: 'Aprobación de usuario - Portal J3K',
            message: `El usuario \${user.email} solicita acceso.`,
            link: `https://portal-j3-k.vercel.app/?approveUser=\${user.uid}`
        })
      });
      await signOut(auth);
      throw new Error('new_user_pending');
    } else if (userDoc.data().approved !== true) {
      await signOut(auth);
      throw new Error('pending_approval');
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, loginGoogle, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
"@

$appJsx = @"
import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import './index.css';

function App() {
  const { currentUser, isAdmin, loginGoogle, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = async () => {
    try {
      setLoginError('');
      await loginGoogle();
      setDrawerOpen(true);
    } catch(e) {
      if (e.message === 'new_user_pending') setLoginError('Cuenta creada. Se envió correo al admin.');
      else if (e.message === 'pending_approval') setLoginError('Tu cuenta está pendiente de aprobación.');
      else setLoginError('Error al iniciar sesión.');
    }
  };

  return (
    <div className="app-container">
      <header style={{ padding: '20px', background: 'var(--j3k-gold)', color: 'black' }}>
        <h1>Portal J3K - React</h1>
        {!currentUser ? (
          <div>
            <button onClick={handleLogin}>Continuar con Google</button>
            {loginError && <p style={{color: 'red'}}>{loginError}</p>}
          </div>
        ) : (
          <div>
            <p>Bienvenido, {currentUser.email}</p>
            <button onClick={() => setDrawerOpen(true)}>Abrir Módulos</button>
            <button onClick={logout}>Cerrar Sesión</button>
            {isAdmin && <button style={{background:'red', color:'white'}}>Panel Admin</button>}
          </div>
        )}
      </header>

      {drawerOpen && currentUser && (
        <aside className="drawer open">
          <div className="drawer-head">
            <h3>Módulos J3K</h3>
            <button onClick={() => setDrawerOpen(false)}>Cerrar X</button>
          </div>
          <div className="drawer-body">
            <p>Aquí cargarán tus módulos...</p>
          </div>
        </aside>
      )}
    </div>
  );
}

export default App;
"@

$mainJsx = @"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
"@

New-Item -Path "portal-react\src\context" -ItemType Directory -Force | Out-Null
[IO.File]::WriteAllText("portal-react\src\firebase.js", $firebaseJs, [Text.Encoding]::UTF8)
[IO.File]::WriteAllText("portal-react\src\context\AuthContext.jsx", $authContext, [Text.Encoding]::UTF8)
[IO.File]::WriteAllText("portal-react\src\App.jsx", $appJsx, [Text.Encoding]::UTF8)
[IO.File]::WriteAllText("portal-react\src\main.jsx", $mainJsx, [Text.Encoding]::UTF8)

Write-Output "React components scaffolded successfully."
