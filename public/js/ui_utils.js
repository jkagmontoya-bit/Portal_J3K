/**
 * J3K UI Utilities
 * Gestor de Micro-Componentes Visuales (Vanilla JS)
 */

const uiStyles = `
<style>
  .j3k-loader-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(4px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    transition: opacity 0.3s ease;
  }
  .j3k-spinner {
    width: 50px; height: 50px;
    border: 4px solid var(--primary-light, #dbeafe);
    border-top: 4px solid var(--primary, #1e3a8a);
    border-radius: 50%;
    animation: j3k-spin 1s linear infinite;
    margin-bottom: 20px;
  }
  .j3k-loader-text {
    font-family: inherit;
    color: var(--primary, #1e3a8a);
    font-size: 1.1rem;
    font-weight: 500;
  }
  @keyframes j3k-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>
`;

// Inyectar estilos al cargar el módulo
document.head.insertAdjacentHTML('beforeend', uiStyles);

export const J3K_UI = {
  
  _loaderId: 'j3k-global-loader',

  showLoading(message = 'Procesando...') {
    let loader = document.getElementById(this._loaderId);
    if (!loader) {
      loader = document.createElement('div');
      loader.id = this._loaderId;
      loader.className = 'j3k-loader-overlay';
      
      const spinner = document.createElement('div');
      spinner.className = 'j3k-spinner';
      
      const text = document.createElement('div');
      text.className = 'j3k-loader-text';
      text.id = `${this._loaderId}-text`;
      
      loader.appendChild(spinner);
      loader.appendChild(text);
      document.body.appendChild(loader);
    }
    document.getElementById(`${this._loaderId}-text`).innerText = message;
    loader.style.display = 'flex';
    loader.style.opacity = '1';
  },

  hideLoading() {
    const loader = document.getElementById(this._loaderId);
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 300);
    }
  },

  showToast(message, type = 'info') {
    console.log(`[Toast - ${type}]: ${message}`);
  },

  showPinModal(attemptsLeft, callback, onCancel) {
    // Eliminar si existe uno previo
    const existing = document.getElementById('j3k-pin-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'j3k-pin-modal';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,14,20,0.85);backdrop-filter:blur(6px);display:flex;justify-content:center;align-items:center;z-index:9999;';
    
    const box = document.createElement('div');
    box.style.cssText = 'background:white;padding:32px;border-radius:12px;width:100%;max-width:360px;box-shadow:0 12px 32px rgba(0,0,0,0.2);text-align:center;border-top:4px solid #1E3A8A;';
    
    box.innerHTML = `
      <div style="font-size:32px;margin-bottom:12px;">🔒</div>
      <h3 style="margin:0 0 8px 0;font-family:inherit;color:#0A0E14;">Seguridad J3K</h3>
      <p style="margin:0 0 20px 0;font-size:14px;color:#3A4250;">Este expediente está finalizado.<br>Ingrese el PIN Maestro para habilitar la edición.</p>
      <input type="password" id="j3k-pin-input" placeholder="••••••••" style="width:100%;padding:12px;border:1px solid #E2E6EA;border-radius:6px;font-size:24px;text-align:center;letter-spacing:4px;outline:none;margin-bottom:12px;">
      <p style="margin:0 0 20px 0;font-size:12px;color:#ef4444;font-weight:600;">Intentos restantes: ${attemptsLeft}</p>
      <div style="display:flex;gap:12px;">
        <button id="j3k-pin-cancel" style="flex:1;padding:10px;border:1px solid #E2E6EA;background:white;border-radius:6px;cursor:pointer;font-weight:600;">Cancelar</button>
        <button id="j3k-pin-submit" style="flex:1;padding:10px;border:none;background:#1E3A8A;color:white;border-radius:6px;cursor:pointer;font-weight:600;">Desbloquear</button>
      </div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const input = document.getElementById('j3k-pin-input');
    const btnSubmit = document.getElementById('j3k-pin-submit');
    const btnCancel = document.getElementById('j3k-pin-cancel');

    input.focus();

    const submitAction = () => {
      const pin = input.value;
      if (!pin) return;
      overlay.remove();
      callback(pin);
    };

    btnSubmit.onclick = submitAction;
    input.onkeyup = (e) => { if (e.key === 'Enter') submitAction(); };
    btnCancel.onclick = () => {
      overlay.remove();
      if (onCancel) onCancel();
    };
  }
};

window.J3K_UI = J3K_UI;
