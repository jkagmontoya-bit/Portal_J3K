/**
 * J3K API Client
 * Centraliza todas las llamadas al Backend-for-Frontend (Cloud Functions).
 * Gestiona automáticamente el token de autenticación de Firebase.
 */

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:5001/j3k-portal/us-central1/api/api/v1' // Ajustar según el ID del proyecto y región del emulador
  : 'https://us-central1-j3k-portal.cloudfunctions.net/api/api/v1'; // Ajustar según producción

export const apiClient = {
  
  /**
   * Obtiene el token JWT actual de Firebase Auth
   */
  async getAuthToken() {
    if (window.firebase && firebase.auth().currentUser) {
      return await firebase.auth().currentUser.getIdToken();
    }
    return null;
  },

  /**
   * Método interno para ejecutar peticiones HTTP
   */
  async _fetch(endpoint, options = {}) {
    const token = await this.getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          console.warn("Sesión expirada o no autorizada.");
          // Aquí podríamos redirigir a login
        }
        throw new Error(data.error || 'Error en la petición al backend');
      }

      return data;
    } catch (error) {
      console.error(`[API Error] ${endpoint}:`, error);
      throw error;
    }
  },

  // ==========================================
  // SERVICIOS DISPONIBLES
  // ==========================================

  ia: {
    async extraerFactura(fileUrl, tipoDocumento = 'factura') {
      return apiClient._fetch('/ia/extraer-factura', {
        method: 'POST',
        body: JSON.stringify({ fileUrl, tipo_documento: tipoDocumento })
      });
    }
  },

  sunat: {
    async consultarDocumento(tipo, numero) {
      return apiClient._fetch(`/sunat/consulta-documento?tipo=${tipo}&numero=${numero}`, {
        method: 'GET'
      });
    }
  },

  contabilidad: {
    async generarSire(mes, anio, tipo) {
      return apiClient._fetch('/contabilidad/generar-sire', {
        method: 'POST',
        body: JSON.stringify({ mes, anio, tipo })
      });
    },
    async generarPlame(mes, anio) {
      return apiClient._fetch('/contabilidad/generar-plame', {
        method: 'POST',
        body: JSON.stringify({ mes, anio })
      });
    }
  },

  auth: {
    verifyMasterPin(pin) {
      return apiClient._fetch('/auth/verify-pin', {
        method: 'POST',
        body: JSON.stringify({ pin })
      });
    }
  }

};

// Exponer globalmente temporalmente para facilitar la migración gradual sin romper <script> normales
window.J3K_API = apiClient;
