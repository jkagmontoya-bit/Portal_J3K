const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

// El PIN Maestro estará guardado en las variables de entorno de forma segura.
// Por ahora, se define por defecto o desde el env.
const MASTER_PIN = process.env.MASTER_PIN || 'J3K2026';

router.post('/verify-pin', authMiddleware, async (req, res, next) => {
  try {
    const { pin } = req.body;
    
    if (!pin) {
      return res.status(400).json({ success: false, message: 'PIN requerido' });
    }

    if (pin === MASTER_PIN) {
      return res.json({ success: true, message: 'PIN validado correctamente' });
    } else {
      // 403 Forbidden para denegar el acceso
      return res.status(403).json({ success: false, message: 'PIN incorrecto' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
