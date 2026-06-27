const sireService = require('../services/sire.service');
const plameService = require('../services/plame.service');

exports.generarSire = async (req, res, next) => {
  try {
    const { mes, anio, tipo } = req.body;
    let resultado;
    
    if (tipo === 'ventas') {
      resultado = await sireService.generarRVIE(mes, anio);
    } else {
      resultado = await sireService.generarRCE(mes, anio);
    }
    
    res.json({ success: true, fileData: resultado });
  } catch (error) {
    next(error);
  }
};

exports.generarPlame = async (req, res, next) => {
  try {
    const { mes, anio } = req.body;
    const resultado = await plameService.generarPlameHonorarios(mes, anio);
    res.json({ success: true, fileData: resultado });
  } catch (error) {
    next(error);
  }
};
