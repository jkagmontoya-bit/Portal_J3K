const KEY = "acta_parte_vinculada_la_sociedad_2_firmas_imagen";

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

function recoger() {
  const data = { fields: [], firmas: [] };
  document.querySelectorAll("input:not([type=file]), textarea").forEach(el => data.fields.push(el.value));
  document.querySelectorAll(".sig-area img").forEach(img => data.firmas.push(img.getAttribute("src") || ""));
  return data;
}

function aplicar(data) {
  if (Array.isArray(data)) {
    document.querySelectorAll("input:not([type=file]), textarea").forEach((el, i) => el.value = data[i] || "");
    return;
  }
  document.querySelectorAll("input:not([type=file]), textarea").forEach((el, i) => el.value = (data.fields || [])[i] || "");
  document.querySelectorAll(".sig-area img").forEach((img, i) => {
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

function guardar() {
  saveToFirebase(KEY, recoger()); localStorage.setItem(KEY, JSON.stringify(recoger()));
  alert("Acta guardada en este navegador.");
}

function cargar() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return alert("No hay datos guardados.");
  aplicar(JSON.parse(raw));
}

function limpiar() {
  if (!confirm("¿Limpiar todos los campos y firmas?")) return;
  document.querySelectorAll("input:not([type=file]), textarea").forEach(el => el.value = "");
  document.querySelectorAll(".sig-area img").forEach(img => {
    img.removeAttribute("src");
    img.style.display = "none";
  });
  document.querySelectorAll(".sig-placeholder").forEach(el => el.style.display = "block");
  document.querySelectorAll('input[type="file"]').forEach(el => el.value = "");
  localStorage.removeItem(KEY);
}