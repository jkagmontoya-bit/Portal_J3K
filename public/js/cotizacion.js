[tag] || tag));
  }

  [tag] || tag));
  }

  let DB = [];
  let currentDoc = null;
  let itemCount = 0;
  
  // Quill Editors
  const quillConfig = { theme: 'snow', modules: { toolbar: [['bold', 'italic', 'underline'], [{ 'list': 'ordered'}, { 'list': 'bullet' }]] } };
  const edObjetivo = new Quill('#editor-objetivo', quillConfig);
  const edAlcances = new Quill('#editor-alcances', quillConfig);
  const edMetoIntro = new Quill('#editor-metodologia-intro', quillConfig);
  const edCondiciones = new Quill('#editor-condiciones', quillConfig);
  const edPagos = new Quill('#editor-pagos', quillConfig);
  const edBanco = new Quill('#editor-banco', quillConfig);

  const fileInput = document.getElementById('fileSustento');
  let currentSustento = null;

  const extFileInput = document.getElementById('extFile');
  let currentExtFile = null;

  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if(!file) { document.getElementById('btnIA').style.display = 'none'; return; }
    const reader = new FileReader();
    reader.onload = function(evt) {
      currentSustento = { name: file.name, dataUrl: evt.target.result };
      document.getElementById('lblSustentoFile').innerText = `Archivo cargado: ${file.name}`;
      if (file.type === "application/pdf") document.getElementById('btnIA').style.display = 'block';
    };
    reader.readAsDataURL(file);
  });

  async function initDB() {
    // localforage.config({ name: 'J3K_Cotizaciones' });
        let stored = await loadFromFirebase('cotizaciones');
    if (!stored) {
      stored = await localforage.getItem('cotizaciones_db'); // Fallback/Migrate
      if (stored) await saveToFirebase('cotizaciones', stored);
    }
    if(stored) DB = stored;
    
    // AutoClean Trash 7 days
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    let changed = false;
    DB = DB.filter(c => {
      if(c.deletedAt && (now - c.deletedAt > sevenDays)) { changed = true; return false; }
      return true;
    });
    if(changed) await saveToFirebase('cotizaciones', DB); await saveToFirebase('cotizaciones', DB); localforage.setItem('cotizaciones_db', DB); // Backup local

    
    extFileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if(!file) { document.getElementById('btnIAExt').style.display = 'none'; return; }
      const reader = new FileReader();
      reader.onload = function(evt) {
        currentExtFile = { name: file.name, dataUrl: evt.target.result };
        document.getElementById('extLblFile').innerText = `Archivo cargado: ${file.name}`;
        if (file.type === "application/pdf") document.getElementById('btnIAExt').style.display = 'block';
      };
      reader.readAsDataURL(file);
    });

    renderDashboard();
  }

  function switchTab(tabId) {
    document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tabId).classList.add('active');
  }


  let currentAuthAction = null;
  let currentAuthId = null;

  function configurarSeguridad() {
     const pin = prompt('Configura el PIN Maestro de Seguridad para Eliminaciones:', localStorage.getItem('J3K_MASTER_PIN') || '');
     if(pin !== null) {
        localStorage.setItem('J3K_MASTER_PIN', pin.trim());
        const nombre = prompt('Ingresa tu Firma/Nombre para la Bitácora:', localStorage.getItem('J3K_USER_NAME') || '');
        if(nombre !== null) localStorage.setItem('J3K_USER_NAME', nombre.trim());
        alert('Seguridad configurada con éxito.');
     }
  }

  function iniciarEliminacion(id) {
     if(!localStorage.getItem('J3K_MASTER_PIN')) {
        alert("Primero debes configurar el PIN Maestro de Seguridad en el botón 🔐 Seguridad.");
        return;
     }
     currentAuthAction = 'delete';
     currentAuthId = id;
     document.getElementById('auth-user').value = localStorage.getItem('J3K_USER_NAME') || '';
     document.getElementById('auth-pin').value = '';
     document.getElementById('modal-auth').style.display = 'flex';
  }

  function cerrarAuth() {
     document.getElementById('modal-auth').style.display = 'none';
  }

  async function confirmarAuth() {
     const user = document.getElementById('auth-user').value.trim();
     const pin = document.getElementById('auth-pin').value;
     if(!user || !pin) return alert("Completa todos los datos.");
     
     if(pin !== localStorage.getItem('J3K_MASTER_PIN')) {
        alert("❌ Clave incorrecta.");
        const cot = DB.find(c => c.id === currentAuthId);
        if(cot) {
           cot.historial = cot.historial || [];
           cot.historial.push({ user: user, action: 'Intento fallido de eliminación (PIN Incorrecto)', date: new Date().toLocaleString() });
           await saveToFirebase('cotizaciones', DB); await saveToFirebase('cotizaciones', DB); localforage.setItem('cotizaciones_db', DB); // Backup local
        }
        return;
     }

     localStorage.setItem('J3K_USER_NAME', user);

     if(currentAuthAction === 'delete') {
        const cot = DB.find(c => c.id === currentAuthId);
        if(cot) {
           cot.deletedAt = Date.now();
           cot.historial = cot.historial || [];
           cot.historial.push({ user: user, action: 'Enviado a papelera', date: new Date().toLocaleString() });
           await saveToFirebase('cotizaciones', DB); await saveToFirebase('cotizaciones', DB); localforage.setItem('cotizaciones_db', DB); // Backup local
           cerrarAuth();
           renderDashboard();
        }
     } else if(currentAuthAction === 'toggle-aprobacion') {
         const cot = DB.find(c => c.id === currentAuthId);
         if(cot) {
            const newState = (cot.estado === 'APROBADA') ? '' : 'APROBADA';
            cot.estado = newState;
            cot.historial = cot.historial || [];
            cot.historial.push({ user: document.getElementById('auth-user').value.trim(), action: newState ? 'Cotización Aprobada' : 'Aprobación Removida', date: new Date().toLocaleString() });
            await saveToFirebase('cotizaciones', DB); await saveToFirebase('cotizaciones', DB); localforage.setItem('cotizaciones_db', DB); // Backup local
            cerrarAuth();
            renderDashboard();
         }
     } else if(currentAuthAction === 'hard-delete') {
        DB = DB.filter(c => c.id !== currentAuthId);
        await saveToFirebase('cotizaciones', DB); await saveToFirebase('cotizaciones', DB); localforage.setItem('cotizaciones_db', DB); // Backup local
        cerrarAuth();
        verPapelera();
     }
  }

  function verPapelera() {
     document.getElementById('view-dashboard').classList.remove('active');
     document.getElementById('view-editor').classList.remove('active');
     document.getElementById('view-external').classList.remove('active');
     document.getElementById('view-trash').classList.add('active');

     const tbody = document.getElementById('tbodyTrash');
     tbody.innerHTML = '';
     DB.slice().reverse().filter(c => c.deletedAt).forEach(cot => {
        const tr = document.createElement('tr');
      const facturado = parseFloat(cot.montoFacturado) || 0;
      const total = parseFloat(cot.total) || 0;
      if (facturado > 0) {
         if (Math.abs(facturado - total) < 0.1) {
            tr.style.boxShadow = "0 0 15px 2px rgba(74, 222, 128, 0.6)";
            tr.style.outline = "2px solid #4ade80";
            tr.style.backgroundColor = "rgba(74, 222, 128, 0.1)";
         } else {
            tr.style.boxShadow = "0 0 15px 2px rgba(250, 204, 21, 0.6)";
            tr.style.outline = "2px solid #facc15";
            tr.style.backgroundColor = "rgba(250, 204, 21, 0.1)";
         }
      }
        const nombre = `${cot.empresa || cot.ruc || 'SIN NOMBRE'} - ${cot.proyecto ? cot.proyecto.substring(0,30) : ''}...`;
        const fechaDel = new Date(cot.deletedAt).toLocaleDateString();
        tr.innerHTML = `
          <td><span class="cui-badge" style="background:#f1f5f9; color:#64748B;">${cot.cui}</span></td>
          <td style="color:#64748B; font-weight:bold;">${nombre}</td>
          <td>${fechaDel}</td>
          <td>
            <button class="green" onclick="restaurar('${cot.id}')">Restaurar</button>
            <button class="danger" onclick="iniciarEliminacionDefinitiva('${cot.id}')">Eliminar</button>
          </td>
        `;
        tbody.appendChild(tr);
     });
  }

  async function restaurar(id) {
     const cot = DB.find(c => c.id === id);
     if(cot) {
        cot.deletedAt = null;
        cot.historial = cot.historial || [];
        const user = localStorage.getItem('J3K_USER_NAME') || 'Sistema';
        cot.historial.push({ user: user, action: 'Restaurado de papelera', date: new Date().toLocaleString() });
        await saveToFirebase('cotizaciones', DB); await saveToFirebase('cotizaciones', DB); localforage.setItem('cotizaciones_db', DB); // Backup local
        verPapelera();
     }
  }

  function iniciarEliminacionDefinitiva(id) {
     currentAuthAction = 'hard-delete';
     currentAuthId = id;
     document.getElementById('auth-user').value = localStorage.getItem('J3K_USER_NAME') || '';
     document.getElementById('auth-pin').value = '';
     document.getElementById('modal-auth').style.display = 'flex';
  }

  function verBitacora(id) {
     const cot = DB.find(c => c.id === id);
     if(!cot) return;
     document.getElementById('bitacora-cui').innerText = cot.cui;
     const list = document.getElementById('bitacora-list');
     list.innerHTML = '';
     const historial = cot.historial || [{ user: 'Sistema', action: 'Creación original (pre-auditoría)', date: cot.fecha || 'Desconocida' }];
     
     historial.slice().reverse().forEach(h => {
        const div = document.createElement('div');
        div.style.padding = '10px';
        div.style.background = '#f8fafc';
        div.style.borderLeft = '3px solid #0ea5e9';
        div.style.borderRadius = '4px';
        div.innerHTML = `<strong>${J3K_UTILS.escapeHTML(h.action)}</strong><br><span style="font-size:12px; color:#64748B;">Por: ${J3K_UTILS.escapeHTML(h.user)} | Fecha: ${J3K_UTILS.escapeHTML(h.date)}</span>`;
        list.appendChild(div);
     });
     document.getElementById('modal-bitacora').style.display = 'flex';
  }


  window.imprimirDesdeDashboard = function(id) {
    try {
      abrirEdicion(id);
      ejecutarImpresion();
      // Vuelve al dashboard inmediatamente, el dialogo de impresion pausa el navegador
      document.getElementById('view-editor').classList.remove('active');
      document.getElementById('view-dashboard').classList.add('active');
    } catch(e) {
      alert("Error al imprimir: " + e.message);
      console.error(e);
    }
  };

  window.toggleAprobar = async function(id) {
   if(!localStorage.getItem('J3K_MASTER_PIN')) {
      alert("Primero debes configurar el PIN Maestro de Seguridad en el botón 🔐 Seguridad.");
      return;
   }
   currentAuthAction = 'toggle-aprobacion';
   currentAuthId = id;
   document.getElementById('auth-user').value = localStorage.getItem('J3K_USER_NAME') || '';
   document.getElementById('auth-pin').value = '';
   document.getElementById('modal-auth').style.display = 'flex';
};

function renderDashboard() {
    const tbody = document.getElementById('dbTbody');
    tbody.innerHTML = '';
    if(DB.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay propuestas guardadas.</td></tr>';
      return;
    }

    const expedientesStateRaw = localStorage.getItem("j3k_modulo_expedientes_final_v1");
    let expedientesState = null;
    try { if (expedientesStateRaw) expedientesState = JSON.parse(expedientesStateRaw); } catch(e){}
    const facturasVentas = expedientesState?.saved?.ventas || [];

    DB.slice().reverse().filter(c => !c.deletedAt).forEach(cot => {
      const tr = document.createElement('tr');
      let facturasAsociadas = facturasVentas.filter(f => (f.general?.proyecto || '').includes(cot.cui) || f.cui === cot.cui);
      let facturasHtml = '';
      let totalFacturas = 0;
      if (facturasAsociadas.length > 0) {
        facturasHtml += `<ul style="margin:0; padding-left:15px; font-size:11px; text-align:left;">`;
        facturasAsociadas.forEach(f => {
           let doc = f.general?.expediente || f.general?.docTercero || f.cui || 'Factura';
           let monto = parseFloat(f.general?.monto) || 0;
           totalFacturas += monto;
           facturasHtml += `<li><b>${doc}</b>: S/ ${J3K_UTILS.formatMoney(monto)}</li>`;
        });
        facturasHtml += `</ul><div style="font-size:11px; margin-top:3px; color:#475569; text-align:left;"><b>Total Fac: S/ ${J3K_UTILS.formatMoney(totalFacturas)}</b></div>`;
      } else {
        facturasHtml = '<span style="color:#94a3b8; font-size:12px;">Sin facturas</span>';
      }

      const facturado = totalFacturas > 0 ? totalFacturas : (parseFloat(cot.montoFacturado) || 0);
      const total = parseFloat(cot.total) || 0;
      if (facturado > 0) {
         if (Math.abs(facturado - total) < 0.1) {
            tr.style.boxShadow = "0 0 15px 2px rgba(74, 222, 128, 0.6)";
            tr.style.outline = "2px solid #4ade80";
            tr.style.backgroundColor = "rgba(74, 222, 128, 0.1)";
         } else {
            tr.style.boxShadow = "0 0 15px 2px rgba(250, 204, 21, 0.6)";
            tr.style.outline = "2px solid #facc15";
            tr.style.backgroundColor = "rgba(250, 204, 21, 0.1)";
         }
      }
      const nombre = `${cot.empresa || cot.ruc || 'SIN NOMBRE'} - ${cot.proyecto ? cot.proyecto.substring(0,30) : ''}...`;
      const sustentoBtn = cot.sustento ? `<button class="alt" onclick="descargarSustento('${cot.id}')">📎 PDF</button>` : '';
      const externaTag = cot.isExternal ? `<span class="badge" style="background:#fef08a; color:#854d0e; margin-right:5px;">[EXTERNA]</span>` : '';
      const tipoTag = (!cot.isExternal && cot.tipoCotizacion === 'simple') ? `<span class="badge" style="background:#bae6fd; color:#0369a1; margin-right:5px;">[SIMPLE]</span>` : 
                      (!cot.isExternal) ? `<span class="badge" style="background:#dcfce7; color:#166534; margin-right:5px;">[EXTENDIDA]</span>` : '';
      const aprobarBtn = `<button class="${cot.estado === 'APROBADA' ? 'alt' : ''}" style="${cot.estado === 'APROBADA' ? 'background:#10b981; color:white; border-color:#10b981; margin-right:4px;' : 'background:#f8fafc; color:#10b981; border-color:#10b981; margin-right:4px;'}" onclick="toggleAprobar('${cot.id}')">${cot.estado === 'APROBADA' ? '✔ Aprobada' : 'Aprobar'}</button>`;
      const editBtn = cot.isExternal ? '' : `<button onclick="abrirEdicion('${cot.id}')">Editar</button>`;
      const printBtn = cot.isExternal ? '' : `<button class="alt" style="background:#0f172a; color:white; border-color:#0f172a;" onclick="imprimirDesdeDashboard('${cot.id}')">🖨️ Imprimir</button>`;
      const tooltip = cot.isExternal ? 'Descargar PDF subido' : 'Descargar Sustento (TDR/Correo)';
      const sustentoBtnHtml = cot.sustento ? `<button class="alt" onclick="descargarSustento('${cot.id}')" title="${tooltip}">📎 ${cot.isExternal ? 'PDF' : 'Sustento'}</button>` : '';

      tr.innerHTML = `
        <td>
          <span class="cui-badge">${cot.cui}</span>
          <button class="alt" onclick="verBitacora('${cot.id}')" title="Ver Historial" style="padding:2px 6px; font-size:11px; margin-left:4px; border:none; background:transparent;">🕒</button>
        </td>
        <td style="font-weight:bold;">${externaTag}${tipoTag}${nombre}</td>
        <td>${cot.fecha}</td>
        <td>S/ ${J3K_UTILS.formatMoney(cot.total)}</td>
        <td>${facturasHtml}</td>
        <td>
          ${aprobarBtn}
          ${editBtn}
          ${printBtn}
          ${sustentoBtnHtml}
          <button class="danger" onclick="iniciarEliminacion('${cot.id}')">X</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function generarNuevoCUI() {
    const date = new Date();
    const mapMes = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    const anio = date.getFullYear();
    const mes = mapMes[date.getMonth()];
    const prefix = `COTIZACIÓN J3K: N° -${anio}-Rev01`; // Formato del PDF N° 22-2026-Rev01
    
    let maxCorr = 0;
    DB.forEach(c => {
      if(c.cui && c.cui.includes(`-${anio}-Rev`)) {
        const parts = c.cui.match(/N° (\d+)-/);
        if(parts && parts[1]) {
          const num = parseInt(parts[1]);
          if(num > maxCorr) maxCorr = num;
        }
      }
    });
    let nextNum = maxCorr + 1;
    let padded = String(nextNum).padStart(2, '0');
    return `COTIZACIÓN J3K: N° ${padded}-${anio}-Rev01`;
  }

  function setDefaultQuillText() {
    edObjetivo.root.innerHTML = window.J3K_CONFIG.defaultObjetivo;
    edAlcances.root.innerHTML = window.J3K_CONFIG.defaultAlcances;
    edMetoIntro.root.innerHTML = window.J3K_CONFIG.defaultMetoIntro;
    edCondiciones.root.innerHTML = window.J3K_CONFIG.defaultCondiciones;
    edPagos.root.innerHTML = window.J3K_CONFIG.defaultPagos;
    edBanco.root.innerHTML = window.J3K_CONFIG.getBancoHTML();
  }

  function nuevaCotizacion() {
    document.getElementById('modalTypeSelect').style.display = 'flex';
  }

  function iniciarCotizacion(tipo) {
    document.getElementById('modalTypeSelect').style.display = 'none';
    currentDoc = { id: Date.now().toString(), tipo: tipo };
    document.getElementById('editorTitle').innerText = 'Crear Nueva Propuesta';
    
    document.getElementById('cui').value = generarNuevoCUI();
    document.getElementById('cot_id').value = currentDoc.id;
    const date = new Date();
    const mapMesInv = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    document.getElementById('fecha').value = `Lima, ${date.getDate()} de ${mapMesInv[date.getMonth()]} de ${date.getFullYear()}`;

    ['ruc','proyecto','empresa','ubicacion'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('aplicaIGV').value = 'si';
    currentSustento = null;
    fileInput.value = '';
    document.getElementById('lblSustentoFile').innerText = '';

    document.getElementById('tbodyItems').innerHTML = '';
    itemCount = 0;
    agregarFila(); // Una fila por defecto
    
    document.getElementById('tbodyMetodologia').innerHTML = '';
    document.getElementById('tbodyEquipo').innerHTML = '';
    document.getElementById('tbodySoftware').innerHTML = '';
    setDefaultQuillText();

    document.getElementById('view-dashboard').classList.remove('active');
    document.getElementById('view-external').classList.remove('active');
    document.getElementById('view-editor').classList.add('active');
    
    toggleUITabs(tipo === 'simple');
    switchTab('tab-general');
  }

  function nuevaExterna() {
    currentDoc = { id: Date.now().toString() };
    document.getElementById('extCui').value = generarNuevoCUI();
    const date = new Date();
    const mapMesInv = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    document.getElementById('extFecha').value = `Lima, ${date.getDate()} de ${mapMesInv[date.getMonth()]} de ${date.getFullYear()}`;
    document.getElementById('extEmpresa').value = '';
    document.getElementById('extProyecto').value = '';
    document.getElementById('extTotal').value = '0.00';
    extFileInput.value = '';
    currentExtFile = null;
    document.getElementById('extLblFile').innerText = '';

    document.getElementById('view-dashboard').classList.remove('active');
    document.getElementById('view-editor').classList.remove('active');
    document.getElementById('view-external').classList.add('active');
  }

  async function guardarExterna() {
    const cui = document.getElementById('extCui').value.trim();
    if(!cui) { alert("El CUI es obligatorio."); return; }
    
    const data = {
      id: currentDoc.id,
      cui: cui,
      fecha: document.getElementById('extFecha').value,
      empresa: document.getElementById('extEmpresa').value,
      proyecto: document.getElementById('extProyecto').value,
      total: parseFloat(document.getElementById('extTotal').value) || 0,
      sustento: currentExtFile,
      isExternal: true,
      historial: [{ user: localStorage.getItem('J3K_USER_NAME') || 'Sistema', action: 'Registro externo inicial', date: new Date().toLocaleString() }]
    };

    DB.push(data);
    await saveToFirebase('cotizaciones', DB); await saveToFirebase('cotizaciones', DB); localforage.setItem('cotizaciones_db', DB); // Backup local
    renderDashboard();
    showDashboard();
  }


  function toggleUITabs(simple) {
    const tabs = document.querySelectorAll('.editor-tab');
    if(tabs.length >= 4) {
      tabs[1].style.display = simple ? 'none' : 'block';
      tabs[2].style.display = simple ? 'none' : 'block';
      tabs[3].style.display = simple ? 'none' : 'block';
    }
  }

  function aplicarTipoUI(tipo) {
    toggleUITabs(tipo === 'simple');
  }

  function abrirEdicion(id) {
    const cot = DB.find(c => c.id === id);
    if(!cot) return;
    currentDoc = cot;
    document.getElementById('editorTitle').innerText = `Editando Propuesta: ${cot.cui}`;
    document.getElementById('cot_id').value = cot.id;
    document.getElementById('cui').value = cot.cui;
    
    ['fecha','ruc','proyecto','empresa','ubicacion','aplicaIGV'].forEach(id => {
      if(document.getElementById(id)) document.getElementById(id).value = cot[id] || '';
    });

    currentSustento = cot.sustento || null;
    fileInput.value = '';
    document.getElementById('lblSustentoFile').innerText = currentSustento ? `Archivo cargado: ${currentSustento.name}` : '';

    // Items
    document.getElementById('tbodyItems').innerHTML = '';
    itemCount = 0;
    if(cot.items && cot.items.length > 0) {
      cot.items.forEach(it => agregarFila(it.desc, it.cant, it.und, it.precio, it.isSub));
    } else agregarFila();

    // Tables
    document.getElementById('tbodyMetodologia').innerHTML = '';
    if(cot.metodologias) cot.metodologias.forEach(m => agregarFilaMetodologia(m.etapa, m.desc));
    
    document.getElementById('tbodyEquipo').innerHTML = '';
    if(cot.equipos) cot.equipos.forEach(m => agregarFilaEquipo(m.cargo, m.cant, m.funcion));
    
    document.getElementById('tbodySoftware').innerHTML = '';
    if(cot.softwares) cot.softwares.forEach(m => agregarFilaSoftware(m.sw, m.ver, m.app));

    // Quill
    edObjetivo.root.innerHTML = cot.objetivo || '';
    edAlcances.root.innerHTML = cot.alcances || '';
    edMetoIntro.root.innerHTML = cot.metoIntro || '';
    edCondiciones.root.innerHTML = cot.condiciones || '';
    edPagos.root.innerHTML = cot.pagos || '';
    edBanco.root.innerHTML = cot.banco || '';
    
    // Load Simple Fields
    const el_contacto = document.getElementById('simp-contacto');
    if(el_contacto) el_contacto.value = cot.simpContacto || '';
    const el_telefono = document.getElementById('simp-telefono');
    if(el_telefono) el_telefono.value = cot.simpTelefono || '';
    const el_email = document.getElementById('simp-email');
    if(el_email) el_email.value = cot.simpEmail || '';
    const el_referencia = document.getElementById('simp-referencia');
    if(el_referencia) el_referencia.value = cot.simpReferencia || '';
    const el_moneda = document.getElementById('simp-moneda');
    if(el_moneda) el_moneda.value = cot.simpMoneda || 'Nuevos Soles';
    const el_entrega = document.getElementById('simp-entrega');
    if(el_entrega) el_entrega.value = cot.simpEntrega || 'Según pedido';
    const el_pago = document.getElementById('simp-pago');
    if(el_pago) el_pago.value = cot.simpPago || '';
    const el_validez = document.getElementById('simp-validez');
    if(el_validez) el_validez.value = cot.simpValidez || '07 días';
    const el_contactarse = document.getElementById('simp-contactarse');
    if(el_contactarse) el_contactarse.value = cot.simpContactarse || 'Diaz Varas, Kendy Eduardo';
    const el_obs = document.getElementById('simp-obs');
    if(el_obs) el_obs.value = cot.simpObs || '';

    currentDoc.tipoCotizacion = cot.tipoCotizacion || 'extendida';
    aplicarTipoUI(currentDoc.tipoCotizacion);

    document.getElementById('view-dashboard').classList.remove('active');
    document.getElementById('view-external').classList.remove('active');
    document.getElementById('view-editor').classList.add('active');
    switchTab('tab-general');
  }

  function showDashboard() {
    document.getElementById('view-editor').classList.remove('active');
    document.getElementById('view-external').classList.remove('active');
    document.getElementById('view-trash').classList.remove('active');
    document.getElementById('view-dashboard').classList.add('active');
  }

  async function guardarCotizacion() {
    let cuiFinal = document.getElementById('cui').value;
    const isNew = !DB.find(c => c.id === currentDoc.id);

    const items = [];
    let subtotal = 0;
    for (let tr of document.getElementById('tbodyItems').rows) {
      const isSub = tr.querySelector('.chk-sub').checked;
      const desc = tr.querySelector('.item-desc').value;
      const cant = parseFloat(tr.querySelector('.item-cant').value) || 0;
      const und = tr.querySelector('.item-und').value;
      const precio = parseFloat(tr.querySelector('.item-precio').value) || 0;
      items.push({ desc, cant, und, precio, isSub });
      if(!isSub && cant > 0) subtotal += (cant * precio);
      else if(!isSub && cant === 0) subtotal += precio; // Si no hay cantidad, suma directo el parcial
      else if(isSub) subtotal += precio; // los sub-items suman directo al total general (ajuste segun pdf)
    }
    
    const aplicaIGV = document.getElementById('aplicaIGV').value === 'si';
    const igv = aplicaIGV ? subtotal * 0.18 : 0;

    const data = {
      id: currentDoc.id, cui: cuiFinal, total: subtotal + igv, sustento: currentSustento,
      fecha: document.getElementById('fecha').value,
      ruc: document.getElementById('ruc').value,
      proyecto: document.getElementById('proyecto').value,
      empresa: document.getElementById('empresa').value,
      ubicacion: document.getElementById('ubicacion').value,
      aplicaIGV: document.getElementById('aplicaIGV').value,
      items: items,
      metodologias: Array.from(document.getElementById('tbodyMetodologia').rows).map(tr => ({etapa: tr.cells[0].children[0].value, desc: tr.cells[1].children[0].value})),
      equipos: Array.from(document.getElementById('tbodyEquipo').rows).map(tr => ({cargo: tr.cells[0].children[0].value, cant: tr.cells[1].children[0].value, funcion: tr.cells[2].children[0].value})),
      softwares: Array.from(document.getElementById('tbodySoftware').rows).map(tr => ({sw: tr.cells[0].children[0].value, ver: tr.cells[1].children[0].value, app: tr.cells[2].children[0].value})),
      objetivo: edObjetivo.root.innerHTML,
      alcances: edAlcances.root.innerHTML,
      metoIntro: edMetoIntro.root.innerHTML,
      condiciones: edCondiciones.root.innerHTML,
      pagos: edPagos.root.innerHTML,
      banco: edBanco.root.innerHTML,
      tipoCotizacion: currentDoc.tipoCotizacion || 'extendida',
      simpContacto: document.getElementById('simp-contacto') ? document.getElementById('simp-contacto').value : '',
      simpTelefono: document.getElementById('simp-telefono') ? document.getElementById('simp-telefono').value : '',
      simpEmail: document.getElementById('simp-email') ? document.getElementById('simp-email').value : '',
      simpReferencia: document.getElementById('simp-referencia') ? document.getElementById('simp-referencia').value : '',
      simpMoneda: document.getElementById('simp-moneda') ? document.getElementById('simp-moneda').value : '',
      simpEntrega: document.getElementById('simp-entrega') ? document.getElementById('simp-entrega').value : '',
      simpPago: document.getElementById('simp-pago') ? document.getElementById('simp-pago').value : '',
      simpValidez: document.getElementById('simp-validez') ? document.getElementById('simp-validez').value : '',
      simpContactarse: document.getElementById('simp-contactarse') ? document.getElementById('simp-contactarse').value : '',
      simpObs: document.getElementById('simp-obs') ? document.getElementById('simp-obs').value : ''
    };
    
    data.historial = currentDoc.historial || [];
    const actionName = (!isNew) ? 'Modificó la propuesta' : 'Creación inicial';
    data.historial.push({ user: localStorage.getItem('J3K_USER_NAME') || 'Sistema', action: actionName, date: new Date().toLocaleString() });

    if(isNew) DB.push(data);
    else DB[DB.findIndex(c => c.id === currentDoc.id)] = data;

    await saveToFirebase('cotizaciones', DB); await saveToFirebase('cotizaciones', DB); localforage.setItem('cotizaciones_db', DB); // Backup local
    renderDashboard();
    showDashboard();
  }

  async function guardarYGenerarPDF() {
    await guardarCotizacion();
    abrirEdicion(currentDoc.id);
    ejecutarImpresion();
  }

  function ejecutarImpresion() {
    document.getElementById('pFechaCabecera').innerText = document.getElementById('fecha').value;
    document.getElementById('pFecha').innerText = document.getElementById('fecha').value;
    document.getElementById('pCUI').innerText = document.getElementById('cui').value;
    document.getElementById('pEmpresaCabecera').innerText = document.getElementById('empresa').value;
    document.getElementById('pEmpresa').innerText = document.getElementById('empresa').value;
    document.getElementById('pProyecto').innerText = document.getElementById('proyecto').value;
    document.getElementById('pUbicacion').innerText = document.getElementById('ubicacion').value;
    document.getElementById('pIgvPercent').innerText = document.getElementById('aplicaIGV').value === 'si' ? '18%' : '0%';

    // Items
    const pTbody = document.getElementById('pTableBody');
    pTbody.innerHTML = ''; 
    let mainIdx = 1;
    let subIdxMap = ["a","b","c","d","e","f","g"];
    let subCounter = 0;

    for (let tr of document.getElementById('tbodyItems').rows) {
      const isSub = tr.querySelector('.chk-sub').checked;
      const desc = tr.querySelector('.item-desc').value.replace(/\n/g, '<br>');
      const cant = parseFloat(tr.querySelector('.item-cant').value) || 0;
      const precioStr = J3K_UTILS.formatSoles(tr.querySelector('.item-precio').value);

      if(!isSub) {
        pTbody.innerHTML += `<tr>
          <td style="font-weight:bold;">${mainIdx}. ${desc}</td>
          <td style="text-align:center;">${precioStr}</td>
        </tr>`;
        mainIdx++;
        subCounter = 0;
      } else {
        pTbody.innerHTML += `<tr>
          <td style="font-style:italic; padding-left:25px; color:#475569;">${subIdxMap[subCounter]}. ${desc}</td>
          <td style="text-align:center; font-style:italic; color:#475569;">${precioStr}</td>
        </tr>`;
        subCounter++;
      }
    }

    document.getElementById('pSubtotal').innerText = J3K_UTILS.formatSoles(document.getElementById('lblSubtotal').innerText.replace(/,/g, ''));
    document.getElementById('pIgv').innerText = J3K_UTILS.formatSoles(document.getElementById('lblIgv').innerText.replace(/,/g, ''));
    document.getElementById('pTotal').innerText = J3K_UTILS.formatSoles(document.getElementById('lblTotal').innerText.replace(/,/g, ''));

    // Quill contents
    document.getElementById('pObjetivo').innerHTML = edObjetivo.root.innerHTML;
    document.getElementById('pAlcances').innerHTML = edAlcances.root.innerHTML;
    document.getElementById('pMetodologiaIntro').innerHTML = edMetoIntro.root.innerHTML;
    document.getElementById('pCondiciones').innerHTML = edCondiciones.root.innerHTML;
    document.getElementById('pPagos').innerHTML = edPagos.root.innerHTML;
    document.getElementById('pBanco').innerHTML = edBanco.root.innerHTML;

    const isSimple = (currentDoc.tipo === 'simple');
    document.getElementById('secObjetivo').style.display = isSimple ? 'none' : 'block';
    document.getElementById('secAlcances').style.display = isSimple ? 'none' : 'block';
    document.getElementById('secMetodologia').style.display = isSimple ? 'none' : 'block';
    document.getElementById('secEquipo').style.display = isSimple ? 'none' : 'block';
    document.getElementById('secSoftware').style.display = isSimple ? 'none' : 'block';
    document.getElementById('secCondiciones').style.display = isSimple ? 'none' : 'block';

    // Dynamic Tables
    const fillPrintTable = (idHtml, idPrint) => {
      const tb = document.querySelector(`#${idPrint} tbody`); tb.innerHTML = '';
      Array.from(document.getElementById(idHtml).rows).forEach(tr => {
        let html = '<tr>';
        for(let i=0; i<tr.cells.length-1; i++) html += `<td>${tr.cells[i].children[0].value.replace(/\n/g, '<br>')}</td>`;
        html += '</tr>'; tb.innerHTML += html;
      });
      document.getElementById(idPrint).style.display = tb.innerHTML ? 'table' : 'none';
    };

    fillPrintTable('tbodyMetodologia', 'pTablaMetodologia');
    fillPrintTable('tbodyEquipo', 'pTablaEquipo');
    fillPrintTable('tbodySoftware', 'pTablaSoftware');

    window.print();
  }

  function eliminar(id) {
    if(confirm('¿Estás seguro de eliminar esta propuesta?')) {
      DB = DB.filter(c => c.id !== id);
      saveToFirebase('cotizaciones', DB); localforage.setItem('cotizaciones_db', DB);
      renderDashboard();
    }
  }

  window.descargarSustento = function(id) {
    try {
      const cot = DB.find(c => c.id === id);
      if(cot && cot.sustento && cot.sustento.dataUrl) {
        const a = document.createElement('a'); 
        a.href = cot.sustento.dataUrl; 
        a.download = cot.sustento.name || 'Sustento.pdf'; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert("No hay archivo adjunto.");
      }
    } catch(e) {
      alert("Error al descargar: " + e.message);
      console.error(e);
    }
  };

  // --- TABLAS DINAMICAS LOGIC ---
  ); }
  

  function agregarFila(desc = "", cant = 0, und = "glb", precio = 0, isSub = false) {
    itemCount++;
    const tbody = document.getElementById('tbodyItems');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="center"><label style="font-size:9px;"><input type="checkbox" class="chk-sub" onchange="toggleSub(this)" ${isSub?'checked':''}> Es Sub-item</label></td>
      <td><textarea class="item-desc ${isSub?'subitem-desc':''}" rows="2" placeholder="Descripción...">${J3K_UTILS.escapeHTML(desc)}</textarea></td>
      <td class="center"><input type="number" class="item-cant" value="${J3K_UTILS.escapeHTML(cant)}" min="0" step="0.01" onchange="calcularTotales()"></td>
      <td class="center"><input type="text" class="item-und" value="${J3K_UTILS.escapeHTML(und)}" style="text-align:center;"></td>
      <td class="right"><input type="number" class="item-precio" value="${J3K_UTILS.escapeHTML(precio)}" min="0" step="0.01" onchange="calcularTotales()"></td>
      <td class="right item-total" style="font-weight:bold;">0.00</td>
      <td class="center"><button class="action-btn danger" onclick="this.closest('tr').remove(); calcularTotales();">X</button></td>
    `;
    if(isSub) tr.classList.add('subitem-row');
    tbody.appendChild(tr);
    calcularTotales();
  }

  function toggleSub(chk) {
    const tr = chk.closest('tr');
    if(chk.checked) { tr.classList.add('subitem-row'); tr.querySelector('.item-desc').classList.add('subitem-desc'); }
    else { tr.classList.remove('subitem-row'); tr.querySelector('.item-desc').classList.remove('subitem-desc'); }
    calcularTotales();
  }

  function calcularTotales() {
    let subtotal = 0;
    for (let tr of document.getElementById('tbodyItems').rows) {
      const isSub = tr.querySelector('.chk-sub').checked;
      const cant = parseFloat(tr.querySelector('.item-cant').value) || 0;
      const precio = parseFloat(tr.querySelector('.item-precio').value) || 0;
      let totalLinea = precio;
      if(!isSub && cant > 0) totalLinea = cant * precio;
      tr.querySelector('.item-total').innerText = J3K_UTILS.formatMoney(totalLinea);
      subtotal += totalLinea; // Ambos suman al total (en este modelo PDF)
    }
    const igv = document.getElementById('aplicaIGV').value === 'si' ? (subtotal * 0.18) : 0;
    document.getElementById('lblSubtotal').innerText = J3K_UTILS.formatMoney(subtotal);
    document.getElementById('lblIgv').innerText = J3K_UTILS.formatMoney(igv);
    document.getElementById('lblTotal').innerText = J3K_UTILS.formatMoney(subtotal + igv);
  }

  function agregarFilaMetodologia(etapa="", desc="") {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><input type="text" value="${J3K_UTILS.escapeHTML(etapa)}"></td><td><textarea rows="2">${J3K_UTILS.escapeHTML(desc)}</textarea></td><td class="center"><button class="action-btn danger" onclick="this.closest('tr').remove()">X</button></td>`;
    document.getElementById('tbodyMetodologia').appendChild(tr);
  }
  function agregarFilaEquipo(cargo="", cant="1", funcion="") {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><input type="text" value="${J3K_UTILS.escapeHTML(cargo)}"></td><td><input type="number" value="${J3K_UTILS.escapeHTML(cant)}" class="center"></td><td><input type="text" value="${J3K_UTILS.escapeHTML(funcion)}"></td><td class="center"><button class="action-btn danger" onclick="this.closest('tr').remove()">X</button></td>`;
    document.getElementById('tbodyEquipo').appendChild(tr);
  }
  function agregarFilaSoftware(sw="", ver="2026", app="") {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><input type="text" value="${J3K_UTILS.escapeHTML(sw)}"></td><td><input type="text" value="${J3K_UTILS.escapeHTML(ver)}" class="center"></td><td><input type="text" value="${J3K_UTILS.escapeHTML(app)}"></td><td class="center"><button class="action-btn danger" onclick="this.closest('tr').remove()">X</button></td>`;
    document.getElementById('tbodySoftware').appendChild(tr);
  }

  // --- AI LOGIC ---
  function configurarIA() {
    const currentKey = localStorage.getItem('GEMINI_API_KEY') || '';
    const newKey = prompt('⚙️ Configuración de IA - Google Gemini\\n\\nIngresa tu API Key para habilitar el autocompletado automático.\\nEsta llave se guardará de forma segura SOLO en tu navegador.', currentKey);
    if(newKey !== null) { localStorage.setItem('GEMINI_API_KEY', newKey.trim()); alert('¡Llave guardada con éxito!'); }
  }
  async function autocompletarConIA() {
    const apiKey = localStorage.getItem('GEMINI_API_KEY');
    if(!apiKey) { alert("⚠️ Configura tu API Key primero."); return; }
    if(!currentSustento || !currentSustento.dataUrl) { alert("Sube un PDF primero."); return; }
    const btn = document.getElementById('btnIA'); const status = document.getElementById('aiStatus'); btn.disabled = true;
    try {
      status.innerText = "✨ Procesando documento con IA... (puede tardar unos segundos)";
      const base64 = currentSustento.dataUrl.split(',')[1];
      
      const prompt = `Eres un asistente de ventas de J3K. Analiza el documento adjunto (puede ser un TDR, correo, solicitud) y extrae la siguiente información. 
Devuelve la respuesta ESTRICTAMENTE en este formato JSON, sin texto adicional:
{"ruc": "","empresa": "","proyecto": "","ubicacion": "","items": [{"desc": "","cant": "","und": ""}]}
Si no encuentras un dato, déjalo vacío (""). Para "items", extrae los servicios o productos solicitados.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contents: [{ 
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "application/pdf", data: base64 } }
            ] 
          }], 
          generationConfig: { temperature: 0.1 } 
        })
      });
      
      if (!response.ok) {
        throw new Error("Error en la API. Verifica tu API Key o el tamaño del PDF.");
      }

      const rawData = await response.json();
      let resultText = rawData.candidates[0].content.parts[0].text.replace(/^```json/gm, "").replace(/^```/gm, "").trim();
      let result = JSON.parse(resultText);
      
      if(result.ruc) document.getElementById('ruc').value = result.ruc;
      if(result.empresa) document.getElementById('empresa').value = result.empresa;
      if(result.proyecto) document.getElementById('proyecto').value = result.proyecto;
      if(result.ubicacion) document.getElementById('ubicacion').value = result.ubicacion;
      if(result.items && result.items.length > 0) {
        document.getElementById('tbodyItems').innerHTML = '';
        result.items.forEach(it => agregarFila(it.desc, parseFloat(it.cant)||1, it.und||'und.', 0));
      }
      status.innerText = "🎉 Autocompletado!"; setTimeout(() => { status.innerText = ""; alert("Cotización autocompletada por IA.\\n\\nRecuerda revisar las descripciones y cantidades.\\n¿Será este el precio final a enviar al cliente?"); }, 800);
    } catch(err) { 
      console.error(err);
      status.innerText = "❌ Error: " + err.message; 
    } finally { 
      btn.disabled = false; 
    }
  }


  async function autocompletarExternaConIA() {
    const apiKey = localStorage.getItem('GEMINI_API_KEY');
    if(!apiKey) { alert("⚠️ Configura tu API Key primero."); return; }
    if(!currentExtFile || !currentExtFile.dataUrl) { alert("Sube un PDF primero."); return; }
    const btn = document.getElementById('btnIAExt'); const status = document.getElementById('aiStatusExt'); btn.disabled = true;
    try {
      status.innerText = "✨ Procesando documento con IA... (puede tardar unos segundos)";
      const base64 = currentExtFile.dataUrl.split(',')[1];
      
      const prompt = `Eres un asistente de ventas de J3K. Analiza el documento adjunto (Cotización o Propuesta enviada al cliente) y extrae la siguiente información. 
Devuelve la respuesta ESTRICTAMENTE en este formato JSON, sin texto adicional:
{"empresa": "","proyecto": "","total": ""}
Si no encuentras un dato, déjalo vacío (""). Para "total", extrae SOLO EL NÚMERO (sin S/ ni comas, usa punto para decimal) del MONTO TOTAL SIN IGV (SUBTOTAL) si es posible, o el monto total de la propuesta.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contents: [{ 
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "application/pdf", data: base64 } }
            ] 
          }], 
          generationConfig: { temperature: 0.1 } 
        })
      });
      
      if (!response.ok) {
        throw new Error("Error en la API. Verifica tu API Key o el tamaño del PDF.");
      }

      const rawData = await response.json();
      let resultText = rawData.candidates[0].content.parts[0].text.replace(/^```json/gm, "").replace(/^```/gm, "").trim();
      let result = JSON.parse(resultText);
      
      if(result.empresa) document.getElementById('extEmpresa').value = result.empresa;
      if(result.proyecto) document.getElementById('extProyecto').value = result.proyecto;
      if(result.total) document.getElementById('extTotal').value = parseFloat(result.total) || 0;
      
      status.innerText = "🎉 Autocompletado!"; setTimeout(() => { status.innerText = ""; alert("Cotización autocompletada por IA.\n\nRecuerda revisar los datos extraídos."); }, 800);
    } catch(err) { 
      console.error(err);
      status.innerText = "❌ Error: " + err.message; 
    } finally { 
      btn.disabled = false; 
    }
  }

  initDB();