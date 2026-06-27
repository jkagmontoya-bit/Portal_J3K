let DB_COMPRAS = [];
let currentDoc = null;

window.buscarRucCompras = async function() {
  const rucInput = document.getElementById('prov-ruc').value.trim();
  if (!rucInput) return alert("Ingrese un RUC para buscar.");
  
  if (window.J3K_UI) window.J3K_UI.showLoading("Consultando SUNAT...");
  try {
    const resp = await window.J3K_API.sunat.consultarDocumento('ruc', rucInput);
    if (resp.success) {
      document.getElementById('prov-nombre').value = resp.data.razon_social || '';
      if (window.J3K_UI) window.J3K_UI.showToast("RUC encontrado");
    } else {
      alert("No se encontró el RUC: " + resp.message);
    }
  } catch (e) {
    console.error(e);
    alert("Error de conexión al consultar RUC.");
  } finally {
    if (window.J3K_UI) window.J3K_UI.hideLoading();
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  try {
    let stored = await window.loadFromFirebase('compras');
    if (!stored) {
      stored = await localforage.getItem('j3k_compras_db');
      if (stored) await window.saveToFirebase('compras', stored);
    }
    if(stored) DB_COMPRAS = stored;
    renderDashboard();
  } catch(e) {
    console.error(e);
  }
});

// View Navigation
function switchView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${viewId}`).classList.add('active');
  
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`nav-${viewId}`).classList.add('active');
  
  if(viewId === 'dashboard') renderDashboard();
  if(viewId === 'tesoreria') renderTesoreria();
}

// Editor logic
function crearNuevoRequerimiento() {
  currentDoc = { id: `REQ-${Date.now()}`, items: [], estado: 'Borrador' };
  document.getElementById('editor-title').innerText = '✏️ Nuevo Requerimiento';
  document.getElementById('req-area').value = 'Proyectos';
  document.getElementById('req-cui').value = '';
  document.getElementById('req-desc').value = '';
  document.getElementById('panel-proveedor').style.display = 'none';
  
  renderItems();
  switchView('editor');
}

function agregarItem() {
  if(!currentDoc) return;
  currentDoc.items.push({ desc: '', cant: 1, und: 'und', precio: 0 });
  renderItems();
}

function removerItem(idx) {
  currentDoc.items.splice(idx, 1);
  renderItems();
}

function renderItems() {
  const tbody = document.getElementById('tbody-items');
  tbody.innerHTML = '';
  currentDoc.items.forEach((it, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="padding:5px;"><input type="text" class="i-desc" value="${it.desc}" placeholder="Descripción..."></td>
      <td style="padding:5px;"><input type="number" class="i-cant" value="${it.cant}" min="1"></td>
      <td style="padding:5px;"><input type="text" class="i-und" value="${it.und}"></td>
      <td style="padding:5px;"><input type="number" class="i-precio" value="${it.precio}" step="0.01"></td>
      <td style="padding:5px; text-align:center;"><button class="alt" onclick="removerItem(${idx})" style="padding:4px; font-size:10px; color:red;">❌</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function guardarCompra() {
  if(!currentDoc) return;
  
  // Save inputs
  currentDoc.area = document.getElementById('req-area').value;
  currentDoc.cui = document.getElementById('req-cui').value;
  currentDoc.desc = document.getElementById('req-desc').value;
  
  // Save items
  const tbody = document.getElementById('tbody-items');
  currentDoc.items = [];
  Array.from(tbody.rows).forEach(tr => {
    currentDoc.items.push({
      desc: tr.querySelector('.i-desc').value,
      cant: parseFloat(tr.querySelector('.i-cant').value) || 0,
      und: tr.querySelector('.i-und').value,
      precio: parseFloat(tr.querySelector('.i-precio').value) || 0
    });
  });
  
  if(currentDoc.estado === 'Borrador') currentDoc.estado = 'Solicitado';
  
  const existingIdx = DB_COMPRAS.findIndex(c => c.id === currentDoc.id);
  if(existingIdx >= 0) DB_COMPRAS[existingIdx] = currentDoc;
  else DB_COMPRAS.push(currentDoc);
  
  if (window.saveToFirebase) {
    window.saveToFirebase('compras', DB_COMPRAS);
  }
  localforage.setItem('j3k_compras_db', DB_COMPRAS);
  alert("Requerimiento guardado con éxito.");
  switchView('dashboard');
}

// Render Dashboard
function renderDashboard() {
  const select = document.getElementById('filtroMes');
  if (select && select.options.length <= 1 && DB_COMPRAS.length > 0) {
    const months = new Set();
    DB_COMPRAS.forEach(c => {
      const ts = parseInt(c.id.replace('REQ-', ''));
      if(!isNaN(ts)) {
        const d = new Date(ts);
        const mm = String(d.getMonth()+1).padStart(2, '0');
        const yyyy = d.getFullYear();
        months.add(`${mm}/${yyyy}`);
      }
    });
    
    // Sort descending
    const sorted = Array.from(months).sort((a,b) => {
      const [m1,y1] = a.split('/'); const [m2,y2] = b.split('/');
      return (y2+m2).localeCompare(y1+m1);
    });
    
    sorted.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      select.appendChild(opt);
    });
    
    // Default to current month if available
    const now = new Date();
    const curM = String(now.getMonth()+1).padStart(2, '0');
    const curY = now.getFullYear();
    const curStr = `${curM}/${curY}`;
    if (months.has(curStr)) {
      select.value = curStr;
    }
  }

  const colReq = document.getElementById('col-req');
  const colCot = document.getElementById('col-cot');
  const colOc = document.getElementById('col-oc');
  const colFac = document.getElementById('col-fac');
  
  colReq.innerHTML = ''; colCot.innerHTML = ''; colOc.innerHTML = ''; colFac.innerHTML = '';
  
  let countReq = 0, countCot = 0, countOc = 0, countFac = 0;
  
  const filterVal = select ? select.value : 'todos';
  
  const filtered = DB_COMPRAS.filter(c => {
    if(filterVal === 'todos') return true;
    const ts = parseInt(c.id.replace('REQ-', ''));
    if(!isNaN(ts)) {
      const d = new Date(ts);
      const mm = String(d.getMonth()+1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return filterVal === `${mm}/${yyyy}`;
    }
    return true;
  });

  filtered.forEach(c => {
    let printBtn = '';
    if (c.estado === 'Emitido' || c.estado === 'Facturado') {
      printBtn = `<button class="alt" style="margin-top:5px; width:100%; font-size:11px;" onclick="imprimirOC('${c.id}')">🖨️ Imprimir OC</button>`;
    }

    const card = document.createElement('div');
    card.className = 'k-card';
    card.innerHTML = `
      <div class="k-cui">${c.id}</div>
      <div class="k-desc">${J3K_UTILS.escapeHTML(c.desc || 'Sin descripción')}</div>
      <div class="k-meta"><span>${J3K_UTILS.escapeHTML(c.area)}</span> <span>${c.cui || 'S/C'}</span></div>
      ${printBtn}
    `;
    
    if(c.estado === 'Solicitado') { colReq.appendChild(card); countReq++; }
    else if(c.estado === 'Evaluando') { colCot.appendChild(card); countCot++; }
    else if(c.estado === 'Emitido') { colOc.appendChild(card); countOc++; }
    else { colFac.appendChild(card); countFac++; }
  });
  
  document.getElementById('count-req').innerText = countReq;
  document.getElementById('count-cot').innerText = countCot;
  document.getElementById('count-oc').innerText = countOc;
  document.getElementById('count-fac').innerText = countFac;
}

// Print OC
window.imprimirOC = function(id) {
  const c = DB_COMPRAS.find(x => x.id === id);
  if(!c) return;

  document.getElementById('p-oc-id').innerText = c.id || '';
  const now = new Date();
  document.getElementById('p-oc-fecha').innerText = now.toLocaleDateString('es-PE');
  document.getElementById('p-oc-prov').innerText = c.proveedorNombre || 'Por definir';
  document.getElementById('p-oc-ruc').innerText = c.proveedorRuc || 'Por definir';
  document.getElementById('p-oc-area').innerText = c.area || '';
  document.getElementById('p-oc-cui').innerText = c.cui || 'N/A';

  const tbody = document.getElementById('p-oc-items');
  tbody.innerHTML = '';
  let subtotal = 0;
  
  (c.items || []).forEach((it, idx) => {
    const cant = parseFloat(it.cant) || 0;
    const precio = parseFloat(it.precio) || 0;
    const total = cant * precio;
    subtotal += total;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="border:1px solid #000; padding:5px; text-align:center;">${idx + 1}</td>
      <td style="border:1px solid #000; padding:5px;">${J3K_UTILS.escapeHTML(it.desc)}</td>
      <td style="border:1px solid #000; padding:5px; text-align:center;">${cant}</td>
      <td style="border:1px solid #000; padding:5px; text-align:center;">${J3K_UTILS.escapeHTML(it.und)}</td>
      <td style="border:1px solid #000; padding:5px; text-align:right;">S/ ${precio.toFixed(2)}</td>
      <td style="border:1px solid #000; padding:5px; text-align:right;">S/ ${total.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });

  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  document.getElementById('p-oc-subtotal').innerText = 'S/ ' + subtotal.toFixed(2);
  document.getElementById('p-oc-igv').innerText = 'S/ ' + igv.toFixed(2);
  document.getElementById('p-oc-total').innerText = 'S/ ' + total.toFixed(2);

  window.print();
}

// Tesoreria
function renderTesoreria() {
  const list = document.getElementById('list-tesoreria');
  list.innerHTML = '<p style="color:#64748B; font-size:13px;">No hay facturas pendientes de pago.</p>';
}

// Utils
function confirmarAuth() {
  const pin = document.getElementById('auth-pin').value;
  const master = localStorage.getItem('J3K_MASTER_PIN');
  if(pin === master) {
    alert("Autorizado.");
    document.getElementById('modal-auth').style.display = 'none';
  } else {
    alert("PIN incorrecto.");
  }
}
