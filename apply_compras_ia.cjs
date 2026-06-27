const fs = require('fs');
let code = fs.readFileSync('public/js/expedientes.js', 'utf8');

// 1. btnLink.style.display
code = code.replace(
  /btnLink\.style\.display = \(currentProcess === 'ventas'\) \? 'inline-block' : 'none';/g,
  `btnLink.style.display = (currentProcess === 'ventas' || currentProcess === 'compras') ? 'inline-block' : 'none';`
);

// 2. <option> text for Cotizacion linked
code = code.replace(
  /if\(currentProcess === 'ventas'\) \{/g,
  `if(currentProcess === 'ventas' || currentProcess === 'compras') {`
);

// 3. UI block swapping in render
code = code.replace(
  /if\(currentProcess === 'ventas'\) \{\s*if\(expBlock\) expBlock\.style\.display = 'none';\s*if\(btnLink\) btnLink\.style\.display = 'inline-block';\s*if\(ventasHdr\) ventasHdr\.style\.display = 'block';/g,
  `if(currentProcess === 'ventas' || currentProcess === 'compras') {
        if(expBlock) expBlock.style.display = 'none';
        if(btnLink) btnLink.style.display = 'inline-block';
        if(ventasHdr) {
          ventasHdr.style.display = 'block';
          const lbl = ventasHdr.querySelector('label');
          if(lbl) lbl.innerText = CONFIG.processes[currentProcess].steps[0].name + " (Archivos)";
        }`
);

// 4. Step skipping in render(), renderWorkSteps(), buildIndex()
code = code.replace(
  /if\(currentProcess === 'ventas' && i === 0\) return;/g,
  `if((currentProcess === 'ventas' || currentProcess === 'compras') && i === 0) return;`
);

// 5. renderFiles(0) call in renderWorkSteps
code = code.replace(
  /if \(currentProcess === 'ventas'\) \{\s*renderFiles\(0\);\s*\}/g,
  `if (currentProcess === 'ventas' || currentProcess === 'compras') {
      renderFiles(0);
    }`
);

// 6. File input single file limit (in addFiles)
code = code.replace(
  /if\(currentProcess === 'ventas'\) \{\s*const currentFiles = state\.processes\[currentProcess\]\.steps\[i\]\.files/g,
  `if(currentProcess === 'ventas' || currentProcess === 'compras') {
      const currentFiles = state.processes[currentProcess].steps[i].files`
);

// 7. addFiles completion check
code = code.replace(
  /\|\| \(currentProcess === 'ventas' && i === 0\)\)/g,
  `|| (['ventas', 'compras'].includes(currentProcess) && i === 0))`
);

// 8. addFiles detracción logic
code = code.replace(
  /if\(i === 3\) \{\s*const tieneDetraccion = state\.processes\[currentProcess\]\.general\.tieneDetraccionVenta;/g,
  `if((currentProcess === 'ventas' && i === 3) || (currentProcess === 'compras' && i === 6)) {
        const tieneDetraccion = state.processes[currentProcess].general.tieneDetraccionVenta;`
);

// 9. addFiles maxFiles alert
code = code.replace(
  /alert\(tieneDetraccion \? 'La cobranza acepta máximo 2 archivos: Voucher de Pago y Detracción.' : 'La cobranza acepta máximo 1 archivo: Voucher de Pago.'\);/g,
  `alert(tieneDetraccion ? 'Este paso acepta máximo 2 archivos: Voucher de Pago y Detracción.' : 'Este paso acepta máximo 1 archivo: Voucher de Pago.');`
);

// 10. File input 'multiple' toggle in renderWorkSteps
code = code.replace(
  /currentProcess === 'ventas' && \(i === 0 \|\| \(i === 3/g,
  `(['ventas', 'compras'].includes(currentProcess)) && (i === 0 || ((currentProcess === 'ventas' ? i === 3 : i === 6)`
);

// 11. Recordatorio UI block in renderWorkSteps
let recStr = "${(currentProcess === 'ventas' && i === 3 && state.processes[currentProcess].general.tieneDetraccionVenta) ?";
let recRep = "${(((currentProcess === 'ventas' && i === 3) || (currentProcess === 'compras' && i === 6)) && state.processes[currentProcess].general.tieneDetraccionVenta) ?";
code = code.replace(recStr, recRep);

fs.writeFileSync('public/js/expedientes.js', code);
console.log('Script applied.');
