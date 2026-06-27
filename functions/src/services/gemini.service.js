const env = require('../config/env');
const { GoogleGenAI } = require('@google/genai');

class GeminiService {
  constructor() {
    // Inicialización perezosa para evitar error si la clave no está disponible al arrancar el contenedor
    this._ai = null;
  }

  get ai() {
    if (!this._ai) {
      if (!env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY no configurada");
      }
      this._ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    }
    return this._ai;
  }

  async extraerDatosFactura(fileUrlOrBase64, tipo) {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY no configurada");
    }

    // Aquí iría la lógica para enviar el prompt a Gemini
    // y pedir el resultado en JSON estricto usando this.ai
    
    // Mock de extracción temporal
    return {
      ruc_emisor: "20612829561",
      fecha_emision: new Date().toISOString().split('T')[0],
      subtotal: 1000.00,
      igv: 180.00,
      total: 1180.00,
      descripcion: "Servicio de auditoría"
    };
  }
}

module.exports = new GeminiService();
