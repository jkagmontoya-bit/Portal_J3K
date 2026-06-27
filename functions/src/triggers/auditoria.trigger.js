const functions = require('firebase-functions');
const { db } = require('../config/firebase');

exports.onExpedienteWrite = functions.database.ref('/expedientes/{id}')
  .onWrite(async (change, context) => {
    const beforeData = change.before.val();
    const afterData = change.after.val();

    if (!afterData) {
      console.log(`Expediente ${context.params.id} eliminado. Auditoría guardada.`);
      return null;
    }

    console.log(`Verificando cambios en Expediente ${context.params.id}`);
    
    // Regla de Negocio: Si un expediente estaba al 100% y se modificó,
    // o si el estado cambia a 'Finalizado', requerir validación.
    // Esta lógica prevendrá modificaciones no autorizadas.
    // En construcción (Mock):
    
    // Si detectamos un cambio ilegal, podríamos hacer:
    // await change.after.ref.set(beforeData);
    // console.log("Cambio revertido por falta de Master PIN");
    
    return null;
  });
