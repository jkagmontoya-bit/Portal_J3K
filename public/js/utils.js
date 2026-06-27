// public/js/utils.js
window.J3K_UTILS = {
  // 1. Prevención XSS (Sanitización)
  escapeHTML: function(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  },

  // 2. Formato de Monedas
  formatMoney: function(amount) {
    return Number(amount).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  },
  
  formatSoles: function(amount) {
    return 'S/ ' + this.formatMoney(amount);
  },

  // 3. Obtener API Key global (Gemini u otros)
  getApiKey: function(keyName = 'GEMINI_API_KEY') {
    return localStorage.getItem(keyName) || '';
  },
  
  setApiKey: function(keyName, value) {
    if(value) {
      localStorage.setItem(keyName, value.trim());
    }
  }
};
