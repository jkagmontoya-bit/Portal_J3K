import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import './index.css';

function FloatingTools({ onRequestLogin, onOpenAdmin }) {
  const { isAdmin } = useAuth();
  return (
    <div className="floating-tools" aria-label="Accesos rápidos J3K">
      <button className="tool-btn accounting-launcher" onClick={onRequestLogin} title="Contabilidad">
        <span className="accounting-label">Contabilidad </span>
        <span className="dot" aria-hidden="true"></span>
      </button>
      {isAdmin && (
        <button className="tool-btn accounting-launcher" onClick={onOpenAdmin} title="Admin" style={{ marginTop: '8px' }}>
          <span className="accounting-label">Admin </span>
        </button>
      )}
    </div>
  );
}

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const { loginGoogle } = useAuth();
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGoogle = async () => {
    try {
      setError('');
      await loginGoogle();
      onLoginSuccess();
    } catch(e) {
      if(e.message === 'new_user_pending') setError('Cuenta creada. Se envió correo al admin.');
      else if(e.message === 'pending_approval') setError('Tu cuenta está en revisión. Te avisaremos cuando se apruebe.');
      else setError('Error de Firebase: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-overlay" style={{ display: 'flex' }} onClick={onClose}></div>
      <div className="login-modal" style={{ display: 'flex' }}>
        <h2 className="login-title">Acceso J3K</h2>
        <p className="login-subtitle">Inicia sesión con tu cuenta de Google autorizada.</p>
        <button className="auth-google-btn" onClick={handleGoogleLogin} disabled={loading}>
          <svg className="auth-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="auth-btn-text">{loading ? 'Conectando...' : 'Continuar con Google'}</span>
        </button>
        {error && <p className="auth-error" style={{ color: '#ff6b6b', fontSize: '13px', marginTop: '15px', textAlign: 'center' }}>{error}</p>}
        {error === 'Tu cuenta está en revisión. Te avisaremos cuando se apruebe.' && (
          <p style={{ color: '#aaa', fontSize: '12px', marginTop: '10px', textAlign: 'center' }}>Por favor contacta al administrador de J3K.</p>
        )}
      </div>
    </>
  );
}

const MOTIVATIONAL_QUOTES = [
  "El éxito no es el final, el fracaso no es fatal: es el coraje de continuar lo que cuenta.",
  "Juntos, como equipo J3K, construimos el futuro hoy. ¡A darle con todo!",
  "Los grandes logros no son hechos por la fuerza, sino por la perseverancia.",
  "La innovación distingue a los líderes de los seguidores. Sigamos liderando, equipo.",
  "No hay reto demasiado grande cuando trabajamos unidos. ¡Adelante Ingenieros!"
];

function WelcomeModal({ isOpen, onClose, userName }) {
  const quote = React.useMemo(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)], [isOpen]);
  if (!isOpen) return null;

  return (
    <>
      <div className="login-overlay" style={{ display: 'flex' }} onClick={onClose}></div>
      <div className="login-modal" style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', zIndex: 10000, maxWidth: '450px', alignItems: 'center' }}>
        <h2 style={{ color: 'var(--j3k-light)', marginBottom: '10px', fontSize: '24px' }}>¡Bienvenido al Equipo!</h2>
        <h3 style={{ color: 'white', marginBottom: '20px', fontWeight: 500, fontSize: '18px' }}>{userName || 'Ingeniero'}</h3>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid var(--j3k-light)', fontStyle: 'italic', color: '#e0e0e0', marginBottom: '25px', lineHeight: '1.6', fontSize: '15px', width: '100%' }}>
          "{quote}"
        </div>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '25px' }}>Mucho ánimo para seguir adelante.<br/><b>J3K Ingenieros.</b></p>
        <button className="auth-google-btn" onClick={onClose} style={{ justifyContent: 'center', width: '100%' }}>
          <span className="auth-btn-text">Ir a mis módulos</span>
        </button>
      </div>
    </>
  );
}

function decodeUtf8(str) {
  if (!str) return '';
  try {
    return decodeURIComponent(escape(str));
  } catch(e) {
    return str;
  }
}

function Drawer({ isOpen, onClose, onLogout, modules = [], manifestError = '', onLoadModule }) {
  const categories = modules.reduce((acc, mod) => {
    if (!acc[mod.categoria]) acc[mod.categoria] = [];
    acc[mod.categoria].push(mod);
    return acc;
  }, {});

  return (
    <>
      {isOpen && <div className="backdrop" onClick={onClose} style={{ display: 'block' }}></div>}
      <aside className={`drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-head">
          <div className="drawer-badge" aria-hidden="true">J3K</div>
          <div style={{ flex: 1 }}>
            <div className="drawer-title">Módulos J3K</div>
            <div className="drawer-sub">Acceso protegido para gestión contable interna.</div>
          </div>
          <button className="close-btn" onClick={onLogout} title="Cerrar Sesión" style={{ marginRight: '10px', fontSize: '16px', background: 'rgba(255,50,50,0.2)', borderRadius: '5px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚪</button>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="drawer-body">
          {manifestError ? (
            <div style={{ padding: '20px', color: '#ff6b6b' }}>
              <strong>Error al cargar los módulos:</strong>
              <p>{manifestError}</p>
            </div>
          ) : Object.keys(categories).length === 0 ? (
            <p style={{ padding: '20px', color: 'white' }}>Cargando módulos...</p>
          ) : (
            Object.entries(categories).map(([cat, mods]) => (
              <details key={cat} className="category" open={cat === 'CONTABILIDAD'}>
                <summary>{decodeUtf8(cat)}</summary>
                <div className="module-list">
                  {mods.map(mod => (
                    <button key={mod.id} type="button" className="module-card" onClick={() => onLoadModule(mod)}>
                      <b>{decodeUtf8(mod.titulo)}</b>
                      <span>{decodeUtf8(mod.descripcion)}</span>
                    </button>
                  ))}
                </div>
              </details>
            ))
          )}
        </div>
      </aside>
    </>
  );
}

function App() {
  const { currentUser, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [viewerUrl, setViewerUrl] = useState('');
  const [modules, setModules] = useState([]);
  const [manifestError, setManifestError] = useState('');

  useEffect(() => {
    fetch('/manifest.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then(text => {
        if(text.trim().startsWith('<')) throw new Error('Vercel devolvió HTML en lugar de JSON (posible error 404 o rewrite).');
        return JSON.parse(text);
      })
      .then(async data => {
        if (data.modules && data.modules.length > 0) {
          setModules(data.modules);
          const inicio = data.modules[0];
          loadViewerModule(inicio);
        } else {
          setManifestError('El manifest.json no contiene módulos.');
        }
      })
      .catch(err => {
        console.error("Error loading manifest:", err);
        setManifestError(err.message);
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const approveUid = params.get('approveUser');
    
    if (approveUid && currentUser && currentUser.email === 'jkag.montoya@gmail.com') {
      import('firebase/firestore').then(({ doc, updateDoc }) => {
        import('./firebase.js').then(({ db }) => {
          const userRef = doc(db, 'users', approveUid);
          updateDoc(userRef, { approved: true })
            .then(() => {
              alert('¡Usuario aprobado exitosamente!');
              window.history.replaceState({}, document.title, "/");
            })
            .catch(err => alert('Error al aprobar usuario: ' + err.message));
        });
      });
    }
  }, [currentUser]);

  const loadViewerModule = async (mod) => {
    if (mod.url) {
      setViewerUrl(mod.url);
    } else if (mod.b64) {
      try {
        const response = await fetch(`data:${mod.mime};base64,${mod.b64}`);
        const blob = await response.blob();
        setViewerUrl(URL.createObjectURL(blob));
      } catch (err) {
        console.error("Error creating Blob from base64:", err);
      }
    }
  };

  const handleRequestLogin = () => {
    if (currentUser) setShowDrawer(true);
    else setShowLogin(true);
  };

  const handleLogout = () => {
    logout();
    setShowDrawer(false);
  };

  const handleLoadModule = (mod) => {
    loadViewerModule(mod);
    setShowDrawer(false);
  };

  return (
    <div className="app">
      <iframe id="viewer" src={viewerUrl} title="Portal Corporativo J3K" style={{ width: '100%', height: '100%', border: 'none' }}></iframe>
      <FloatingTools 
        onRequestLogin={handleRequestLogin} 
        onOpenAdmin={() => setShowAdmin(true)} 
      />
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLoginSuccess={() => { setShowLogin(false); setShowWelcome(true); }} 
      />
      <WelcomeModal
        isOpen={showWelcome}
        onClose={() => { setShowWelcome(false); setShowDrawer(true); }}
        userName={currentUser?.email?.split('@')[0]}
      />
      <Drawer 
        isOpen={showDrawer} 
        onClose={() => setShowDrawer(false)} 
        onLogout={handleLogout}
        modules={modules}
        manifestError={manifestError}
        onLoadModule={handleLoadModule}
      />
    </div>
  );
}

export default App;