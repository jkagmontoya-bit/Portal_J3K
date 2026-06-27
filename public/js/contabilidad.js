/**
 * J3K Módulo de Contabilidad - Controller
 * Maneja la interacción de la vista contabilidad.html y la comunicación con el Backend.
 */

document.addEventListener('DOMContentLoaded', () => {
  const btnRvie = document.getElementById('btnRvie');
  const btnRce = document.getElementById('btnRce');
  const btnPlame = document.getElementById('btnPlame');
  
  const getParams = () => {
    return {
      mes: document.getElementById('periodoMes').value,
      anio: document.getElementById('periodoAnio').value
    };
  };

  const procesarExportacion = async (tipoBoton, actionName) => {
    const { mes, anio } = getParams();
    
    if (window.J3K_UI) {
      window.J3K_UI.showLoading(`Generando ${actionName} para SUNAT (${mes}/${anio})...`);
    }

    try {
      let resp;
      
      if (!window.J3K_API) {
        throw new Error("El API Client no está cargado.");
      }

      // Llamadas al Backend
      if (tipoBoton === 'RVIE') {
        resp = await window.J3K_API.contabilidad.generarSire(mes, anio, 'ventas');
      } else if (tipoBoton === 'RCE') {
        resp = await window.J3K_API.contabilidad.generarSire(mes, anio, 'compras');
      } else if (tipoBoton === 'PLAME') {
        resp = await window.J3K_API.contabilidad.generarPlame(mes, anio);
      }

      if (!resp || !resp.success) {
        throw new Error("El servidor devolvió un error al procesar el archivo.");
      }

      // Descargar el archivo TXT
      const fileData = resp.fileData;
      const blob = new Blob([fileData], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `LE20612829561${anio}${mes}001404000${tipoBoton}.txt`; // Formato base SUNAT
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
    } catch (e) {
      console.error(e);
      alert(`Ocurrió un error al generar ${actionName}: ` + e.message);
    } finally {
      if (window.J3K_UI) {
        window.J3K_UI.hideLoading();
      }
    }
  };

  btnRvie.addEventListener('click', () => procesarExportacion('RVIE', 'Registro de Ventas'));
  btnRce.addEventListener('click', () => procesarExportacion('RCE', 'Registro de Compras'));
  btnPlame.addEventListener('click', () => procesarExportacion('PLAME', 'Honorarios (4ta)'));

});
