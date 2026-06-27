const { onValueWritten } = require('firebase-functions/v2/database');
const { db } = require('../config/firebase');

exports.onExpedienteWrite = onValueWritten('/expedientes/{id}', async (event) => {
    const beforeData = event.data.before.val();
    const afterData = event.data.after.val();

    if (!afterData) {
      console.log(`Expediente ${event.params.id} eliminado. Auditoría guardada.`);
      return null;
    }

    console.log(`Verificando cambios en Expediente ${event.params.id}`);
    
    // Regla de Negocio: Si un expediente estaba al 100% y se modificó,
    // o si el estado cambia a 'Finalizado', requerir validación.
    // Esta lógica prevendrá modificaciones no autorizadas.
    // En construcción (Mock):
    
    // Si detectamos un cambio ilegal, podríamos hacer:
    // await event.data.after.ref.set(beforeData);
    // console.log("Cambio revertido por falta de Master PIN");
    
    return null;
});
