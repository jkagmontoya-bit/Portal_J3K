import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import './index.css';

function FloatingTools({ onRequestLogin, onOpenAdmin, onOpenProfile }) {
  const { isAdmin, currentUser, userData } = useAuth();
  return (
    <div className="floating-dock" aria-label="Accesos rápidos J3K">
      <a href="/Formato_Requerimiento_J3K_Premium.xlsx" download className="dock-btn" title="Solicitar Propuesta (Descargar Formato)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      </a>
      
      {currentUser && (
        <button className="dock-btn" onClick={onOpenProfile} title="Ajustes de Perfil">
          {userData?.photoBase64 ? (
            <img src={userData.photoBase64} alt="Perfil" style={{width: 24, height: 24, borderRadius: '50%', objectFit: 'cover'}} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          )}
        </button>
      )}

      <button className="dock-btn primary" onClick={onRequestLogin} title="Panel de Contabilidad">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        <span className="dock-btn-text">Contabilidad</span>
      </button>

      {isAdmin && (
        <button className="dock-btn" onClick={onOpenAdmin} title="Panel de Administrador">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
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
      setLoading(true);
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
        <div className="login-kicker">Acceso Privado</div>
        <div className="login-title">Portal Contable J3K</div>
        <div className="login-help">Inicia sesión con tu cuenta de Google autorizada.</div>
        
        {error && <div className="login-error">{error}</div>}

        <div style={{ marginTop: '24px' }}>
          <button type="button" onClick={handleGoogleLogin} disabled={loading} className="btn btn-primary">
            {loading ? 'Conectando...' : 'Continuar con Google'}
          </button>
        </div>

        <div className="login-actions" style={{ marginTop: '16px' }}>
          <button className="btn btn-secondary" style={{ width: '100%' }} onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

function ProfileModal({ isOpen, onClose }) {
  const { userData, updateProfile } = useAuth();
  const [alias, setAlias] = useState('');
  const [photo, setPhoto] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setAlias(userData.alias || '');
      setPhoto(userData.photoBase64 || '');
    }
  }, [userData, isOpen]);

  if (!isOpen) return null;

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 150;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > MAX_SIZE) { h *= MAX_SIZE / w; w = MAX_SIZE; }
        } else {
          if (h > MAX_SIZE) { w *= MAX_SIZE / h; h = MAX_SIZE; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        setPhoto(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(alias, photo);
      onClose();
    } catch(e) {
      alert("Error: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-overlay open" role="dialog" aria-modal="true">
      <div className="login-card welcome-card">
        <div className="login-kicker">Tu Identidad J3K</div>
        <h2 className="login-title" style={{ fontSize: '24px', marginBottom: '24px' }}>Ajustes de Perfil</h2>
        
        <div className="welcome-avatar" style={photo ? {background: 'transparent', boxShadow: 'none', marginBottom: '16px'} : { marginBottom: '16px' }}>
          {photo ? (
            <img src={photo} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '20px', objectFit: 'cover', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }} />
          ) : (
            <svg width="32" height="32" stroke="white" strokeWidth="2" fill="none" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          )}
        </div>
        
        <label className="btn btn-secondary" style={{ fontSize: '14px', minHeight: '40px', padding: '0 20px', cursor: 'pointer', marginBottom: '24px', display: 'inline-flex', width: 'auto' }}>
          Cambiar Fotografía
          <input type="file" accept="image/png, image/jpeg, image/webp" style={{ display: 'none' }} onChange={handleFile} />
        </label>

        <div className="welcome-quote" style={{ textAlign: 'left', margin: '0 0 24px 0', padding: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--j3k-emerald)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Alias / Nombre mostrado</label>
          <input 
            type="text" 
            value={alias} 
            onChange={e => setAlias(e.target.value)} 
            style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '2px solid rgba(16, 185, 129, 0.2)', fontSize: '18px', background: 'transparent', color: '#171717', fontFamily: 'inherit', fontWeight: 600, outline: 'none' }} 
            placeholder="Ej: Juan Montoya"
            onFocus={(e) => e.target.style.borderBottom = '2px solid var(--j3k-emerald)'}
            onBlur={(e) => e.target.style.borderBottom = '2px solid rgba(16, 185, 129, 0.2)'}
          />
        </div>

        <div className="login-actions" style={{ justifyContent: 'center', width: '100%' }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading} style={{ flex: 1 }}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading} style={{ flex: 1 }}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
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
  const { userData } = useAuth();
  const quote = React.useMemo(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)], [isOpen]);
  
  if (!isOpen) return null;

  const displayAlias = userData?.alias || userName || 'Ingeniero';
  const avatar = userData?.photoBase64 || null;

  return (
    <div className="login-overlay open" role="dialog" aria-modal="true">
      <div className="login-card welcome-card">
        <div className="welcome-avatar" style={avatar ? {background: 'transparent', boxShadow: 'none'} : {}}>
          {avatar ? (
            <img src={avatar} alt="User" style={{width: '100%', height: '100%', borderRadius: '20px', objectFit: 'cover', boxShadow: '0 12px 24px rgba(0,0,0,0.1)'}} />
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          )}
        </div>
        
        <div className="login-kicker">J3K INGENIEROS</div>
        <h2 className="login-title" style={{ fontSize: '28px' }}>¡Bienvenido al Equipo!</h2>
        <h3 style={{ color: '#52525b', fontWeight: 500, fontSize: '16px' }}>{displayAlias}</h3>
        
        <div className="welcome-quote">
          "{quote}"
        </div>
        
        <button onClick={onClose} className="btn btn-primary">
          Ir a mis módulos
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
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
  const { userData } = useAuth();
  
  const categories = modules.reduce((acc, mod) => {
    if (!acc[mod.categoria]) acc[mod.categoria] = [];
    acc[mod.categoria].push(mod);
    return acc;
  }, {});

  return (
    <>
      <div className={`backdrop ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <aside className={`drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-head">
          <div className="drawer-title-group">
            {userData?.photoBase64 ? (
              <img src={userData.photoBase64} alt="Avatar" className="drawer-badge" style={{ objectFit: 'cover' }} />
            ) : (
              <div className="drawer-badge" aria-hidden="true">J3K</div>
            )}
            <div>
              <div className="drawer-title">{userData?.alias || 'Módulos'}</div>
              <div className="drawer-sub">Gestión interna</div>
            </div>
          </div>
          <div className="close-actions">
            <button className="drawer-btn danger" onClick={onLogout} title="Cerrar Sesión">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
            <button className="drawer-btn" onClick={onClose} title="Cerrar menú">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>
        <div className="drawer-body">
          {manifestError ? (
            <div className="login-error">
              <strong>Error:</strong> {manifestError}
            </div>
          ) : Object.keys(categories).length === 0 ? (
            <p style={{ color: '#737373', fontSize: '14px' }}>Cargando módulos...</p>
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
  const [showProfile, setShowProfile] = useState(false);
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
    setViewerUrl('');
  };

  const handleLoadModule = (mod) => {
    loadViewerModule(mod);
    setShowDrawer(false);
  };

  const isViewerEmpty = !viewerUrl;

  return (
    <div className="app">
      {/* Hero Empty State (when no module is loaded) */}
      <div className={`hero-empty ${!isViewerEmpty ? 'hidden' : ''}`}>
        <div className="logo-glow">J3K</div>
        <h1>Portal Corporativo</h1>
        <p>Inicia sesión o selecciona un módulo para comenzar.</p>
      </div>

      <iframe 
        id="viewer" 
        src={viewerUrl} 
        title="Portal Corporativo J3K" 
        style={{ opacity: isViewerEmpty ? 0 : 1 }}
      ></iframe>
      
      <FloatingTools 
        onRequestLogin={handleRequestLogin} 
        onOpenAdmin={() => setShowAdmin(true)} 
        onOpenProfile={() => setShowProfile(true)}
      />
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLoginSuccess={() => { setShowLogin(false); setShowWelcome(true); }} 
      />
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
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