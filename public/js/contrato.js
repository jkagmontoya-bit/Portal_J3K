const KEY = "contrato_arrendamiento_camioneta_j3k_v1";
const firmas = ["firmaArr", "firmaJ3K"];

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

function recoger() {
  syncCampos();
  const d = { campos: {}, checks: {}, firmas: {} };
  document.querySelectorAll("[data-key]").forEach(el => {
    if (el.type === "checkbox") d.checks[el.dataset.key] = el.checked;
    else d.campos[el.dataset.key] = el.value;
  });
  firmas.forEach(id => {
    const c = document.getElementById(id);
    d.firmas[id] = c.toDataURL("image/png");
  });
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

function guardar() {
  saveToFirebase(KEY, recoger()); localStorage.setItem(KEY, JSON.stringify(recoger()));
  alert("Contrato guardado en este navegador.");
}

function cargar() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return alert("No hay contrato guardado en este navegador.");
  aplicar(JSON.parse(raw));
}

function exportar() {
  const d = recoger();
  const placa = (d.campos.placa || "sin_placa").replace(/[^a-zA-Z0-9_-]/g, "_");
  const blob = new Blob([JSON.stringify(d, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "contrato_arrendamiento_camioneta_J3K_" + placa + ".json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function limpiar() {
  if (!confirm("¿Limpiar todo el contrato?")) return;
  localStorage.removeItem(KEY);
  document.querySelectorAll("[data-key]").forEach(el => {
    if (el.type === "checkbox") el.checked = false;
    else if (!el.readOnly) el.value = "";
  });
  firmas.forEach(limpiarFirma);
}

function iniciarFirma(canvas) {
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
};