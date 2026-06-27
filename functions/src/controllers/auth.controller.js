const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const env = require('../config/env');

router.post('/verify-pin', authMiddleware, async (req, res, next) => {
  try {
    const { pin } = req.body;
    
    if (!pin) {
      return res.status(400).json({ success: false, message: 'PIN requerido' });
    }

    if (pin === env.MASTER_PIN) {
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
