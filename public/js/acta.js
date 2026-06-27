const DB_KEY = "actas_db";
let currentAction = null;

document.addEventListener("DOMContentLoaded", () => {
  renderDashboard();
});

async function renderDashboard() {
  const actas = await localforage.getItem(DB_KEY) || [];
  const tbody = document.getElementById("dbTbody");
  
  if (actas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">No hay actas guardadas.</td></tr>';
    return;
  }
  
  const select = document.getElementById('filtroMes');
  if (select && select.options.length <= 1 && actas.length > 0) {
    const months = new Set();
    actas.forEach(c => {
      if(c.timestamp) {
        const d = new Date(c.timestamp);
        const mm = String(d.getMonth()+1).padStart(2, '0');
        const yyyy = d.getFullYear();
        months.add(`${mm}/${yyyy}`);
      } else if (c.date) {
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
  const filtered = actas.filter(c => {
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
  
  tbody.innerHTML = '';
  
  filtered.slice().reverse().forEach(acta => {
    const fields = acta.fields || [];
    const fechaHora = (fields[0] && fields[1] && fields[2]) 
      ? `${fields[0]} de ${fields[1]} de 20${fields[2]} ${fields[3] || '--'}:${fields[4] || '--'}` 
      : '--';
    const arrendador = fields[14] || 'No especificado';
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${acta.cui || '--'}</strong></td>
      <td>${fechaHora}</td>
      <td>${arrendador}</td>
      <td>
        <button class="action-btn alt" onclick="editarActa('${acta.cui}')">✏️</button>
        <button class="action-btn alt" style="color:#ef4444;" onclick="eliminarActa('${acta.cui}')">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function showDashboard() {
  document.getElementById("view-editor").style.display = "none";
  document.getElementById("view-dashboard").style.display = "block";
  document.getElementById("view-dashboard").classList.add("active");
}

function showEditor() {
  document.getElementById("view-dashboard").style.display = "none";
  document.getElementById("view-dashboard").classList.remove("active");
  document.getElementById("view-editor").style.display = "block";
}

async function nuevaActa() {
  limpiarCampos();
  const actas = await localforage.getItem(DB_KEY) || [];
  const newCui = generarCUI(actas);
  document.getElementById("cui-display").innerText = newCui;
  document.getElementById("cui-hidden").value = newCui;
  document.getElementById("editorTitle").innerText = "Crear Acta";
  showEditor();
}

function generarCUI(actas) {
  if (!actas || actas.length === 0) return "CUI-ACTA-001";
  let max = 0;
  actas.forEach(a => {
    if (a.cui) {
      const parts = a.cui.split('-');
      if (parts.length === 3) {
        const num = parseInt(parts[2], 10);
        if (!isNaN(num) && num > max) max = num;
      }
    }
  });
  max++;
  return "CUI-ACTA-" + max.toString().padStart(3, '0');
}

function cargarFirma(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const container = input.parentElement.querySelector(".sig-area");
    const img = container.querySelector("img");
    const placeholder = container.querySelector(".sig-placeholder");
    img.src = e.target.result;
    img.style.display = "block";
    if (placeholder) placeholder.style.display = "none";
  };
  reader.readAsDataURL(file);
}

function borrarFirma(button) {
  const container = button.parentElement.querySelector(".sig-area");
  const img = container.querySelector("img");
  const placeholder = container.querySelector(".sig-placeholder");
  img.removeAttribute("src");
  img.style.display = "none";
  if (placeholder) placeholder.style.display = "block";
  const fileInput = button.parentElement.querySelector('input[type="file"]');
  if (fileInput) fileInput.value = "";
}

function recoger(cui) {
  const data = { cui: cui, fields: [], firmas: [] };
  document.querySelectorAll("#contenido-principal input:not([type=file]), #contenido-principal textarea").forEach(el => data.fields.push(el.value));
  document.querySelectorAll("#contenido-principal .sig-area img").forEach(img => data.firmas.push(img.getAttribute("src") || ""));
  return data;
}

function aplicar(data) {
  if (Array.isArray(data)) {
    document.querySelectorAll("#contenido-principal input:not([type=file]), #contenido-principal textarea").forEach((el, i) => el.value = data[i] || "");
    return;
  }
  document.querySelectorAll("#contenido-principal input:not([type=file]), #contenido-principal textarea").forEach((el, i) => el.value = (data.fields || [])[i] || "");
  document.querySelectorAll("#contenido-principal .sig-area img").forEach((img, i) => {
    const src = (data.firmas || [])[i] || "";
    const container = img.closest(".sig-area");
    const placeholder = container.querySelector(".sig-placeholder");
    if (src) {
      img.src = src;
      img.style.display = "block";
      if (placeholder) placeholder.style.display = "none";
    } else {
      img.removeAttribute("src");
      img.style.display = "none";
      if (placeholder) placeholder.style.display = "block";
    }
  });
}

async function guardarActa() {
  const cui = document.getElementById("cui-hidden").value;
  if (!cui) return;
  const data = recoger(cui);
  
  let actas = await localforage.getItem(DB_KEY) || [];
  const index = actas.findIndex(a => a.cui === cui);
  if (index >= 0) {
    actas[index] = data;
  } else {
    actas.push(data);
  }
  await localforage.setItem(DB_KEY, actas);
  
  if (typeof saveToFirebase === 'function') {
    saveToFirebase(`actas/${cui}`, data);
  }
  
  alert("Acta guardada exitosamente.");
  renderDashboard();
  showDashboard();
}

function limpiarCampos() {
  document.querySelectorAll("#contenido-principal input:not([type=file]), #contenido-principal textarea").forEach(el => el.value = "");
  document.querySelectorAll("#contenido-principal .sig-area img").forEach(img => {
    img.removeAttribute("src");
    img.style.display = "none";
  });
  document.querySelectorAll("#contenido-principal .sig-placeholder").forEach(el => el.style.display = "block");
  document.querySelectorAll('#contenido-principal input[type="file"]').forEach(el => el.value = "");
}

function limpiar() {
  if (!confirm("¿Limpiar todos los campos y firmas?")) return;
  limpiarCampos();
}

function editarActa(cui) {
  currentAction = { type: 'edit', cui: cui };
  document.getElementById("auth-pin").value = "";
  document.getElementById("modal-auth").style.display = "flex";
}

function eliminarActa(cui) {
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
    await procesarEdicion(currentAction.cui);
  } else if (currentAction && currentAction.type === 'delete') {
    await procesarEliminacion(currentAction.cui);
  }
  currentAction = null;
}

async function procesarEdicion(cui) {
  const actas = await localforage.getItem(DB_KEY) || [];
  const acta = actas.find(a => a.cui === cui);
  if (!acta) return alert("No se encontró el acta.");
  
  document.getElementById("cui-display").innerText = cui;
  document.getElementById("cui-hidden").value = cui;
  document.getElementById("editorTitle").innerText = "Editar Acta";
  limpiarCampos();
  aplicar(acta);
  showEditor();
}

async function procesarEliminacion(cui) {
  if (!confirm(`¿Está seguro de eliminar permanentemente el acta ${cui}?`)) return;
  let actas = await localforage.getItem(DB_KEY) || [];
  actas = actas.filter(a => a.cui !== cui);
  await localforage.setItem(DB_KEY, actas);
  alert("Acta eliminada.");
  renderDashboard();
}