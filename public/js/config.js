// public/js/config.js
window.J3K_CONFIG = {
  empresa: {
    razonSocial: "J3K INGENIERIA & DISEÑO",
    ruc: "20612829561"
  },
  bancos: [
    {
      nombre: "BCP",
      cuenta: "1915958344091"
    }
  ],
  defaultPagos: "<ul><li><strong>1er Pago:</strong> 10% a la presentación del Plan de Trabajo.</li></ul>",
  defaultObjetivo: "<p>El servicio comprende el desarrollo de...</p>",
  defaultAlcances: "<p><strong>1er Entregable – Ingeniería Básica</strong></p><ul><li>Modelo BIM LOD 200</li></ul>",
  defaultMetoIntro: "<p>La ejecución del servicio se desarrollará mediante metodología BIM colaborativa...</p>",
  defaultCondiciones: "<p>La presente propuesta considera únicamente los alcances definidos...</p>"
};

window.J3K_CONFIG.getBancoHTML = function() {
  let bancosHtml = window.J3K_CONFIG.bancos.map(b => `Cuenta ${b.nombre}: ${b.cuenta}`).join('<br>');
  return `<p><strong>Datos para pagos:</strong><br>RUC: ${window.J3K_CONFIG.empresa.ruc}<br>Razón Social: ${window.J3K_CONFIG.empresa.razonSocial}<br>${bancosHtml}</p>`;
};
