const KEY = "boleta_j3k_prolija_proyeccion_v3";
  const meses = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  function n(id) {
    const x = parseFloat(document.getElementById(id).value);
    return isNaN(x) ? 0 : x;
  }

  function val(id) {
    return document.getElementById(id).value || "";
  }

  

  function setText(id, text) {
    document.getElementById(id).textContent = text;
  }

  function setMoney(id, num) {
    document.getElementById(id).textContent = J3K_UTILS.formatMoney(num);
  }

  function setInput(id, num) {
    document.getElementById(id).value = J3K_UTILS.formatMoney(num);
  }

  function ultimoDiaMes(mes, anio) {
    return new Date(anio, mes, 0).getDate();
  }

  function actualizarPeriodo() {
    const mes = parseInt(val("mesPago") || "1", 10);
    const anio = parseInt(val("anioPago") || "2026", 10);
    const periodo = meses[mes] + " del " + anio;
    const fecha = ultimoDiaMes(mes, anio) + " " + meses[mes] + " del " + anio;
    document.getElementById("periodo").value = periodo;
    document.getElementById("fechaEmision").value = fecha;
    const tipo = document.getElementById("proyTipo");
    const desde = document.getElementById("proyDesdeMes");
    if (tipo && desde && tipo.value === "hastaDiciembre") {
      desde.value = String(mes);
    }
  }

  function ajustarRegimen() {
    const regimen = val("regimen");
    const salud = document.getElementById("salud");
    if (regimen === "micro") salud.value = "sis";
    if (regimen !== "micro") salud.value = "essalud";
  }

  function obtenerCalculoMensual(mes) {
    const sueldoMensual = n("sueldo");
    const rmv = n("rmv");
    const dias = Math.min(Math.max(n("dias"), 0), 30);
    const regimen = val("regimen");

    const sueldo = sueldoMensual * dias / 30;
    const asig = val("asigFam") === "si" ? rmv * 0.10 * dias / 30 : 0;
    const otrosAfectos = n("otrosAfectos");
    const noAfectos = n("noAfectos");
    const baseRem = sueldo + asig + otrosAfectos;
    const totalIngresos = baseRem + noAfectos;

    let pension = 0;
    let labelPension = "ONP 19990";
    if (val("pension") === "onp") {
      pension = baseRem * 0.13;
      labelPension = "ONP 19990";
    } else if (val("pension") === "afp") {
      pension = baseRem * n("afpTasa") / 100;
      labelPension = "AFP " + J3K_UTILS.formatMoney(n("afpTasa")) + "%";
    } else {
      pension = 0;
      labelPension = "Sin pensión";
    }

    const quinta = n("quinta");
    const otrosDesc = n("otrosDesc");
    const descNoAfecto = n("descNoAfecto");
    const totalAportesTrab = pension + quinta;
    const totalDescuentos = otrosDesc + descNoAfecto;
    const neto = totalIngresos - totalAportesTrab - totalDescuentos;

    let salud = 0;
    let labelSalud = "SIS Microempresa";
    if (val("salud") === "sis") {
      salud = n("sisMonto");
      labelSalud = "SIS Microempresa";
    } else {
      salud = baseRem * n("essaludTasa") / 100;
      labelSalud = "EsSalud";
    }

    const vida = n("vidaLey");
    const totalEmpleador = salud + vida;

    let vac = 0, grat = 0, cts = 0, boni = 0, vacText = "";

    if (regimen === "micro") {
      vac = baseRem / 24;
      grat = 0;
      cts = 0;
      boni = 0;
      vacText = "15 días al año";
    } else if (regimen === "pequena") {
      vac = baseRem / 24;
      grat = baseRem / 12;
      cts = baseRem / 24;
      boni = val("salud") === "essalud" ? grat * n("essaludTasa") / 100 : 0;
      vacText = "15 días al año";
    } else {
      vac = baseRem / 12;
      grat = baseRem / 6;
      cts = baseRem / 12;
      boni = val("salud") === "essalud" ? grat * n("essaludTasa") / 100 : 0;
      vacText = "30 días al año";
    }

    const costoCaja = baseRem + noAfectos + salud + vida;
    const costoTotal = costoCaja + vac + grat + cts + boni;

    return {
      sueldo, asig, otrosAfectos, noAfectos, baseRem, totalIngresos,
      pension, labelPension, quinta, otrosDesc, descNoAfecto,
      totalAportesTrab, totalDescuentos, neto, salud, labelSalud, vida,
      totalEmpleador, vac, grat, cts, boni, costoCaja, costoTotal, vacText
    };
  }

  function calcular() {
    actualizarPeriodo();

    const c = obtenerCalculoMensual(parseInt(val("mesPago") || "1", 10));
    const regimenText = document.getElementById("regimen").selectedOptions[0].text;
    const diasHoras = Math.min(Math.max(n("dias"), 0), 30).toFixed(0) + " / " + Math.max(n("horas"), 0).toFixed(0);

    setText("pRegimen", regimenText);
    setText("pPeriodo", val("periodo") || "-");
    setText("pFechaEmision", val("fechaEmision") || "-");
    setText("pFechaNeto", val("fechaEmision") || "-");
    setText("pTrabajadora", val("trabajadora") || "-");
    setText("pTrabajadoraFirma", val("trabajadora") || "-");
    setText("pCargo", val("cargo") || "-");
    setText("pDni", val("dni") || "-");
    setText("pDniFirma", val("dni") || "-");
    setText("pFechaIngreso", val("fechaIngreso") || "-");
    setText("pDiasHoras", diasHoras);
    setText("pPension", c.labelPension);
    setText("pSalud", c.labelSalud);
    setText("pVacaciones", c.vacText);
    setText("pEmpleadorFirma", val("empleadorFirma") || "-");
    setText("pDniEmpleador", val("dniEmpleador") || "-");

    setMoney("iSueldo", c.sueldo);
    setMoney("iAsig", c.asig);
    setMoney("iOtrosAfectos", c.otrosAfectos);
    setMoney("iNoAfectos", c.noAfectos);
    setMoney("iTotal", c.totalIngresos);

    setText("labelPension", c.labelPension);
    setMoney("aPension", c.pension);
    setMoney("aQuinta", c.quinta);
    setMoney("aTotal", c.totalAportesTrab);

    setText("labelSalud", c.labelSalud);
    setMoney("eSalud", c.salud);
    setMoney("eVida", c.vida);
    setMoney("eTotal", c.totalEmpleador);

    setMoney("dOtros", c.otrosDesc);
    setMoney("dNoAfecto", c.descNoAfecto);
    setMoney("dTotal", c.totalDescuentos);

    setMoney("pNeto", c.neto);

    setInput("cBase", c.baseRem);
    setInput("cSalud", c.salud);
    setInput("cVac", c.vac);
    setInput("cGrat", c.grat);
    setInput("cCts", c.cts);
    setInput("cBoni", c.boni);
    setInput("cCaja", c.costoCaja);
    setInput("cTotal", c.costoTotal);

    calcularProyeccion();

    const warning = document.getElementById("warning");
    warning.style.display = "none";
    warning.textContent = "";
    if (n("dias") >= 30 && n("sueldo") < n("rmv")) {
      warning.style.display = "block";
      warning.textContent = "Alerta: el sueldo mensual ingresado es menor a la RMV vigente. Revisar antes de declarar.";
    }

    toggleProjection();
  }

  function ajustarProyeccion() {
    const tipo = val("proyTipo");
    const desde = document.getElementById("proyDesdeMes");
    const hasta = document.getElementById("proyHastaMes");
    const mesBoleta = parseInt(val("mesPago") || "1", 10);

    if (!desde || !hasta) return;

    if (tipo === "hastaDiciembre") {
      desde.value = String(mesBoleta);
      hasta.value = "12";
      desde.disabled = true;
      hasta.disabled = true;
    } else if (tipo === "anual") {
      desde.value = "1";
      hasta.value = "12";
      desde.disabled = true;
      hasta.disabled = true;
    } else {
      desde.disabled = false;
      hasta.disabled = false;
    }
  }

  function calcularProyeccion() {
    ajustarProyeccion();

    const anio = parseInt(val("anioPago") || "2026", 10);
    const tipo = val("proyTipo") || "hastaDiciembre";
    let mesInicio = parseInt(val("proyDesdeMes") || val("mesPago") || "1", 10);
    let mesFin = parseInt(val("proyHastaMes") || "12", 10);

    if (tipo === "hastaDiciembre") {
      mesInicio = parseInt(val("mesPago") || "1", 10);
      mesFin = 12;
    } else if (tipo === "anual") {
      mesInicio = 1;
      mesFin = 12;
    }

    // Si el usuario coloca el rango al revés, el sistema lo corrige para mostrar algo útil.
    if (mesInicio > mesFin) {
      const tmp = mesInicio;
      mesInicio = mesFin;
      mesFin = tmp;
    }

    setText("proyDesde", meses[mesInicio] + " " + anio + " a " + meses[mesFin] + " " + anio);

    const body = document.getElementById("projectionBody");
    body.innerHTML = "";

    const totals = {
      ingresos: 0, aportesTrab: 0, descuentos: 0, neto: 0, salud: 0,
      vida: 0, vac: 0, grat: 0, cts: 0, costo: 0
    };

    for (let m = mesInicio; m <= mesFin; m++) {
      const c = obtenerCalculoMensual(m);
      totals.ingresos += c.totalIngresos;
      totals.aportesTrab += c.totalAportesTrab;
      totals.descuentos += c.totalDescuentos;
      totals.neto += c.neto;
      totals.salud += c.salud;
      totals.vida += c.vida;
      totals.vac += c.vac;
      totals.grat += c.grat;
      totals.cts += c.cts;
      totals.costo += c.costoTotal;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${meses[m]}</td>
        <td>${J3K_UTILS.formatMoney(c.totalIngresos)}</td>
        <td>${J3K_UTILS.formatMoney(c.totalAportesTrab)}</td>
        <td>${J3K_UTILS.formatMoney(c.totalDescuentos)}</td>
        <td>${J3K_UTILS.formatMoney(c.neto)}</td>
        <td>${J3K_UTILS.formatMoney(c.salud)}</td>
        <td>${J3K_UTILS.formatMoney(c.vida)}</td>
        <td>${J3K_UTILS.formatMoney(c.vac)}</td>
        <td>${J3K_UTILS.formatMoney(c.grat)}</td>
        <td>${J3K_UTILS.formatMoney(c.cts)}</td>
        <td>${J3K_UTILS.formatMoney(c.costoTotal)}</td>
      `;
      body.appendChild(tr);
    }

    setText("ptIngresos", J3K_UTILS.formatMoney(totals.ingresos));
    setText("ptAportesTrab", J3K_UTILS.formatMoney(totals.aportesTrab));
    setText("ptDescuentos", J3K_UTILS.formatMoney(totals.descuentos));
    setText("ptNeto", J3K_UTILS.formatMoney(totals.neto));
    setText("ptSalud", J3K_UTILS.formatMoney(totals.salud));
    setText("ptVida", J3K_UTILS.formatMoney(totals.vida));
    setText("ptVac", J3K_UTILS.formatMoney(totals.vac));
    setText("ptGrat", J3K_UTILS.formatMoney(totals.grat));
    setText("ptCts", J3K_UTILS.formatMoney(totals.cts));
    setText("ptCosto", J3K_UTILS.formatMoney(totals.costo));
  }

  function toggleProjection() {
    const box = document.getElementById("projectionBox");
    box.style.display = val("showProjection") === "si" ? "block" : "none";
  }

  function cargarFirma(event, targetId) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const box = document.getElementById(targetId);
      box.innerHTML = "";
      const img = document.createElement("img");
      img.src = e.target.result;
      box.appendChild(img);
    };
    reader.readAsDataURL(file);
  }

  function collectData() {
    const data = { campos: {}, firmas: {} };
    document.querySelectorAll("[data-key]").forEach(el => {
      data.campos[el.dataset.key] = el.value;
    });
    ["firmaEmpleador", "firmaTrabajadora"].forEach(id => {
      const img = document.querySelector("#" + id + " img");
      data.firmas[id] = img ? img.src : "";
    });
    return data;
  }

  function applyData(data) {
    if (!data) return;
    Object.entries(data.campos || {}).forEach(([k, v]) => {
      const el = document.querySelector(`[data-key="${k}"]`);
      if (el) el.value = v;
    });
    Object.entries(data.firmas || {}).forEach(([id, src]) => {
      if (src) {
        const box = document.getElementById(id);
        box.innerHTML = "";
        const img = document.createElement("img");
        img.src = src;
        box.appendChild(img);
      }
    });
    calcular();
  }

  let boletasDB = [];
  let currentBoletaCUI = null;

  async function cargarDB() {
    try {
      const db = await localforage.getItem('boletas_db');
      boletasDB = db || [];
      renderBoletasTable();
    } catch(e) {
      console.error(e);
    }
  }

  function renderBoletasTable() {
    const tbody = document.getElementById('boletas-tbody');
    if(!tbody) return;
    
    const select = document.getElementById('filtroMes');
    if (select && select.options.length <= 1 && boletasDB.length > 0) {
      const periods = new Set();
      boletasDB.forEach(boleta => {
        if(boleta.periodo) periods.add(boleta.periodo);
      });
      const sorted = Array.from(periods).sort((a,b) => {
        // basic sort, "Julio del 2026"
        const yearA = a.split(' del ')[1] || "0";
        const yearB = b.split(' del ')[1] || "0";
        if(yearA !== yearB) return yearB.localeCompare(yearA);
        return b.localeCompare(a); // rudimentary month sort
      });
      sorted.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = p;
        select.appendChild(opt);
      });
      const now = new Date();
      const mesName = meses[now.getMonth()+1];
      const curStr = `${mesName} del ${now.getFullYear()}`;
      if (periods.has(curStr)) select.value = curStr;
    }
    
    const filterVal = select ? select.value : 'todos';
    const filtered = boletasDB.filter(boleta => {
      if(filterVal === 'todos') return true;
      return boleta.periodo === filterVal;
    });

    tbody.innerHTML = '';
    filtered.slice().reverse().forEach(boleta => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${J3K_UTILS.escapeHTML(boleta.cui)}</td>
        <td>${J3K_UTILS.escapeHTML(boleta.trabajadora || '-')}</td>
        <td>${J3K_UTILS.escapeHTML(boleta.periodo || '-')}</td>
        <td>${J3K_UTILS.formatMoney(boleta.neto || 0)}</td>
        <td>
          <button type="button" class="alt" style="margin-right:5px; padding:5px 10px; font-size:12px;" onclick="editarBoleta('${boleta.cui}')">Editar</button>
          <button type="button" class="danger" style="padding:5px 10px; font-size:12px;" onclick="eliminarBoleta('${boleta.cui}')">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function nuevaBoleta() {
    limpiarSinConfirmar();
    currentBoletaCUI = null;
    document.getElementById('view-dashboard').style.display = 'none';
    document.getElementById('view-editor').style.display = 'block';
  }

  function volverDashboard() {
    document.getElementById('view-editor').style.display = 'none';
    document.getElementById('view-dashboard').style.display = 'block';
    cargarDB();
  }

  function generateCUI(data) {
    const dni = data.campos.dni || "SINDNI";
    const nombre = data.campos.trabajadora || "SINNOMBRE";
    const periodo = data.campos.periodo || "SINMES";
    return `${dni} - ${nombre} - ${periodo}`;
  }

  async function guardarBoleta() {
    const data = collectData();
    const c = obtenerCalculoMensual(parseInt(val("mesPago") || "1", 10));
    data.neto = c.neto;
    data.trabajadora = data.campos.trabajadora;
    data.periodo = data.campos.periodo;
    
    if (!currentBoletaCUI) {
      data.cui = generateCUI(data);
      boletasDB.push(data);
    } else {
      data.cui = currentBoletaCUI;
      const index = boletasDB.findIndex(b => b.cui === currentBoletaCUI);
      if (index !== -1) {
        boletasDB[index] = data;
      } else {
        boletasDB.push(data);
      }
    }
    
    currentBoletaCUI = data.cui;
    try {
      await localforage.setItem('boletas_db', boletasDB);
      if(typeof saveToFirebase === 'function') saveToFirebase('boletas_db', boletasDB);
      alert("Boleta guardada con éxito. CUI: " + data.cui);
    } catch(e) {
      console.error(e);
      alert("Error guardando boleta localmente.");
    }
  }

  function editarBoleta(cui) {
    const pin = prompt("Ingrese J3K_MASTER_PIN para editar:");
    if (pin !== localStorage.getItem('J3K_MASTER_PIN')) {
      alert("PIN incorrecto.");
      return;
    }
    const boleta = boletasDB.find(b => b.cui === cui);
    if (boleta) {
      currentBoletaCUI = cui;
      applyData(boleta);
      document.getElementById('view-dashboard').style.display = 'none';
      document.getElementById('view-editor').style.display = 'block';
    }
  }

  async function eliminarBoleta(cui) {
    const pin = prompt("Ingrese J3K_MASTER_PIN para eliminar:");
    if (pin !== localStorage.getItem('J3K_MASTER_PIN')) {
      alert("PIN incorrecto.");
      return;
    }
    if (!confirm("¿Está seguro de eliminar esta boleta?")) return;
    boletasDB = boletasDB.filter(b => b.cui !== cui);
    await localforage.setItem('boletas_db', boletasDB);
    if(typeof saveToFirebase === 'function') saveToFirebase('boletas_db', boletasDB);
    renderBoletasTable();
  }

  function exportar() {
    const data = collectData();
    const periodo = (data.campos.periodo || "periodo").replace(/[^a-zA-Z0-9_-]/g, "_");
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "boleta_pago_J3K_" + periodo + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function limpiarSinConfirmar() {
    document.querySelectorAll("[data-key]").forEach(el => {
      if (el.id === "mesPago") el.value = "1";
      else if (el.id === "anioPago") el.value = "2026";
      else if (el.id === "cargo") el.value = "Asistente Administrativa";
      else if (el.id === "dias") el.value = "30";
      else if (el.id === "horas") el.value = "192";
      else if (el.id === "sueldo") el.value = "1500";
      else if (el.id === "rmv") el.value = "1130";
      else if (el.id === "afpTasa") el.value = "12.93";
      else if (el.id === "sisMonto") el.value = "15";
      else if (el.id === "essaludTasa") el.value = "9";
      else if (el.id === "showProjection") el.value = "si";
      else if (el.id === "proyTipo") el.value = "hastaDiciembre";
      else if (el.id === "proyDesdeMes") el.value = "1";
      else if (el.id === "proyHastaMes") el.value = "12";
      else if (el.tagName === "SELECT") el.selectedIndex = 0;
      else if (el.readOnly) el.value = "";
      else el.value = "";
    });
    ["firmaEmpleador", "firmaTrabajadora"].forEach(id => {
      const e = document.getElementById(id);
      if(e) e.innerHTML = "";
    });
    calcular();
  }

  function limpiar() {
    if (!confirm("¿Limpiar datos del formulario? No eliminará la boleta de la base de datos, solo limpiará la vista actual.")) return;
    limpiarSinConfirmar();
  }

  window.onload = () => {
    cargarDB();
    actualizarPeriodo();
    ajustarProyeccion();
    calcular();
  };