const sunatService = require('../services/sunat.service');

exports.consultaDocumento = async (req, res, next) => {
  try {
    const { tipo, numero } = req.query;
    const data = await sunatService.consultarDocumento(tipo, numero);
    res.json({ success: true, data });
  } catch (error) {
    next(error); // Pasa al errorHandler
  }
};
