const CONFIG = {"company": "J3K INGENIERÍA & DISEÑO S.A.C.", "ruc": "20612829561", "source": "matriz_editable_flujograma_J3K.xlsx", "processes": {"compras": {"key": "compras", "sourceName": "Compras", "label": "Compras", "icon": "🛒", "color": "green", "folder": "COMPRAS", "steps": [{"order": 1, "name": "Identificación de necesidad", "description": "Área solicita bien o servicio", "requiredDoc": "Requerimiento interno / correo / solicitud", "required": true, "responsible": "Área usuaria", "controlNote": "Sustenta causalidad del gasto", "action": ""}, {"order": 2, "name": "Cotización y evaluación", "description": "Se evalúan proveedores", "requiredDoc": "Cotizaciones / comparativo / evaluación", "required": true, "responsible": "Administración", "controlNote": "Ayuda a probar valor de mercado", "action": ""}, {"order": 3, "name": "Orden de compra / servicio", "description": "Se emite OC u OS", "requiredDoc": "OC / OS aprobada", "required": true, "responsible": "Administración", "controlNote": "Debe estar antes de la factura", "action": ""}, {"order": 4, "name": "Recepción / conformidad", "description": "Se recibe bien o servicio", "requiredDoc": "Guía / acta / conformidad / fotos", "required": true, "responsible": "Solicitante", "controlNote": "Sustenta fehaciencia", "action": ""}, {"order": 5, "name": "Factura del proveedor", "description": "Se valida comprobante", "requiredDoc": "Factura electrónica / XML / CDR", "required": true, "responsible": "Contabilidad", "controlNote": "Validar RUC, fecha, descripción", "action": ""}, {"order": 6, "name": "Registro contable", "description": "Se registra la compra", "requiredDoc": "Asiento / registro de compras", "required": true, "responsible": "Contabilidad", "controlNote": "Sustento contable", "action": ""}, {"order": 7, "name": "Pago al proveedor", "description": "Se paga por banco si corresponde", "requiredDoc": "Voucher bancario / detracción si aplica", "required": true, "responsible": "Tesorería", "controlNote": "Control de bancarización", "action": ""}, {"order": 8, "name": "Archivo documental", "description": "Se cierra expediente", "requiredDoc": "Índice del expediente", "required": true, "responsible": "Administración", "controlNote": "Carpeta completa", "action": ""}], "rules": [{"rule": "ZIP habilitado", "condition": "Todos los pasos obligatorios completos", "action": "Permite descargar ZIP", "note": ""}, {"rule": "Pago bancario", "condition": "Monto mayor o igual a S/ 2,000", "action": "Pedir voucher bancario", "note": "También considerar US$ 500."}, {"rule": "Detracción", "condition": "Si operación está sujeta", "action": "Pedir constancia de detracción", "note": ""}], "keyDocs": "Requerimiento interno / correo / solicitud; Cotizaciones / comparativo / evaluación; OC / OS aprobada; Guía / acta / conformidad / fotos; Factura electrónica / XML / CDR; Asiento / registro de compras; Voucher bancario / detracción si aplica; Índice del expediente"}, "ventas": {"key": "ventas", "sourceName": "Ventas", "label": "Ventas", "icon": "💵", "color": "blue", "folder": "VENTAS", "steps": [{"order": 1, "name": "FACTURA VENTA - FOMATO DE FACTURA xxxx-xxxxxxxx", "description": "Se sube la factura de venta y se da la cotización vinculada", "requiredDoc": "Factura y selección de cotización", "required": true, "responsible": "Administración / Comercial", "controlNote": "Prueba origen de la operación", "action": ""}, {"order": 2, "name": "Ejecución del servicio", "description": "Se realiza el trabajo", "requiredDoc": "Avances / fotos / planos / reportes", "required": true, "responsible": "Área técnica", "controlNote": "Prueba ejecución real", "action": ""}, {"order": 3, "name": "Entrega y conformidad", "description": "Cliente acepta entregable", "requiredDoc": "Acta / correo de conformidad", "required": true, "responsible": "Área técnica / Gerencia", "controlNote": "Clave para cobrar y facturar", "action": ""}, {"order": 4, "name": "Cobranza", "description": "Cliente paga", "requiredDoc": "Voucher / estado de cuenta", "required": true, "responsible": "Tesorería", "controlNote": "Control de cuentas por cobrar", "action": ""}], "rules": [{"rule": "Facturación", "condition": "Cliente aprueba o hay conformidad", "action": "Pedir factura emitida", "note": ""}, {"rule": "Cobranza", "condition": "Factura emitida", "action": "Pedir voucher o estado de cuenta", "note": ""}], "keyDocs": "Correo / solicitud / requerimiento; Propuesta / cotización / presupuesto; Contrato / OC / correo de aceptación; Avances / fotos / planos / reportes; Acta / correo de conformidad; Factura electrónica / XML / CDR; Voucher / estado de cuenta; Registro de ventas / asiento; Índice del expediente"}, "rh": {"key": "rh", "sourceName": "RH", "label": "Recibos por Honorarios", "icon": "👤", "color": "purple", "folder": "RECIBOS_POR_HONORARIOS", "steps": [{"order": 1, "name": "Requerimiento de servicio", "description": "Se define necesidad del servicio", "requiredDoc": "Requerimiento interno / alcance", "required": true, "responsible": "Área solicitante", "controlNote": "Sustenta causalidad", "action": ""}, {"order": 2, "name": "Selección del profesional", "description": "Se elige prestador", "requiredDoc": "CV / cotización / RUC / DNI", "required": true, "responsible": "Administración", "controlNote": "Evita gasto no fehaciente", "action": ""}, {"order": 3, "name": "Contrato u orden de servicio", "description": "Se pacta servicio independiente", "requiredDoc": "Contrato / OS / acuerdo", "required": true, "responsible": "Gerencia", "controlNote": "Evita riesgo laboral encubierto", "action": ""}, {"order": 4, "name": "Ejecución del servicio", "description": "Profesional realiza trabajo", "requiredDoc": "Avances / correos / reportes", "required": true, "responsible": "Responsable del proyecto", "controlNote": "Prueba realidad del servicio", "action": ""}, {"order": 5, "name": "Entrega de entregable", "description": "Se recibe resultado", "requiredDoc": "Entregable / conformidad", "required": true, "responsible": "Responsable del proyecto", "controlNote": "Clave para deducir gasto", "action": ""}, {"order": 6, "name": "Emisión de RH", "description": "Prestador emite recibo", "requiredDoc": "Recibo por honorarios electrónico", "required": true, "responsible": "Prestador / Contabilidad", "controlNote": "Sustento tributario", "action": ""}, {"order": 7, "name": "Retención 8%", "description": "Se evalúa retención", "requiredDoc": "Suspensión de 4ta / constancia de retención", "required": true, "responsible": "Contabilidad", "controlNote": "Si aplica por monto", "action": ""}, {"order": 8, "name": "Pago al prestador", "description": "Se paga por banco", "requiredDoc": "Voucher bancario", "required": true, "responsible": "Tesorería", "controlNote": "Bancarización si corresponde", "action": ""}, {"order": 9, "name": "Registro contable y PLAME", "description": "Se registra gasto", "requiredDoc": "Asiento / PLAME si corresponde", "required": true, "responsible": "Contabilidad", "controlNote": "Control laboral-tributario", "action": ""}, {"order": 10, "name": "Archivo documental", "description": "Se cierra expediente", "requiredDoc": "Índice del expediente", "required": true, "responsible": "Administración", "controlNote": "Carpeta completa", "action": ""}], "rules": [{"rule": "Retención 8%", "condition": "RH mayor a S/ 1,500 sin suspensión", "action": "Pedir constancia de retención", "note": ""}, {"rule": "Suspensión 4ta", "condition": "Prestador indica suspensión", "action": "Pedir constancia vigente", "note": ""}, {"rule": "Riesgo laboral", "condition": "Servicio recurrente o subordinado", "action": "Alertar revisión laboral", "note": ""}], "keyDocs": "Requerimiento interno / alcance; CV / cotización / RUC / DNI; Contrato / OS / acuerdo; Avances / correos / reportes; Entregable / conformidad; Recibo por honorarios electrónico; Suspensión de 4ta / constancia de retención; Voucher bancario; Asiento / PLAME si corresponde; Índice del expediente"}}};
const KEY = "j3k_modulo_expedientes_final_v1";
let currentProcess = Object.keys(CONFIG.processes)[0];

function emptyStep(){ return {ok:false, na:false, obs:[], files:[]}; }
function defaultState(){
  const s = {header:{anio:"2026", mes:"Junio"}, processes:{}};
  for (const k of Object.keys(CONFIG.processes)){
    s.processes[k] = {general:{expediente:"", responsable:"", tercero:"", docTercero:"", monto:"", proyecto:"", descripcion:""}, steps: CONFIG.processes[k].steps.map(emptyStep)};
  }
  return s;
}
function loadState(){
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw) return defaultState();
    const s = JSON.parse(raw);
    if(!s.header) s.header = {anio:"2026", mes:"Junio"};
    if(!s.processes) s.processes = {};
    if(!s.saved) s.saved = { ventas: [], compras: [], rh: [] };
    if(!s.currentId) s.currentId = { ventas: Date.now().toString(), compras: Date.now().toString(), rh: Date.now().toString() };
    for (const k of Object.keys(CONFIG.processes)){
      if(!s.processes[k]) s.processes[k] = {general:{}, steps:[]};
      if(!s.processes[k].general) s.processes[k].general = {};
      const need = CONFIG.processes[k].steps.length;
      if(!Array.isArray(s.processes[k].steps)) s.processes[k].steps = [];
      while(s.processes[k].steps.length < need) s.processes[k].steps.push(emptyStep());
      if(s.processes[k].steps.length > need) s.processes[k].steps = s.processes[k].steps.slice(0, need);
      s.processes[k].steps.forEach(st => { if(!st.files) st.files=[]; });
    }
    return s;
  }catch(e){ return defaultState(); }
}
let state = loadState();

function save(){
  try{ saveToFirebase(KEY, state); localStorage.setItem(KEY, JSON.stringify(state)); }
  catch(e){ console.warn("No se pudo guardar en localStorage.", e); }
}
function val(id){ return document.getElementById(id)?.value || ""; }
function esc(s){ return String(s??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }
function safeName(s){ return String(s||"SIN_NOMBRE").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9._-]+/g,"_").replace(/^_+|_+$/g,"").substring(0,120)||"SIN_NOMBRE"; }
function money(n){ return (Number(n)||0).toFixed(2); }
function fmtSize(bytes){ if(!bytes) return "0 KB"; if(bytes<1024) return bytes+" B"; if(bytes<1048576) return (bytes/1024).toFixed(1)+" KB"; return (bytes/1048576).toFixed(1)+" MB"; }

function showView(v){
  document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));
  document.getElementById("view-"+v).classList.add("active");
  document.querySelectorAll(".nav-btn[data-view]").forEach(b=>b.classList.remove("active"));
  document.querySelector(`.nav-btn[data-view="${v}"]`)?.classList.add("active");
  render();
}
function setProcess(k){
  saveCurrent();
  currentProcess = k;
  fillGeneral();
  showView("proceso");
  render();
}
function saveHeader(){
  state.header.anio = val("anio");
  state.header.mes = val("mes");
  save();
  render();
}
function saveCurrent(){
  const g = state.processes[currentProcess].general;
  ["expediente","responsable","tercero","docTercero","monto","proyecto","descripcion","numeroFacturaVenta","cotizacionCUI"].forEach(id => {
    let el = document.getElementById(id);
    if(el) g[id] = el.value;
  });
  let detraccionEl = document.getElementById("tieneDetraccionVenta");
  if(detraccionEl) g.tieneDetraccionVenta = detraccionEl.checked;

  state.header.anio = val("anio");
  state.header.mes = val("mes");
  save();
  renderLite();
}
function fillGeneral(){
  document.getElementById("anio").value = state.header.anio || "2026";
  document.getElementById("mes").value = state.header.mes || "Junio";
  const g = state.processes[currentProcess].general;
  ["expediente","responsable","tercero","docTercero","monto","proyecto","descripcion","numeroFacturaVenta","cotizacionCUI"].forEach(id => {
    const el = document.getElementById(id); if(el) el.value = g[id] || "";
  });
  const detraccionEl = document.getElementById("tieneDetraccionVenta");
  if(detraccionEl) detraccionEl.checked = !!g.tieneDetraccionVenta;

  const btnLink = document.getElementById("btnLinkCotizacion");
  if(btnLink) {
    btnLink.style.display = (currentProcess === 'ventas') ? 'inline-block' : 'none';
  }
}

function processPct(k){
  const proc = CONFIG.processes[k], st = state.processes[k];
  const requiredIndexes = proc.steps.map((s,i)=>s.required ? i : null).filter(i=>i!==null);
  const total = requiredIndexes.length || proc.steps.length || 1;
  const done = requiredIndexes.filter(i => isStepComplete(k,i)).length;
  return {pct: Math.round(done/total*100), done, total, active: proc.steps.length, required: requiredIndexes.length};
}
function globalPct(){
  let done=0,total=0;
  Object.keys(CONFIG.processes).forEach(k => { const p=processPct(k); done+=p.done; total+=p.total; });
  return {pct: Math.round(done/(total||1)*100), done, total};
}
function isStepComplete(k,i){
  const step = CONFIG.processes[k].steps[i], st = state.processes[k].steps[i];
  if(!step.required) return true;
  if(st.na) return true;
  return !!st.ok && st.files && st.files.length >= 1;
}
function stepStatus(k,i){
  const step = CONFIG.processes[k].steps[i], st = state.processes[k].steps[i];
  if(!step.required) return '<span class="pill info">Opcional</span>';
  if(st.na) return '<span class="pill ok">No aplica</span>';
  
  let hasDetraccion = false;
  if (k === 'ventas' && step.name === 'Cobranza' && state.processes[k].general.tieneDetraccionVenta) {
     hasDetraccion = true;
  }
  
  if(isStepComplete(k,i)) {
      if (hasDetraccion && st.files && st.files.length === 1) {
          return '<span class="pill warn" title="Se permite subir constancia en el futuro">✔ Falta detracción</span>';
      }
      return '<span class="pill ok">Completo</span>';
  }
  
  if(st.ok && (!st.files || st.files.length < 1)) return '<span class="pill warn">Falta archivo</span>';
  if(!st.ok && st.files && st.files.length >= 1) return '<span class="pill warn">Falta conformidad</span>';
  return '<span class="pill bad">Pendiente</span>';
}

function saveCurrentToBuffer() {
  const g = state.processes[currentProcess].general;
  // Solo guardar en el historial si al menos tiene un identificador o algún dato
  if(g.expediente || g.tercero) {
      let idx = Object.prototype.hasOwnProperty.call(state.saved, currentProcess) ? state.saved[currentProcess].findIndex(x => x.id === state.currentId[currentProcess]) : -1;
      const clone = JSON.parse(JSON.stringify(state.processes[currentProcess]));
      clone.id = state.currentId[currentProcess];
      clone.pct = processPct(currentProcess).pct;
      
      if(!state.saved[currentProcess]) state.saved[currentProcess] = [];
      if(idx >= 0) state.saved[currentProcess][idx] = clone;
      else state.saved[currentProcess].push(clone);
  }
}

function switchExpediente(id) {
  let target = state.saved[currentProcess].find(x => x.id === id);
  if(target) {
     if(target.pct === 100) {
        const masterPin = localStorage.getItem('J3K_MASTER_PIN');
        if(!masterPin) {
           alert("Primero debes configurar el PIN Maestro de Seguridad en el módulo de Cotizaciones.");
           document.getElementById('expedienteSelector').value = state.currentId[currentProcess];
           return;
        }
        let attempts = 3;
        let authOk = false;
        while(attempts > 0) {
           const pin = prompt(`Este expediente está al 100%.\\nIngrese el PIN Maestro para editarlo. (Intentos restantes: ${attempts})`);
           if(pin === null) {
              document.getElementById('expedienteSelector').value = state.currentId[currentProcess];
              return;
           }
           if(pin === masterPin) {
              authOk = true;
              break;
           } else {
              attempts--;
              if(attempts > 0) alert("PIN incorrecto. Inténtalo de nuevo.");
           }
        }
        if(!authOk) {
           alert("Demasiados intentos fallidos. Acceso denegado.");
           document.getElementById('expedienteSelector').value = state.currentId[currentProcess];
           return;
        }
     }
     saveCurrentToBuffer();
     state.processes[currentProcess] = JSON.parse(JSON.stringify(target));
     state.currentId[currentProcess] = id;
     save(); render();
  }
}

function newExpediente() {
  saveCurrentToBuffer();
  state.currentId[currentProcess] = Date.now().toString();
  clearCurrent(); // This will clear and re-render
}

function render(){
  if(state.currentId) {
      document.getElementById('multi-expediente-ui').style.display = 'flex';
      const sel = document.getElementById('expedienteSelector');
      sel.innerHTML = '';
      saveCurrentToBuffer(); // Ensure current is in the list
      
      let list = state.saved[currentProcess] || [];
      // Ya no filtramos los completados, mostramos todos
      list.forEach(item => {
         const opt = document.createElement('option');
         opt.value = item.id;
         let name = "";
         if(currentProcess === 'ventas') {
             let cui = item.general.cotizacionCUI || 'S/C';
             let tercero = item.general.tercero || 'Sin Cliente';
             let monto = item.general.monto ? `S/ ${money(item.general.monto)}` : 'S/ 0.00';
             name = `${cui} | ${tercero} | ${monto}`;
         } else {
             name = item.general.expediente || item.general.tercero || 'Expediente sin nombre';
         }
         if(item.pct === 100) name += ' (Completado)';
         opt.textContent = name;
         if(item.id === state.currentId[currentProcess]) opt.selected = true;
         sel.appendChild(opt);
      });
  }

  // Auto-cierre a 100%
  const currentPct = processPct(currentProcess).pct;
  if(currentPct === 100) {
      const g = state.processes[currentProcess].general;
      if(!g.yaAvisado100) {
          g.yaAvisado100 = true; // prevent infinite loop
          save();
          setTimeout(() => {
              alert("✅ ¡Proceso completado al 100%! Se procederá a archivar y permitir el ingreso de una nueva factura.");
              newExpediente();
          }, 500);
      }
  }

  // Ventas Option B Logic
  const expBlock = document.getElementById('expedienteBlock');
  const ventasHdr = document.getElementById('ventasHeaderStep0');
  const ventasExtra = document.getElementById('ventasExtraFields');
  const btnLink = document.getElementById('btnLinkCotizacion');
  
  const cotizacionVinculada = !!state.processes[currentProcess].general.docTercero;

    if(currentProcess === 'ventas') {
      if(expBlock) expBlock.style.display = 'none';
      if(btnLink) btnLink.style.display = 'inline-block';
      if(ventasHdr) ventasHdr.style.display = 'block';
      if(ventasExtra) ventasExtra.style.display = 'flex';
    } else {
    if(expBlock) expBlock.style.display = 'block';
    if(ventasHdr) ventasHdr.style.display = 'none';
    if(ventasExtra) ventasExtra.style.display = 'none';
    if(btnLink) btnLink.style.display = 'none';
  }

  fillGeneral();
  renderSide();
  renderProcessTabs();
  renderMetrics();
  renderSummary();
  renderFlow();
  renderWorkSteps();
  renderDocs();
  renderRules();
  updateProgress();
}
function renderLite(){
  renderMetrics(); renderSummary(); renderFlow(); renderDocs(); renderRules(); updateProgress(); renderAlerts();
}
function renderSide(){
  const box = document.getElementById("sideProcesses");
  box.innerHTML = "";
  Object.keys(CONFIG.processes).forEach(k => {
    const p = CONFIG.processes[k], pct = processPct(k).pct;
    const btn = document.createElement("button");
    btn.className = "nav-btn" + (k===currentProcess ? " active" : "");
    btn.innerHTML = `<span class="nav-icon">${p.icon}</span><span>${esc(p.label)}<br><small>${pct}% completo</small></span>`;
    btn.onclick = () => setProcess(k);
    box.appendChild(btn);
  });

}
function renderProcessTabs(){
  const box = document.getElementById("processTabs");
  box.innerHTML = "";
  Object.keys(CONFIG.processes).forEach(k => {
    const p=CONFIG.processes[k], pct=processPct(k).pct;
    const div=document.createElement("div");
    div.className="tab "+(k===currentProcess?"active":"");
    div.onclick=()=>setProcess(k);
    div.innerHTML=`<div class="tab-title">${p.icon} ${esc(p.label)}</div><div class="tab-desc">${p.steps.length} pasos activos · ${pct}% completo</div>`;
    box.appendChild(div);
  });

}
function renderMetrics(){
  const g=globalPct();
  const cards = [
    {t:"Avance global", v:g.pct+"%"},
    {t:"Pasos obligatorios", v:g.done+"/"+g.total},
    {t:"Procesos", v:Object.keys(CONFIG.processes).length},
    {t:"Periodo", v:(state.header.mes||"")+" "+(state.header.anio||"")}
  ];
  document.getElementById("metrics").innerHTML = cards.map(c=>`<div class="metric"><div class="metric-title">${esc(c.t)}</div><div class="metric-value">${esc(c.v)}</div></div>`).join("");
  document.getElementById("zipAllBtn").disabled = g.pct < 100;
}
function renderSummary(){
  const body=document.getElementById("summaryRows"); body.innerHTML="";
  Object.keys(CONFIG.processes).forEach(k=>{
    const p=CONFIG.processes[k], pr=processPct(k);
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${p.icon} ${esc(p.label)}</td><td>${pr.active}</td><td>${pr.required}</td><td>${pr.done}</td><td><b>${pr.pct}%</b></td><td><button type="button" class="alt" onclick="setProcess('${k}')">Abrir</button></td>`;
    body.appendChild(tr);
  });

}
function renderFlow(){
  const p=CONFIG.processes[currentProcess];
  document.getElementById("flowTitle").textContent = p.label;
  document.getElementById("periodText").textContent = (state.header.mes||"")+" "+(state.header.anio||"");
  document.getElementById("flowHead").className = "flow-head "+p.color+"-h";
  document.getElementById("flowHead").textContent = p.icon+" Proceso de "+p.label;
  document.getElementById("keyDocs").innerHTML = `<b>Documentos clave:</b><br>${esc(p.keyDocs||"Según pasos definidos en la matriz.")}`;
  const flow=document.getElementById("flowSteps"); flow.innerHTML="";
  p.steps.forEach((s,i)=>{
    if(currentProcess === 'ventas' && i === 0) return;
    const done=isStepComplete(currentProcess,i);
    const div=document.createElement("div");
    div.className="flow-step "+(done?"done":"");
    div.innerHTML=`<div class="flow-icon">${iconFor(i)}</div><div class="flow-text"><b>${currentProcess==="ventas" ? i : i+1}. ${esc(s.name)}</b><span>${esc(s.description)}</span></div><div class="flow-check">${done?"✓":"○"}</div>`;
    flow.appendChild(div);
  });
  renderAlerts();
}
function renderAlerts(){
  const box=document.getElementById("alerts");
  if(!box) return;
  const p=CONFIG.processes[currentProcess], g=state.processes[currentProcess].general;
  const monto=Number(g.monto||0);
  let alerts=[];
  if(currentProcess==="compras" && monto>=2000) alerts.push("Pago igual o mayor a S/ 2,000: verificar voucher bancario y, si corresponde, detracción.");
  if(currentProcess==="rh" && monto>1500) alerts.push("RH mayor a S/ 1,500: verificar suspensión de 4ta categoría o retención del 8%.");
  if(currentProcess==="ventas" && monto>0) alerts.push("Venta con monto referencial: verificar propuesta, conformidad, factura y cobranza.");
  box.innerHTML = alerts.map(a=>`<div class="alert">${esc(a)}</div>`).join("");
}
function renderWorkSteps(){
  const box=document.getElementById("workSteps"); box.innerHTML="";
  if(currentProcess === 'ventas' && !state.processes[currentProcess].general.docTercero) {
    box.innerHTML = '<div style="padding:20px; text-align:center; color:#64748b; background:#f1f5f9; border-radius:8px; border:2px dashed #cbd5e1;">⚠️ Debes <b>Vincular Cotización</b> antes de poder subir archivos o ver los pasos.</div>';
    return;
  }
  const p=CONFIG.processes[currentProcess];
  p.steps.forEach((s,i)=>{
    if(currentProcess === 'ventas' && i === 0) return;
    const st=state.processes[currentProcess].steps[i];
    const div=document.createElement("div");
    div.className="work-step "+(isStepComplete(currentProcess,i)?"done":(s.required?"warn":"optional"));
    div.innerHTML=`
      <div class="step-top">
        <div class="num">${currentProcess==="ventas" ? i : i+1}</div>
        <div class="step-info">
          <b>${esc(s.name)} ${s.required ? "" : '<span class="pill info">Opcional</span>'}</b>
          <span>${esc(s.description)}</span>
          <div class="docs-needed"><b>Debe pedir:</b> ${esc(s.requiredDoc || "Documento de sustento")}<br><b>Responsable:</b> ${esc(s.responsible || "-")}<br><b>Control:</b> ${esc(s.controlNote || "-")}</div>
        </div>
        <div>
          <label>Conformidad</label>
          <select aria-label="Seleccionar opción" onchange="setOk(${i}, this.value)">
            <option value="no" ${!st.ok?"selected":""}>Pendiente</option>
            <option value="si" ${st.ok?"selected":""}>Conforme</option>
          </select>
          <label style="margin-top:7px;"><input type="checkbox" ${st.na?"checked":""} onchange="setNA(${i}, this.checked)" style="width:auto;"> No aplica</label>
        </div>
        <div>
          <label>Archivos</label>
          <input type="file" ${currentProcess === 'ventas' && (i === 0 || (i === 3 && !state.processes[currentProcess].general.tieneDetraccionVenta)) ? '' : 'multiple'} onchange="addFiles(${i}, this.files); this.value='';" aria-label="Cargar archivo de sustento">
          <div class="mini">PDF, imagen, Excel, Word, XML, CDR, etc.</div>
        </div>
      </div>
      ${(currentProcess === 'ventas' && i === 3 && state.processes[currentProcess].general.tieneDetraccionVenta) ? '<div style="background:#fef3c7; border:1px solid #f59e0b; border-radius:6px; padding:10px; margin:8px 0; color:#92400e; font-size:13px;"><b>⚠️ Recordatorio:</b> Esta operación tiene detracción. Debe subir el <b>Voucher de Pago</b> y la <b>Constancia de Detracción</b> (2 archivos).</div>' : ''}
      <div class="step-bottom">
        <div style="flex:1;">
          <label>Observaciones / referencias</label>
          <div id="obs-list-${i}" style="max-height:120px; overflow-y:auto; margin-bottom:6px;">
            ${(Array.isArray(st.obs) ? st.obs : (st.obs ? [{text: st.obs, date: new Date().toISOString()}] : [])).map((o, oIdx) => {
               let d = new Date(o.date);
               let dateStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
               return `<div style="display:flex; justify-content:space-between; align-items:start; background:#f8fafc; padding:6px; border-radius:4px; margin-bottom:4px; font-size:11px;">
                 <div style="flex:1;"><b style="color:#64748b; font-size:10px;">${dateStr}</b><br>${esc(o.text)}</div>
                 <button onclick="removeObs(${i}, ${oIdx})" style="background:transparent; color:#ef4444; border:none; padding:2px 5px; font-size:10px;" title="Eliminar observación">✖</button>
               </div>`;
            }).join("")}
          </div>
          <div style="display:flex; gap:6px;">
            <textarea id="new-obs-${i}" placeholder="Añadir observación... (Ej.: factura, OC, voucher)" style="min-height:36px; height:36px; padding:4px; font-size:11px; flex:1;"></textarea>
            <button onclick="addObs(${i}, document.getElementById('new-obs-${i}').value); document.getElementById('new-obs-${i}').value='';" style="padding:4px 8px; font-size:11px; white-space:nowrap; align-self:start;">Añadir</button>
          </div>
        </div>
        <div style="margin-left:15px;"><label>Estado</label><div style="padding-top:7px;">${stepStatus(currentProcess,i)}</div></div>
      </div>
      <div class="file-list" id="files-${i}"></div>`;
    box.appendChild(div);
    renderFiles(i);
  });
  if (currentProcess === 'ventas') {
    renderFiles(0);
  }
}
window.confirmCotizacion = function(i, selectEl) {
  const val = selectEl.value;
  if(!val) {
    save(); render();
    return;
  }
  if(confirm("¿Confirmas que deseas vincular la cotización " + val + " y dar por cumplido este paso?")) {
    const st = state.processes[currentProcess].steps[i];
    if (typeof st.obs === 'string') st.obs = st.obs.trim() ? [{text: st.obs, date: new Date().toISOString()}] : [];
    else if (!Array.isArray(st.obs)) st.obs = [];
    st.obs.push({text: "Cotización vinculada: " + val, date: new Date().toISOString()});
    st.ok = true;
    
    // Auto-fill header fields
    const cot = (window.cotizaciones_db || []).find(c => c.cui === val);
    if(cot) {
      document.getElementById('tercero').value = cot.empresa || cot.cliente || '';
      document.getElementById('docTercero').value = cot.ruc || '';
      document.getElementById('monto').value = cot.total || 0;
      document.getElementById('proyecto').value = cot.proyecto || '';
      saveCurrent();
    }
    
    save(); render();
  } else {
    selectEl.value = '';
  }
};

function setOk(i,v){ state.processes[currentProcess].steps[i].ok = v==="si"; save(); render(); }
function setNA(i,checked){ const st=state.processes[currentProcess].steps[i]; st.na=checked; if(checked) st.ok=true; save(); render(); }
function addObs(i,v){ 
  if(!v.trim()) return;
  const st = state.processes[currentProcess].steps[i];
  if (typeof st.obs === 'string') st.obs = st.obs.trim() ? [{text: st.obs, date: new Date().toISOString()}] : [];
  else if (!Array.isArray(st.obs)) st.obs = [];
  st.obs.push({text: v.trim(), date: new Date().toISOString()});
  save(); render(); 
}
function removeObs(i, oIdx){
  if(!confirm("¿Eliminar esta observación?")) return;
  const st = state.processes[currentProcess].steps[i];
  if(Array.isArray(st.obs)) { st.obs.splice(oIdx, 1); save(); render(); }
}
function addFiles(i, files){
  if(currentProcess === 'ventas') {
    const currentFiles = state.processes[currentProcess].steps[i].files || [];
    if(i === 0 && currentFiles.length >= 1) {
      alert('La factura de venta solo acepta 1 archivo. Elimina el actual para subir otro.');
      return;
    }
    if(i === 3) {
      const tieneDetraccion = state.processes[currentProcess].general.tieneDetraccionVenta;
      const maxFiles = tieneDetraccion ? 2 : 1;
      if(currentFiles.length >= maxFiles) {
        alert(tieneDetraccion ? 'La cobranza acepta máximo 2 archivos: Voucher de Pago y Detracción.' : 'La cobranza acepta máximo 1 archivo: Voucher de Pago.');
        return;
      }
    }
  }
  Array.from(files||[]).forEach(file=>{
    const reader=new FileReader();
    reader.onload=e=>{
      state.processes[currentProcess].steps[i].files.push({name:file.name,type:file.type||"application/octet-stream",size:file.size,data:e.target.result,addedAt:new Date().toISOString()});
      
      if(CONFIG.processes[currentProcess].steps[i].name === "Entrega y conformidad" || CONFIG.processes[currentProcess].steps[i].name === "Cobranza") {
        state.processes[currentProcess].steps[i].ok = true;
      }
      
      save(); render();
      if ((currentProcess === 'ventas' || currentProcess === 'compras') && i === 0) {
        procesarFacturaConIA(file, e.target.result);
      }
    };
    reader.readAsDataURL(file);
  });
}

async function procesarFacturaConIA(file, dataUrl) {
  const apiKey = localStorage.getItem('GEMINI_API_KEY');
  if(!apiKey) return; 

  const ext = file.name.split('.').pop().toLowerCase();
  let mime = file.type;
  if(!mime) {
    if(ext === 'pdf') mime = 'application/pdf';
    else if(['jpg','jpeg'].includes(ext)) mime = 'image/jpeg';
    else if(ext === 'png') mime = 'image/png';
  }
  
  if(!['application/pdf','image/jpeg','image/png'].includes(mime)) return;

  const base64Data = dataUrl.split(',')[1];
  if(!base64Data) return;

  const promptText = `Eres un asistente de contabilidad experto. Analiza el documento adjunto (factura o comprobante) y extrae la siguiente información estructurada en JSON estrictamente:
{
  "razon_social": "Razón social del emisor de la factura (Proveedor/Prestador/Cliente)",
  "ruc": "Número de RUC o DNI",
  "monto": "El importe total a pagar, numérico (ej. 1500.50)",
  "numero_factura": "El número de la factura o comprobante (ej. E001-456)",
  "proyecto": "Nombre del proyecto u obra si se menciona explícitamente, sino vacío",
  "descripcion": "Descripción breve del servicio o bien facturado"
}
Si no encuentras algún dato, usa "". Devuelve SOLO el JSON, sin bloques de código ni texto adicional.`;

  const titleEl = document.getElementById("flowHead");
  const originalTitle = titleEl.innerHTML;
  const originalBg = titleEl.style.backgroundColor;
  const originalColor = titleEl.style.color;
  
  titleEl.innerHTML = "🤖 Analizando factura con IA... espere por favor.";
  titleEl.style.backgroundColor = "#dbeafe";
  titleEl.style.color = "#1e40af";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: promptText },
            { inlineData: { mimeType: mime, data: base64Data } }
          ]
        }]
      })
    });
    const result = await response.json();
    if(result.error) throw new Error(result.error.message);
    let text = result.candidates[0].content.parts[0].text;
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const data = JSON.parse(text);

    if(data.razon_social) document.getElementById("tercero").value = data.razon_social;
    if(data.ruc) document.getElementById("docTercero").value = data.ruc;
    
    if(data.numero_factura) {
       const elNumFac = document.getElementById("numeroFacturaVenta");
       if (elNumFac) elNumFac.value = data.numero_factura;
    }
    
    if(data.proyecto) document.getElementById("proyecto").value = data.proyecto;
    if(data.descripcion) document.getElementById("descripcion").value = data.descripcion;

    if(data.monto && !isNaN(parseFloat(data.monto))) {
      document.getElementById("monto").value = parseFloat(data.monto);
    }

    saveCurrent();

    setTimeout(() => {
      const resp = prompt("Factura analizada.\\n\\n¿Quién es el responsable interno o ingeniero residente?");
      if(resp) {
        document.getElementById("responsable").value = resp;
        saveCurrent();
      }
    }, 300);

      const currentMonto = parseFloat(document.getElementById("monto").value) || 0;
      const aiMonto = parseFloat(data.monto);
      
      if(currentMonto > 0 && Math.abs(currentMonto - aiMonto) > 0.1) {
         if(confirm(`⚠️ La IA detectó un monto de S/ ${aiMonto.toFixed(2)} en la factura, pero el monto referencial actual es S/ ${currentMonto.toFixed(2)}.\n\n¿Deseas reemplazar el monto referencial con el de la factura?`)) {
            document.getElementById("monto").value = aiMonto.toFixed(2);
         }
      } else {
         document.getElementById("monto").value = aiMonto.toFixed(2);
      }
    saveCurrent();
  } catch (e) {
    console.error("Error al procesar con IA:", e);
  } finally {
    titleEl.innerHTML = originalTitle;
    titleEl.style.backgroundColor = originalBg;
    titleEl.style.color = originalColor;
  }
}

function renderFiles(i){
  const holder=document.getElementById("files-"+i); if(!holder) return;
  const files=state.processes[currentProcess].steps[i].files || [];
  holder.innerHTML = files.length ? "" : '<div class="mini">No hay archivos cargados.</div>';
  files.forEach((f,idx)=>{
    const row=document.createElement("div");
    row.className="file-row";
    row.innerHTML=`<span title="${esc(f.name)}">📎 ${esc(f.name)} <small>(${fmtSize(f.size)})</small></span><button type="button" class="danger" onclick="removeFile(${i},${idx})">Quitar</button>`;
    holder.appendChild(row);
  });

}
function removeFile(i,idx){ state.processes[currentProcess].steps[i].files.splice(idx,1); save(); render(); }
function renderDocs(){
  const body=document.getElementById("docSummary"); if(!body) return; body.innerHTML="";
  Object.keys(CONFIG.processes).forEach(k=>{
    const p=CONFIG.processes[k];
    p.steps.forEach((s,i)=>{
    if(currentProcess === 'ventas' && i === 0) return;
      const st=state.processes[k].steps[i], files=st.files||[];
      if(files.length===0){
        const tr=document.createElement("tr");
        tr.innerHTML=`<td>${p.icon} ${esc(p.label)}</td><td>${currentProcess==="ventas" ? i : i+1}. ${esc(s.name)}</td><td>-</td><td>${stepStatus(k,i)}</td>`;
        body.appendChild(tr);
      } else {
        files.forEach(f=>{
          const tr=document.createElement("tr");
          tr.innerHTML=`<td>${p.icon} ${esc(p.label)}</td><td>${currentProcess==="ventas" ? i : i+1}. ${esc(s.name)}</td><td>${esc(f.name)}</td><td>${stepStatus(k,i)}</td>`;
          body.appendChild(tr);
        });
      }
    });
  });

}
function renderRules(){
  const body=document.getElementById("ruleRows"); if(body){ body.innerHTML=""; Object.keys(CONFIG.processes).forEach(k=>{ const p=CONFIG.processes[k]; (p.rules||[]).forEach(r=>{ const tr=document.createElement("tr"); tr.innerHTML=`<td>${esc(p.label)}</td><td>${esc(r.rule)}</td><td>${esc(r.condition)}</td><td>${esc(r.action)}</td><td>${esc(r.note||"")}</td>`; body.appendChild(tr); }); }); }
  const pr=document.getElementById("processRules"); if(pr){ const p=CONFIG.processes[currentProcess]; pr.innerHTML = p.rules && p.rules.length ? `<ul>${p.rules.map(r=>`<li><b>${esc(r.rule)}:</b> ${esc(r.condition)} → ${esc(r.action)} ${r.note?`<br><small>${esc(r.note)}</small>`:""}</li>`).join("")}</ul>` : "Sin reglas activas configuradas."; }
}
function updateProgress(){
  const pr=processPct(currentProcess);
  document.getElementById("progressPct").textContent=pr.pct+"%";
  document.getElementById("progressBar").style.width=pr.pct+"%";
  document.getElementById("zipBtn").disabled=pr.pct<100;
  const pill=document.getElementById("statusPill");
  pill.className="pill "+(pr.pct===100?"ok":"warn");
  pill.textContent=pr.pct===100?"Completo":"En proceso";
  const all=globalPct();
  document.getElementById("zipAllBtn").disabled=all.pct<100;
}
function clearCurrent(){
  if(!confirm("¿Limpiar el proceso activo? Se eliminarán checks y archivos cargados de este proceso.")) return;
  state.processes[currentProcess]={general:{expediente:"",responsable:"",tercero:"",docTercero:"",monto:"",proyecto:"",descripcion:""}, steps: CONFIG.processes[currentProcess].steps.map(emptyStep)};
  save(); fillGeneral(); render();
}

function buildIndex(processKey){
  const p=CONFIG.processes[processKey], s=state.processes[processKey];
  return {empresa:CONFIG.company,ruc:CONFIG.ruc,periodo:state.header,proceso:p.label,proceso_key:processKey,expediente:s.general,progreso:processPct(processKey),pasos:p.steps.map((step,i)=>({orden:i+1,nombre:step.name,descripcion:step.description,documento_requerido:step.requiredDoc,obligatorio:step.required,responsable:step.responsible,observacion_control:step.controlNote,conforme:s.steps[i].ok,no_aplica:s.steps[i].na,observaciones:Array.isArray(s.steps[i].obs)?s.steps[i].obs:(s.steps[i].obs?[{text:s.steps[i].obs,date:new Date().toISOString()}]:[]),archivos:(s.steps[i].files||[]).map(f=>({nombre:f.name,tipo:f.type,tamano:f.size,fecha_carga:f.addedAt}))})),generado:new Date().toISOString(),fuente:CONFIG.source};
}
function buildSummaryText(processKey){
  const idx=buildIndex(processKey);
  let txt=`EXPEDIENTE DIGITAL J3K\nEmpresa: ${idx.empresa}\nRUC: ${idx.ruc}\nProceso: ${idx.proceso}\nPeriodo: ${idx.periodo.mes} ${idx.periodo.anio}\nExpediente: ${idx.expediente.expediente||"-"}\nTercero: ${idx.expediente.tercero||"-"}\nDocumento tercero: ${idx.expediente.docTercero||"-"}\nMonto: ${idx.expediente.monto||"-"}\nProyecto/Área: ${idx.expediente.proyecto||"-"}\nResponsable: ${idx.expediente.responsable||"-"}\nProgreso: ${idx.progreso.pct}%\nGenerado: ${idx.generado}\n\nPASOS\n`;
  idx.pasos.forEach(p=>{ txt+=`\n${p.orden}. ${p.nombre}\nObligatorio: ${p.obligatorio?"SI":"NO"} | Conforme: ${p.conforme?"SI":"NO"} | No aplica: ${p.no_aplica?"SI":"NO"}\nDocumentos requeridos: ${p.documento_requerido||"-"}\nObservaciones: ${p.observaciones && p.observaciones.length>0 ? p.observaciones.map(o=>o.text).join(" | ") : "-"}\nArchivos: ${(p.archivos||[]).map(a=>a.nombre).join(", ")||"-"}\n`; });
  return txt;
}
function downloadIndex(){
  const blob=new Blob([JSON.stringify(buildIndex(currentProcess), null, 2)],{type:"application/json"});
  trigger(blob, "INDICE_"+folderName(currentProcess)+".json");
}
function folderName(processKey){
  const p=CONFIG.processes[processKey], g=state.processes[processKey].general;
  return safeName((g.expediente || `${p.folder}_${state.header.mes}_${state.header.anio}`));
}
function entriesForProcess(processKey, rootPrefix=""){
  const p=CONFIG.processes[processKey], s=state.processes[processKey], folder=rootPrefix+folderName(processKey)+"/";
  const entries=[];
  entries.push({name:folder+"00_INDICE_EXPEDIENTE.json", data:strBytes(JSON.stringify(buildIndex(processKey), null, 2))});
  entries.push({name:folder+"00_RESUMEN_EXPEDIENTE.txt", data:strBytes(buildSummaryText(processKey))});
  p.steps.forEach((step,i)=>{
    const stepFolder=folder+String(i+1).padStart(2,"0")+"_"+safeName(step.name)+"/";
    const meta={paso:i+1,nombre:step.name,documento_requerido:step.requiredDoc,obligatorio:step.required,responsable:step.responsible,control:step.controlNote,estado:stepStatusText(processKey,i),observaciones:Array.isArray(s.steps[i].obs)?s.steps[i].obs:(s.steps[i].obs?[{text:s.steps[i].obs,date:new Date().toISOString()}]:[]),archivos:(s.steps[i].files||[]).map(f=>f.name)};
    entries.push({name:stepFolder+"metadata_paso.json", data:strBytes(JSON.stringify(meta,null,2))});
    (s.steps[i].files||[]).forEach((f,idx)=>entries.push({name:stepFolder+String(idx+1).padStart(2,"0")+"_"+safeName(f.name), data:dataUrlBytes(f.data)}));
  });
  return entries;
}
function stepStatusText(k,i){
  const step=CONFIG.processes[k].steps[i], st=state.processes[k].steps[i];
  if(!step.required) return "Opcional";
  if(st.na) return "No aplica";
  if(isStepComplete(k,i)) return "Completo";
  if(st.ok && (!st.files||!st.files.length)) return "Falta archivo";
  if(!st.ok && st.files&&st.files.length) return "Falta conformidad";
  return "Pendiente";
}
function downloadProcessZip(){
  saveCurrent();
  if(processPct(currentProcess).pct<100) return alert("El proceso aún no está al 100%.");
  const zip=makeZip(entriesForProcess(currentProcess));
  trigger(zip, folderName(currentProcess)+".zip");
}
function downloadGlobalZip(){
  const g=globalPct();
  if(g.pct<100) return alert("El avance global aún no está al 100%.");
  const entries=[];
  entries.push({name:"00_INDICE_GLOBAL.json", data:strBytes(JSON.stringify({empresa:CONFIG.company,ruc:CONFIG.ruc,periodo:state.header,progreso:g,procesos:Object.keys(CONFIG.processes).map(k=>buildIndex(k)),generado:new Date().toISOString()},null,2))});
  Object.keys(CONFIG.processes).forEach(k=> entries.push(...entriesForProcess(k, CONFIG.company.replaceAll(" ","_")+"_EXPEDIENTES/")));
  const zip=makeZip(entries);
  trigger(zip, "J3K_EXPEDIENTES_"+safeName(state.header.mes+"_"+state.header.anio)+".zip");
}
function trigger(blob, filename){ const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=filename; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); }
function dataUrlBytes(dataUrl){ const b64=(dataUrl||"").split(",")[1]||""; const bin=atob(b64); const bytes=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i); return bytes; }
function strBytes(str){ return new TextEncoder().encode(str); }

const crcTable=(()=>{let c,t=[]; for(let n=0;n<256;n++){c=n; for(let k=0;k<8;k++) c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1); t[n]=c>>>0;} return t;})();
function crc32(bytes){let crc=0^(-1); for(let i=0;i<bytes.length;i++) crc=(crc>>>8)^crcTable[(crc^bytes[i])&0xFF]; return (crc^(-1))>>>0;}
function u16(n){return [n&255,(n>>>8)&255];} function u32(n){return [n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255];}
function dosDT(){const d=new Date(); return {time:((d.getHours()&31)<<11)|((d.getMinutes()&63)<<5)|(Math.floor(d.getSeconds()/2)&31), date:(((d.getFullYear()-1980)&127)<<9)|(((d.getMonth()+1)&15)<<5)|(d.getDate()&31)};}
function makeZip(entries){
  const local=[], central=[]; let offset=0; const dt=dosDT();
  entries.forEach(e=>{
    const name=strBytes(e.name), data=e.data instanceof Uint8Array?e.data:strBytes(e.data||""), crc=crc32(data), size=data.length;
    const lh=new Uint8Array([...u32(0x04034b50),...u16(20),...u16(0),...u16(0),...u16(dt.time),...u16(dt.date),...u32(crc),...u32(size),...u32(size),...u16(name.length),...u16(0)]);
    local.push(lh,name,data);
    const ch=new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),...u16(0),...u16(0),...u16(dt.time),...u16(dt.date),...u32(crc),...u32(size),...u32(size),...u16(name.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset)]);
    central.push(ch,name);
    offset += lh.length+name.length+data.length;
  });
  const centralSize=central.reduce((s,p)=>s+p.length,0), centralOffset=offset;
  const end=new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(entries.length),...u16(entries.length),...u32(centralSize),...u32(centralOffset),...u16(0)]);
  return new Blob([...local,...central,end],{type:"application/zip"});

}
function iconFor(i){ return ["🔎","📋","📄","📦","🧾","🧮","📅","🏦","📁","✅","⚙️","💬"][i] || "•"; }

function init(){
  document.getElementById("anio").value=state.header.anio||"2026";
  document.getElementById("mes").value=state.header.mes||"Junio";
  const keys=Object.keys(CONFIG.processes);
  currentProcess=keys[0];
  
  if (typeof localforage !== 'undefined') {
    localforage.getItem('cotizaciones_db').then(db => {
      window.cotizaciones_db = db || [];
      render();
    }).catch(e => {
      window.cotizaciones_db = [];
      render();
    });
  } else {
    window.cotizaciones_db = [];
    render();
  }
}

// --- COTIZACIONES INTEGRATION ---
if (typeof localforage !== 'undefined') {
  localforage.config({ name: 'J3K_Cotizaciones' });

}

let currentQuotes = [];

async function openCotizacionModal() {
  if (typeof localforage === 'undefined') {
    alert("Error: No se pudo cargar localforage.");
    return;
  }
  try {
    const db = await localforage.getItem('cotizaciones_db');
    const dbArray = Array.isArray(db) ? db : (db && db.quotes ? db.quotes : []);
    if(dbArray.length === 0) {
      alert("No hay cotizaciones registradas en el repositorio.");
      return;
    }
    const aprobadas = dbArray.filter(q => q.estado === "APROBADA");
    if(aprobadas.length === 0) {
      alert("No se encontraron cotizaciones con estado APROBADA.");
      return;
    }
    currentQuotes = aprobadas;
    const tbody = document.getElementById("cotizacionesListBody");
    tbody.innerHTML = "";
    aprobadas.forEach((q, idx) => {
      const facturado = Number(q.montoFacturado) || 0;
      const total = Number(q.total) || 0;
      let pendiente = total - facturado;
      if (pendiente < 0) pendiente = 0;
      
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><span class="pill" style="background:#f1f5f9; color:#475569;">${esc(q.cui)}</span></td>
        <td><b>${esc(q.cliente)}</b><br><small style="color:#64748b;">${esc(q.proyecto)}</small></td>
        <td>S/ ${money(total)}</td>
        <td><b style="color:${pendiente > 0 ? '#10b981' : '#ef4444'}">S/ ${money(pendiente)}</b></td>
        <td>
          <button type="button" class="alt" style="background:var(--dark); color:white; border:none;" onclick="selectCotizacion(${idx})">Vincular</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    document.getElementById("cotizacionModal").style.display = "flex";
  } catch(e) {
    console.error(e);
    alert("Error cargando el repositorio de cotizaciones.");
  }
}

async function selectCotizacion(idx) {
  const q = currentQuotes[idx];
  const facturado = Number(q.montoFacturado) || 0;
  const total = Number(q.total) || 0;
  let pendiente = total - facturado;
  if(pendiente <= 0) {
    const resp = confirm("Esta cotización ya no tiene saldo pendiente por facturar (S/ 0.00). ¿Deseas vincularla de todas formas?");
    if(!resp) return;
  }

  const m = prompt(`Vincular cotización: ${q.cui}\n\nSaldo Pendiente Aprobado: S/ ${money(pendiente)}\n\nPor favor, ingresa el monto (S/) que se va a FACTURAR en este expediente:`, pendiente > 0 ? money(pendiente) : "0.00");
  if(m === null) return; // cancelado
  
  const montoFactura = parseFloat(m);
  if(isNaN(montoFactura) || montoFactura < 0) {
    alert("Por favor ingresa un monto válido mayor o igual a cero.");
    return;
  }

  // Llenar los datos generales
  document.getElementById("tercero").value = q.cliente || "";
  document.getElementById("docTercero").value = q.ruc || "";
  document.getElementById("proyecto").value = (q.proyecto || "") + " (Ref: " + q.cui + ")";
  document.getElementById("monto").value = montoFactura.toFixed(2);
  let hiddenCUI = document.getElementById("cotizacionCUI");
  if(hiddenCUI) hiddenCUI.value = q.cui;
  
  if(!document.getElementById("descripcion").value) {
    document.getElementById("descripcion").value = "Facturación según propuesta aprobada " + q.cui;
  }
  
  saveCurrent();

  // Actualizar la cotización en la DB para restar el saldo
  try {
    const db = await localforage.getItem('cotizaciones_db');
    const dbArray = Array.isArray(db) ? db : (db && db.quotes ? db.quotes : []);
    const dbQuote = dbArray.find(x => x.cui === q.cui);
    if(dbQuote) {
      dbQuote.montoFacturado = (Number(dbQuote.montoFacturado) || 0) + montoFactura;
      await localforage.setItem('cotizaciones_db', dbArray);
      alert(`Cotización ${q.cui} vinculada con éxito.\nEl repositorio ha actualizado el saldo pendiente.`);
    }
  } catch(e) {
    console.error(e);
    alert("Error al intentar actualizar el saldo de la cotización en la base de datos.");
  }
  
  document.getElementById("cotizacionModal").style.display = "none";
}

window.onload=init;