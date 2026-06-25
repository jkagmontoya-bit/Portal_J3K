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
      else if(e.message === 'pending_approval') setError('Tu cuenta está pendiente de aprobación.');
      else setError('Error de Firebase: ' + e.message);
    }
  };

  return (
    <div className="login-overlay open" role="dialog" aria-modal="true">
      <div className="login-card">
        <div className="login-kicker">Acceso privado J3K</div>
        <div className="login-title">Contabilidad</div>
        <div className="login-help">Inicia sesión para abrir el panel oculto.</div>
        
        {error && <div className="login-error">{error}</div>}

        <div className="login-actions">
          <button className="cancel" onClick={onClose}>Cancelar</button>
        </div>

        <div style={{ marginTop: '15px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '15px' }}>
          <button type="button" onClick={handleGoogle} style={{ background: 'white', color: '#757575', border: '1px solid #ddd', borderRadius: '5px', padding: '10px', width: '100%', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            Continuar con Google
          </button>
        </div>
      </div>
    </div>
  );
}

function Drawer({ isOpen, onClose, onLogout, modules = [], manifestError = '', onLoadModule }) {
  // Group modules by category
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
              <React.Fragment key={cat}>
                <div className="drawer-category">{cat}</div>
                {mods.map(mod => (
                  <div key={mod.id} className="drawer-item" onClick={() => onLoadModule(mod)}>
                    <div className="drawer-item-title">{mod.titulo}</div>
                    <div className="drawer-item-desc">{mod.descripcion}</div>
                  </div>
                ))}
              </React.Fragment>
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

  const loadViewerModule = async (mod) => {
    try {
      const response = await fetch(`data:${mod.mime};base64,${mod.b64}`);
      const blob = await response.blob();
      setViewerUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("Error creating Blob from base64:", err);
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
        onLoginSuccess={() => { setShowLogin(false); setShowDrawer(true); }} 
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