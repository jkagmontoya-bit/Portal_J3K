module.exports = (err, req, res, next) => {
  console.error('[Error Centralizado]:', err);
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(status).json({
    success: false,
    error: message,
    code: status
  });
};
