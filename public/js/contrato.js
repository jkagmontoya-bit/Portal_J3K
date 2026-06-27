const DB_KEY = 'contratos_db';
const firmas = ["firmaArr", "firmaJ3K"];
let currentAction = null;

function syncCampos() {
  const pares = [
    ["lugarFirma","lugarTexto"], ["fechaContrato","fechaTexto"],
    ["arrNombre","arrNombreTexto"], ["arrDoc","arrDocTexto"], ["arrDomicilio","arrDomTexto"],
    ["repNombre","repTexto"], ["repDni","repDniTexto"],
    ["fechaInicio","clInicio"], ["fechaFin","clFin"], ["renta","clRenta"],
    ["placa","actaPlaca"], ["kmEntrega","actaKm"], ["soat","actaSoat"], ["revtec","actaRev"],
    ["arrNombre","firmaArrNombre"], ["arrDoc","firmaArrDoc"],
    ["repNombre","firmaRep"], ["repDni","firmaRepDni"]
  ];
  pares.forEach(([a,b]) => {
    const origen = document.querySelector(`[data-key="${a}"]`);
    const destino = document.querySelector(`[data-key="${b}"]`);
    if (origen && destino && !destino.value) destino.value = origen.value;
  });
}

function limpiarCampos() {
  document.querySelectorAll(".page input:not([type=file]), .page textarea").forEach(el => el.value = "");
  document.querySelectorAll(".page .sig-area img").forEach(img => {
    img.removeAttribute("src");
    img.style.display = "none";
  });
  document.querySelectorAll(".page .sig-placeholder").forEach(el => el.style.display = "block");
  document.querySelectorAll('.page input[type="file"]').forEach(el => el.value = "");
}

function recoger() {
  syncCampos();
  const d = { campos: {}, checks: {}, firmas: {} };
  document.querySelectorAll("[data-key]").forEach(el => {
    if (el.type === "checkbox") d.checks[el.dataset.key] = el.checked;
    else d.campos[el.dataset.key] = el.value;
  });
  firmas.forEach(id => {
    const c = document.getElementById(id);
    if(c) d.firmas[id] = c.toDataURL("image/png");
  });
  d.timestamp = new Date().toISOString();
  return d;
}

function aplicar(d) {
  if (!d) return;
  Object.entries(d.campos || {}).forEach(([k,v]) => {
    const el = document.querySelector(`[data-key="${k}"]`);
    if (el && el.type !== "checkbox") el.value = v;
  });
  Object.entries(d.checks || {}).forEach(([k,v]) => {
    const el = document.querySelector(`[data-key="${k}"]`);
    if (el && el.type === "checkbox") el.checked = !!v;
  });
  setTimeout(() => {
    Object.entries(d.firmas || {}).forEach(([id,src]) => restaurarFirma(id, src));
  }, 100);
}

// DASHBOARD
async function renderDashboard() {
  const table = document.getElementById("dbTbody");
  if (!table) return;
  const contratos = await localforage.getItem(DB_KEY) || [];
  table.innerHTML = "";
  if (contratos.length === 0) {
    table.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">No hay contratos guardados.</td></tr>';
    return;
  }

  const select = document.getElementById('filtroMes');
  if (select && select.options.length <= 1 && contratos.length > 0) {
    const months = new Set();
    contratos.forEach(c => {
      if(c.timestamp) {
        const d = new Date(c.timestamp);
        const mm = String(d.getMonth()+1).padStart(2, '0');
        const yyyy = d.getFullYear();
        months.add(`${mm}/${yyyy}`);
      } else if (c.date) {
        // Fallback for old records
        const parts = c.date.split(',')[0].split('/');
        if(parts.length >= 3) {
          const mm = parts[1].padStart(2, '0');
          const yyyy = parts[2];
          months.add(`${mm}/${yyyy}`);
        }
      }
    });
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
    const now = new Date();
    const curStr = `${String(now.getMonth()+1).padStart(2, '0')}/${now.getFullYear()}`;
    if (months.has(curStr)) select.value = curStr;
  }
  
  const filterVal = select ? select.value : 'todos';
  const filtered = contratos.filter(c => {
    if(filterVal === 'todos') return true;
    let recStr = "";
    if(c.timestamp) {
      const d = new Date(c.timestamp);
      recStr = `${String(d.getMonth()+1).padStart(2, '0')}/${d.getFullYear()}`;
    } else if (c.date) {
      const parts = c.date.split(',')[0].split('/');
      if(parts.length >= 3) recStr = `${parts[1].padStart(2, '0')}/${parts[2]}`;
    }
    return filterVal === recStr;
  });
  
  filtered.slice().reverse().forEach(c => {
    const tr = document.createElement("tr");
    const arr = (c.campos && c.campos.arrNombre) ? c.campos.arrNombre : ((c.fields && c.fields[3]) ? c.fields[3] : 'SIN NOMBRE');
    tr.innerHTML = `
      <td style="padding:12px; border-bottom:1px solid #e2e8f0;"><b>${c.cui}</b></td>
      <td style="padding:12px; border-bottom:1px solid #e2e8f0;">${c.date || 'Reciente'}</td>
      <td style="padding:12px; border-bottom:1px solid #e2e8f0;">${arr}</td>
      <td style="padding:12px; border-bottom:1px solid #e2e8f0;">
        <button onclick="editarContrato('${c.cui}')" style="background:#3b82f6; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-size:12px;">Abrir</button>
        <button onclick="eliminarContrato('${c.cui}')" style="background:#ef4444; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-size:12px;">X</button>
      </td>
    `;
    table.appendChild(tr);
  });
}

function showDashboard() {
  document.getElementById("view-dashboard").style.display = "block";
  document.getElementById("view-editor").style.display = "none";
  renderDashboard();
}

function showEditor() {
  document.getElementById("view-dashboard").style.display = "none";
  document.getElementById("view-editor").style.display = "block";
}

async function nuevoContrato() {
  document.getElementById("editorTitle").innerText = "Nuevo Contrato";
  limpiarCampos();
  
  const contratos = await localforage.getItem(DB_KEY) || [];
  let nextId = 1;
  const nums = contratos.map(c => parseInt(c.cui.replace('CUI-CONT-', ''))).filter(n => !isNaN(n));
  if (nums.length > 0) nextId = Math.max(...nums) + 1;
  
  const newCui = "CUI-CONT-" + String(nextId).padStart(3, '0');
  document.getElementById("cui-display").innerText = newCui;
  document.getElementById("cui-hidden").value = newCui;
  
  showEditor();
}

async function guardarContrato() {
  const cui = document.getElementById("cui-hidden").value;
  if (!cui) return;
  const data = recoger();
  data.cui = cui;
  data.date = new Date().toLocaleString();
  
  let contratos = await localforage.getItem(DB_KEY) || [];
  const index = contratos.findIndex(a => a.cui === cui);
  if (index >= 0) {
    contratos[index] = data;
  } else {
    contratos.push(data);
  }
  await localforage.setItem(DB_KEY, contratos);
  
  alert("Contrato guardado exitosamente.");
  showDashboard();
}

function editarContrato(cui) {
  currentAction = { type: 'edit', cui: cui };
  document.getElementById("auth-pin").value = "";
  document.getElementById("modal-auth").style.display = "flex";
}

function eliminarContrato(cui) {
  currentAction = { type: 'delete', cui: cui };
  document.getElementById("auth-pin").value = "";
  document.getElementById("modal-auth").style.display = "flex";
}

function cerrarAuth() {
  document.getElementById("modal-auth").style.display = "none";
  currentAction = null;
}

async function confirmarAuth() {
  const pinInput = document.getElementById("auth-pin").value;
  const masterPin = localStorage.getItem("J3K_MASTER_PIN") || "0000";
  
  if (pinInput !== masterPin) {
    alert("PIN incorrecto. Operación denegada.");
    return;
  }
  
  cerrarAuth();
  
  if (currentAction && currentAction.type === 'edit') {
    const contratos = await localforage.getItem(DB_KEY) || [];
    const con = contratos.find(a => a.cui === currentAction.cui);
    if(con) {
      document.getElementById("cui-display").innerText = currentAction.cui;
      document.getElementById("cui-hidden").value = currentAction.cui;
      document.getElementById("editorTitle").innerText = "Editar Contrato";
      limpiarCampos();
      aplicar(con);
      showEditor();
    }
  } else if (currentAction && currentAction.type === 'delete') {
    if (confirm("¿Está seguro de eliminar permanentemente?")) {
      let contratos = await localforage.getItem(DB_KEY) || [];
      contratos = contratos.filter(a => a.cui !== currentAction.cui);
      await localforage.setItem(DB_KEY, contratos);
      renderDashboard();
    }
  }
  currentAction = null;
}

// FUNCIONES EXTRAS
function exportar() {
  const d = recoger();
  const currentCui = document.getElementById("cui-hidden").value || "NUEVO";
  const placa = (d.campos.placa || "sin_placa").replace(/[^a-zA-Z0-9_-]/g, "_");
  const blob = new Blob([JSON.stringify(d, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "contrato_arrendamiento_" + currentCui + "_" + placa + ".json";
  a.click();
  URL.revokeObjectURL(a.href);
}

// FIRMA LOGIC
function iniciarFirma(canvas) {
  if(!canvas) return;
  const ctx = canvas.getContext("2d");
  let dib = false, x = 0, y = 0;

  function redim() {
    const anterior = canvas.toDataURL();
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, rect.width * window.devicePixelRatio);
    canvas.height = Math.max(1, rect.height * window.devicePixelRatio);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    if (anterior && anterior.length > 100) restaurarFirma(canvas.id, anterior);
  }

  function pos(e) {
    const rect = canvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - rect.left, y: p.clientY - rect.top };
  }

  function inicio(e) {
    e.preventDefault();
    dib = true;
    const p = pos(e);
    x = p.x; y = p.y;
  }

  function mover(e) {
    if (!dib) return;
    e.preventDefault();
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    x = p.x; y = p.y;
  }

  function fin(e) { if(e) e.preventDefault(); dib = false; }

  canvas.addEventListener("mousedown", inicio);
  canvas.addEventListener("mousemove", mover);
  canvas.addEventListener("mouseup", fin);
  canvas.addEventListener("mouseleave", fin);
  canvas.addEventListener("touchstart", inicio, {passive:false});
  canvas.addEventListener("touchmove", mover, {passive:false});
  canvas.addEventListener("touchend", fin, {passive:false});
  redim();
  window.addEventListener("resize", redim);
}

function limpiarFirma(id) {
  const c = document.getElementById(id);
  if(!c) return;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
}

function restaurarFirma(id, src) {
  const c = document.getElementById(id);
  if (!c || !src) return;
  const ctx = c.getContext("2d");
  const img = new Image();
  img.onload = () => {
    const rect = c.getBoundingClientRect();
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, rect.width, rect.height);
  };
  img.src = src;
}

window.onload = () => {
  firmas.forEach(id => iniciarFirma(document.getElementById(id)));
  document.querySelectorAll("[data-key]").forEach(el => el.addEventListener("change", syncCampos));
  renderDashboard();
};