/**
 * J3K Store - Gestor de Estado Centralizado
 * Extrae la lógica de estado, persistencia y reglas de negocio puras
 * de expedientes.js para modularizar el código.
 * 
 * Dependencias: saveToFirebase (global), localforage (global), localStorage
 */

// ======================================================================
// CONFIGURACIÓN DE NEGOCIO (Matriz de Procesos)
// ======================================================================
const CONFIG = {"company": "J3K INGENIERÍA & DISEÑO S.A.C.", "ruc": "20612829561", "source": "matriz_editable_flujograma_J3K.xlsx", "processes": {"compras": {"key": "compras", "sourceName": "Compras", "label": "Compras", "icon": "🛒", "color": "green", "folder": "COMPRAS", "steps": [{"order": 1, "name": "Identificación de necesidad", "description": "Área solicita bien o servicio", "requiredDoc": "Requerimiento interno / correo / solicitud", "required": true, "responsible": "Área usuaria", "controlNote": "Sustenta causalidad del gasto", "action": ""}, {"order": 2, "name": "Cotización y evaluación", "description": "Se evalúan proveedores", "requiredDoc": "Cotizaciones / comparativo / evaluación", "required": true, "responsible": "Administración", "controlNote": "Ayuda a probar valor de mercado", "action": ""}, {"order": 3, "name": "Orden de compra / servicio", "description": "Se emite OC u OS", "requiredDoc": "OC / OS aprobada", "required": true, "responsible": "Administración", "controlNote": "Debe estar antes de la factura", "action": ""}, {"order": 4, "name": "Recepción / conformidad", "description": "Se recibe bien o servicio", "requiredDoc": "Guía / acta / conformidad / fotos", "required": true, "responsible": "Solicitante", "controlNote": "Sustenta fehaciencia", "action": ""}, {"order": 5, "name": "Factura del proveedor", "description": "Se valida comprobante", "requiredDoc": "Factura electrónica / XML / CDR", "required": true, "responsible": "Contabilidad", "controlNote": "Validar RUC, fecha, descripción", "action": ""}, {"order": 6, "name": "Registro contable", "description": "Se registra la compra", "requiredDoc": "Asiento / registro de compras", "required": true, "responsible": "Contabilidad", "controlNote": "Sustento contable", "action": ""}, {"order": 7, "name": "Pago al proveedor", "description": "Se paga por banco si corresponde", "requiredDoc": "Voucher bancario / detracción si aplica", "required": true, "responsible": "Tesorería", "controlNote": "Control de bancarización", "action": ""}, {"order": 8, "name": "Archivo documental", "description": "Se cierra expediente", "requiredDoc": "Índice del expediente", "required": true, "responsible": "Administración", "controlNote": "Carpeta completa", "action": ""}], "rules": [{"rule": "ZIP habilitado", "condition": "Todos los pasos obligatorios completos", "action": "Permite descargar ZIP", "note": ""}, {"rule": "Pago bancario", "condition": "Monto mayor o igual a S/ 2,000", "action": "Pedir voucher bancario", "note": "También considerar US$ 500."}, {"rule": "Detracción", "condition": "Si operación está sujeta", "action": "Pedir constancia de detracción", "note": ""}], "keyDocs": "Requerimiento interno / correo / solicitud; Cotizaciones / comparativo / evaluación; OC / OS aprobada; Guía / acta / conformidad / fotos; Factura electrónica / XML / CDR; Asiento / registro de compras; Voucher bancario / detracción si aplica; Índice del expediente"}, "ventas": {"key": "ventas", "sourceName": "Ventas", "label": "Ventas", "icon": "💵", "color": "blue", "folder": "VENTAS", "steps": [{"order": 1, "name": "FACTURA VENTA - FOMATO DE FACTURA xxxx-xxxxxxxx", "description": "Se sube la factura de venta y se da la cotización vinculada", "requiredDoc": "Factura y selección de cotización", "required": true, "responsible": "Administración / Comercial", "controlNote": "Prueba origen de la operación", "action": ""}, {"order": 2, "name": "Ejecución del servicio", "description": "Se realiza el trabajo", "requiredDoc": "Avances / fotos / planos / reportes", "required": true, "responsible": "Área técnica", "controlNote": "Prueba ejecución real", "action": ""}, {"order": 3, "name": "Entrega y conformidad", "description": "Cliente acepta entregable", "requiredDoc": "Acta / correo de conformidad", "required": true, "responsible": "Área técnica / Gerencia", "controlNote": "Clave para cobrar y facturar", "action": ""}, {"order": 4, "name": "Cobranza", "description": "Cliente paga", "requiredDoc": "Voucher / estado de cuenta", "required": true, "responsible": "Tesorería", "controlNote": "Control de cuentas por cobrar", "action": ""}], "rules": [{"rule": "Facturación", "condition": "Cliente aprueba o hay conformidad", "action": "Pedir factura emitida", "note": ""}, {"rule": "Cobranza", "condition": "Factura emitida", "action": "Pedir voucher o estado de cuenta", "note": ""}], "keyDocs": "Correo / solicitud / requerimiento; Propuesta / cotización / presupuesto; Contrato / OC / correo de aceptación; Avances / fotos / planos / reportes; Acta / correo de conformidad; Factura electrónica / XML / CDR; Voucher / estado de cuenta; Registro de ventas / asiento; Índice del expediente"}, "rh": {"key": "rh", "sourceName": "RH", "label": "Recibos por Honorarios", "icon": "👤", "color": "purple", "folder": "RECIBOS_POR_HONORARIOS", "steps": [{"order": 1, "name": "Requerimiento de servicio", "description": "Se define necesidad del servicio", "requiredDoc": "Requerimiento interno / alcance", "required": true, "responsible": "Área solicitante", "controlNote": "Sustenta causalidad", "action": ""}, {"order": 2, "name": "Selección del profesional", "description": "Se elige prestador", "requiredDoc": "CV / cotización / RUC / DNI", "required": true, "responsible": "Administración", "controlNote": "Evita gasto no fehaciente", "action": ""}, {"order": 3, "name": "Contrato u orden de servicio", "description": "Se pacta servicio independiente", "requiredDoc": "Contrato / OS / acuerdo", "required": true, "responsible": "Gerencia", "controlNote": "Evita riesgo laboral encubierto", "action": ""}, {"order": 4, "name": "Ejecución del servicio", "description": "Profesional realiza trabajo", "requiredDoc": "Avances / correos / reportes", "required": true, "responsible": "Responsable del proyecto", "controlNote": "Prueba realidad del servicio", "action": ""}, {"order": 5, "name": "Entrega de entregable", "description": "Se recibe resultado", "requiredDoc": "Entregable / conformidad", "required": true, "responsible": "Responsable del proyecto", "controlNote": "Clave para deducir gasto", "action": ""}, {"order": 6, "name": "Emisión de RH", "description": "Prestador emite recibo", "requiredDoc": "Recibo por honorarios electrónico", "required": true, "responsible": "Prestador / Contabilidad", "controlNote": "Sustento tributario", "action": ""}, {"order": 7, "name": "Retención 8%", "description": "Se evalúa retención", "requiredDoc": "Suspensión de 4ta / constancia de retención", "required": true, "responsible": "Contabilidad", "controlNote": "Si aplica por monto", "action": ""}, {"order": 8, "name": "Pago al prestador", "description": "Se paga por banco", "requiredDoc": "Voucher bancario", "required": true, "responsible": "Tesorería", "controlNote": "Bancarización si corresponde", "action": ""}, {"order": 9, "name": "Registro contable y PLAME", "description": "Se registra gasto", "requiredDoc": "Asiento / PLAME si corresponde", "required": true, "responsible": "Contabilidad", "controlNote": "Control laboral-tributario", "action": ""}, {"order": 10, "name": "Archivo documental", "description": "Se cierra expediente", "requiredDoc": "Índice del expediente", "required": true, "responsible": "Administración", "controlNote": "Carpeta completa", "action": ""}], "rules": [{"rule": "Retención 8%", "condition": "RH mayor a S/ 1,500 sin suspensión", "action": "Pedir constancia de retención", "note": ""}, {"rule": "Suspensión 4ta", "condition": "Prestador indica suspensión", "action": "Pedir constancia vigente", "note": ""}, {"rule": "Riesgo laboral", "condition": "Servicio recurrente o subordinado", "action": "Alertar revisión laboral", "note": ""}], "keyDocs": "Requerimiento interno / alcance; CV / cotización / RUC / DNI; Contrato / OS / acuerdo; Avances / correos / reportes; Entregable / conformidad; Recibo por honorarios electrónico; Suspensión de 4ta / constancia de retención; Voucher bancario; Asiento / PLAME si corresponde; Índice del expediente"}}};

const STORAGE_KEY = "j3k_modulo_expedientes_final_v1";

// ======================================================================
// FUNCIONES PURAS DE ESTADO
// ======================================================================

function emptyStep() {
  return { ok: false, na: false, obs: [], files: [] };
}

function defaultState() {
  const s = { header: { anio: "2026", mes: "Junio" }, processes: {} };
  for (const k of Object.keys(CONFIG.processes)) {
    s.processes[k] = {
      general: { expediente: "", responsable: "", tercero: "", docTercero: "", monto: "", proyecto: "", descripcion: "" },
      steps: CONFIG.processes[k].steps.map(emptyStep)
    };
  }
  return s;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const s = JSON.parse(raw);
    if (!s.header) s.header = { anio: "2026", mes: "Junio" };
    if (!s.processes) s.processes = {};
    if (!s.saved) s.saved = { ventas: [], compras: [], rh: [] };
    if (!s.currentId) s.currentId = { ventas: Date.now().toString(), compras: Date.now().toString(), rh: Date.now().toString() };
    for (const k of Object.keys(CONFIG.processes)) {
      if (!s.processes[k]) s.processes[k] = { general: {}, steps: [] };
      if (!s.processes[k].general) s.processes[k].general = {};
      const need = CONFIG.processes[k].steps.length;
      if (!Array.isArray(s.processes[k].steps)) s.processes[k].steps = [];
      while (s.processes[k].steps.length < need) s.processes[k].steps.push(emptyStep());
      if (s.processes[k].steps.length > need) s.processes[k].steps = s.processes[k].steps.slice(0, need);
      s.processes[k].steps.forEach(st => { if (!st.files) st.files = []; });
    }
    return s;
  } catch (e) { return defaultState(); }
}

// ======================================================================
// FUNCIONES DE NEGOCIO (Cálculos puros, sin DOM)
// ======================================================================

function isStepComplete(k, i) {
  const step = CONFIG.processes[k].steps[i], st = J3K_Store.state.processes[k].steps[i];
  if (!step.required) return true;
  if (st.na) return true;
  return !!st.ok && st.files && st.files.length >= 1;
}

function processPct(k) {
  const proc = CONFIG.processes[k], st = J3K_Store.state.processes[k];
  const requiredIndexes = proc.steps.map((s, i) => s.required ? i : null).filter(i => i !== null);
  const total = requiredIndexes.length || proc.steps.length || 1;
  const done = requiredIndexes.filter(i => isStepComplete(k, i)).length;
  return { pct: Math.round(done / total * 100), done, total, active: proc.steps.length, required: requiredIndexes.length };
}

function globalPct() {
  let done = 0, total = 0;
  Object.keys(CONFIG.processes).forEach(k => { const p = processPct(k); done += p.done; total += p.total; });
  return { pct: Math.round(done / (total || 1) * 100), done, total };
}

function stepStatusText(k, i) {
  const step = CONFIG.processes[k].steps[i], st = J3K_Store.state.processes[k].steps[i];
  if (!step.required) return "Opcional";
  if (st.na) return "No aplica";
  if (isStepComplete(k, i)) return "Completo";
  if (st.ok && (!st.files || !st.files.length)) return "Falta archivo";
  if (!st.ok && st.files && st.files.length) return "Falta conformidad";
  return "Pendiente";
}

// ======================================================================
// PERSISTENCIA
// ======================================================================

function save() {
  try {
    if (typeof saveToFirebase === 'function') {
      saveToFirebase(STORAGE_KEY, J3K_Store.state);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(J3K_Store.state));

    // Adaptador NoSQL: Guardar cada expediente como documento individual en Firebase
    if (J3K_Store.state.saved) {
      Object.keys(J3K_Store.state.saved).forEach(tipo => {
        J3K_Store.state.saved[tipo].forEach(exp => {
          let docId = exp.id || ('EXP-' + Date.now());
          const docData = {
            id: docId,
            cui_vinculado: exp.general.cotizacionCUI || exp.general.expediente,
            tipo: tipo,
            estado: 'En proceso',
            metadatos: {
              proveedor_cliente: exp.general.tercero,
              monto_referencia: exp.general.monto,
              tieneDetraccionVenta: exp.general.tieneDetraccionVenta || false
            },
            pasos: exp.steps.map((s, idx) => ({
              id_paso: idx,
              ok: s.ok,
              archivos: (s.files || []).map(f => ({ name: f.name, url: f.data }))
            }))
          };
          if (typeof saveToFirebase === 'function') {
            saveToFirebase('expedientes/' + docId, docData);
          }
        });
      });
    }
  } catch (e) { console.warn("No se pudo guardar.", e); }
}

// ======================================================================
// UTILIDADES PURAS (Sin DOM)
// ======================================================================

function esc(s) { return String(s ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function safeName(s) { return String(s || "SIN_NOMBRE").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_+|_+$/g, "").substring(0, 120) || "SIN_NOMBRE"; }
function money(n) { return (Number(n) || 0).toFixed(2); }
function fmtSize(bytes) { if (!bytes) return "0 KB"; if (bytes < 1024) return bytes + " B"; if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"; return (bytes / 1048576).toFixed(1) + " MB"; }

// ======================================================================
// NAMESPACE GLOBAL
// ======================================================================

const J3K_Store = {
  // Config
  CONFIG,
  STORAGE_KEY,

  // State (mutable, se inicializa con loadState)
  state: loadState(),

  // Funciones puras de negocio
  emptyStep,
  defaultState,
  loadState,
  isStepComplete,
  processPct,
  globalPct,
  stepStatusText,

  // Persistencia
  save,

  // Utilidades
  esc,
  safeName,
  money,
  fmtSize
};

window.J3K_Store = J3K_Store;
