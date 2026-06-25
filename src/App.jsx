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
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
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
    <div className="login-overlay open" role="dialog" aria-modal="true">
      <div className="login-card">
        <div className="login-kicker">Acceso privado J3K</div>
        <div className="login-title">Contabilidad</div>
        <div className="login-help">Inicia sesión con tu cuenta de Google autorizada.</div>
        
        {error && <div className="login-error" style={{ color: '#ff6b6b', marginTop: '10px' }}>{error}</div>}
        {error === 'Tu cuenta está en revisión. Te avisaremos cuando se apruebe.' && (
          <div style={{ color: '#aaa', fontSize: '12px', marginTop: '5px' }}>Por favor contacta al administrador.</div>
        )}

        <div className="login-actions">
          <button className="cancel" onClick={onClose}>Cancelar</button>
        </div>

        <div style={{ marginTop: '15px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '15px' }}>
          <button type="button" onClick={handleGoogleLogin} disabled={loading} style={{ background: 'white', color: '#757575', border: '1px solid #ddd', borderRadius: '5px', padding: '10px', width: '100%', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            {loading ? 'Conectando...' : 'Continuar con Google'}
          </button>
        </div>
      </div>
    </div>
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
    <div className="login-overlay open" role="dialog" aria-modal="true" style={{ zIndex: 9999 }}>
      <div className="login-card" style={{ textAlign: 'center', padding: '40px 30px' }}>
        <div className="login-kicker" style={{ marginBottom: '10px' }}>J3K INGENIEROS</div>
        <h2 style={{ color: 'var(--j3k-light)', marginBottom: '5px', fontSize: '26px', marginTop: 0 }}>¡Bienvenido al Equipo!</h2>
        <h3 style={{ color: 'white', marginBottom: '25px', fontWeight: 500, fontSize: '18px' }}>{userName || 'Ingeniero'}</h3>
        
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid var(--j3k-light)', fontStyle: 'italic', color: '#e0e0e0', marginBottom: '30px', lineHeight: '1.6', fontSize: '15px', width: '100%', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)' }}>
          "{quote}"
        </div>
        
        <button onClick={onClose} style={{ 
          background: 'linear-gradient(135deg, var(--j3k-primary), var(--j3k-light))',
          color: '#111', 
          border: 'none', 
          borderRadius: '8px', 
          padding: '15px 30px', 
          width: '100%', 
          cursor: 'pointer', 
          fontWeight: 'bold', 
          fontSize: '18px',
          boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.5)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)'; }}
        >
          Ir a mis módulos
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </div>
    </div>
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
          <button className="close-btn" onClick={onLogout} title="Cerrar Sesión" style={{ marginRight: '10px', background: 'rgba(255,50,50,0.2)', borderRadius: '5px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
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