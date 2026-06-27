const geminiService = require('../services/gemini.service');

exports.extraerFactura = async (req, res, next) => {
  try {
    const { fileUrl, tipo_documento } = req.body;
    const extraccion = await geminiService.extraerDatosFactura(fileUrl, tipo_documento);
    res.json({ success: true, extraccion });
  } catch (error) {
    next(error);
  }
};
