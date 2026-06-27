const { db } = require('../config/firebase');

class SireService {
  async generarRCE(mes, anio) {
    // Buscar en Firebase los expedientes de compras completados
    // Formatear en TXT SIRE
    return "FORMATO|TXT|SIRE|COMPRAS|MOCK";
  }

  async generarRVIE(mes, anio) {
    // Buscar en Firebase los expedientes de ventas completados
    // Formatear en TXT SIRE
    return "FORMATO|TXT|SIRE|VENTAS|MOCK";
  }
}

module.exports = new SireService();
