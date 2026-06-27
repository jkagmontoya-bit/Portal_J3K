const KEY = "bitacora_j3k_vehicular_limpia";
  const firmas = ["firma1", "firma2", "firma3"];

  function num(v) {
    const x = parseFloat(v);
    return isNaN(x) ? 0 : x;
  }

  function agregarCantidad() {
    const cantidad = parseInt(document.getElementById("cantidadFilas").value || "1", 10);
    if (cantidad < 1) return;
    agregarFilas(cantidad);
  }

  function agregarFilas(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      agregarFila();
    }
  }

  function agregarFila(data = {}) {
    const tr = document.createElement("tr");
    const campos = [
      ["fecha", "text", "dd/mm/aaaa"],
      ["conductor", "text", "Nombre"],
      ["kmi", "number", ""],
      ["kmf", "number", ""],
      ["kmu", "text", ""],
      ["ruta", "textarea", "Origen - destino"],
      ["obra", "textarea", "Obra / cliente"],
      ["motivo", "textarea", "Visita técnica / supervisión"],
      ["comb", "number", ""],
      ["peaje", "number", ""],
      ["comp", "text", "F001-000123"],
      ["obs", "textarea", ""]
    ];

    campos.forEach(([key, tipo, placeholder]) => {
      const td = document.createElement("td");
      let el = tipo === "textarea" ? document.createElement("textarea") : document.createElement("input");

      if (tipo !== "textarea") el.type = tipo;
      if (tipo === "number") {
        el.min = "0";
        el.step = "0.01";
      }

      el.dataset.row = key;
      el.placeholder = placeholder || "";
      el.value = data[key] || "";
      if (key === "kmu") el.readOnly = true;
      el.oninput = () => {
        calcularFila(tr);
        calcularTotales();
      };

      td.appendChild(el);
      tr.appendChild(td);
    });

    const td = document.createElement("td");
    td.className = "borrar";
    const b = document.createElement("button");
    b.textContent = "X";
    b.className = "danger";
    b.onclick = () => {
      tr.remove();
      calcularTotales();
    };
    td.appendChild(b);
    tr.appendChild(td);

    document.getElementById("tabla").appendChild(tr);
    calcularFila(tr);
    calcularTotales();
  }

  function calcularFila(tr) {
    const kmi = num(tr.querySelector('[data-row="kmi"]').value);
    const kmf = num(tr.querySelector('[data-row="kmf"]').value);
    const kmu = tr.querySelector('[data-row="kmu"]');

    if (kmf >= kmi && (kmf > 0 || kmi > 0)) {
      kmu.value = (kmf - kmi).toFixed(0);
    } else {
      kmu.value = "";
    }
  }

  function calcularTotales() {
    let km = 0, comb = 0, peaje = 0;

    document.querySelectorAll("#tabla tr").forEach(tr => {
      km += num(tr.querySelector('[data-row="kmu"]').value);
      comb += num(tr.querySelector('[data-row="comb"]').value);
      peaje += num(tr.querySelector('[data-row="peaje"]').value);
    });

    document.getElementById("totalKm").value = km.toFixed(0);
    document.getElementById("totalComb").value = comb.toFixed(2);
    document.getElementById("totalPeaje").value = peaje.toFixed(2);
    document.getElementById("totalGasto").value = (comb + peaje).toFixed(2);
  }

  function recogerDatos() {
    const d = { campos: {}, filas: [], firmas: {} };

    document.querySelectorAll("[data-key]").forEach(el => {
      d.campos[el.dataset.key] = el.value;
    });

    document.querySelectorAll("#tabla tr").forEach(tr => {
      const fila = {};
      tr.querySelectorAll("[data-row]").forEach(el => {
        fila[el.dataset.row] = el.value;
      });
      d.filas.push(fila);
    });

    firmas.forEach(id => {
      const c = document.getElementById(id);
      d.firmas[id] = c.toDataURL("image/png");
    });

    return d;
  }

  function aplicarDatos(d) {
    if (!d) return;

    Object.entries(d.campos || {}).forEach(([k, v]) => {
      const el = document.querySelector(`[data-key="${k}"]`);
      if (el) el.value = v;
    });

    document.getElementById("tabla").innerHTML = "";
    (d.filas || []).forEach(f => agregarFila(f));

    if (!d.filas || !d.filas.length) {
      agregarFilas(10);
    }

    setTimeout(() => {
      Object.entries(d.firmas || {}).forEach(([id, src]) => restaurarFirma(id, src));
    }, 100);

    calcularTotales();
  }

  function guardar() {
    saveToFirebase(KEY, recogerDatos()); localStorage.setItem(KEY, JSON.stringify(recogerDatos()));
    alert("Bitácora guardada en este navegador.");
  }

  function cargar() {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      alert("No hay datos guardados en este navegador.");
      return;
    }
    aplicarDatos(JSON.parse(raw));
  }

  function exportar() {
    const datos = recogerDatos();
    const periodo = (datos.campos.periodo || "periodo").replace(/[^a-zA-Z0-9_-]/g, "_");
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "bitacora_vehicular_J3K_" + periodo + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function limpiar() {
    if (!confirm("¿Limpiar toda la bitácora?")) return;

    localStorage.removeItem(KEY);
    document.querySelectorAll("input, textarea").forEach(el => {
      if (!el.readOnly && el.dataset.key !== "contratoTipo") el.value = "";
    });

    const contrato = document.querySelector('[data-key="contratoTipo"]');
    if (contrato) contrato.value = "Arrendamiento de vehículo sin chofer";

    document.getElementById("tabla").innerHTML = "";
    agregarFilas(10);

    firmas.forEach(limpiarFirma);
    calcularTotales();
  }

  function iniciarFirma(canvas) {
    const ctx = canvas.getContext("2d");
    let dibujando = false;
    let x = 0, y = 0;

    function redimensionar() {
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

    function posicion(e) {
      const rect = canvas.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      return { x: p.clientX - rect.left, y: p.clientY - rect.top };
    }

    function inicio(e) {
      e.preventDefault();
      dibujando = true;
      const p = posicion(e);
      x = p.x;
      y = p.y;
    }

    function mover(e) {
      if (!dibujando) return;
      e.preventDefault();
      const p = posicion(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      x = p.x;
      y = p.y;
    }

    function fin(e) {
      if (e) e.preventDefault();
      dibujando = false;
    }

    canvas.addEventListener("mousedown", inicio);
    canvas.addEventListener("mousemove", mover);
    canvas.addEventListener("mouseup", fin);
    canvas.addEventListener("mouseleave", fin);

    canvas.addEventListener("touchstart", inicio, { passive: false });
    canvas.addEventListener("touchmove", mover, { passive: false });
    canvas.addEventListener("touchend", fin, { passive: false });

    redimensionar();
    window.addEventListener("resize", redimensionar);
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
    agregarFilas(10);
    calcularTotales();
  };