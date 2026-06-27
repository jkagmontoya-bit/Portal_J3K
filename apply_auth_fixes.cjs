const fs = require('fs');
const path = require('path');

const workspace = 'c:/Portal_J3K_GitHubReady';
const modulesDir = path.join(workspace, 'public', 'modules');
const jsDir = path.join(workspace, 'public', 'js');

const htmlFiles = ['acta.html','bitacora.html','boletas.html','contrato.html','expedientes.html','inicio.html','cotizacion.html'];
const jsFiles = ['acta.js','bitacora.js','boletas.js','contrato.js','expedientes.js','cotizacion.js'];



htmlFiles.forEach(file => {
  const fp = path.join(modulesDir, file);
  let content = fs.readFileSync(fp, 'utf8');
  const marker = '<div class="header-bar">';
  if (!content.includes('id="authBar"')) {
    content = content.replace(marker, `${marker}${authBarHtml}`);
    fs.writeFileSync(fp, content, 'utf8');
    console.log('Updated HTML:', file);
  } else {
    console.log('Auth UI already present in', file);
  }
});

const initWrapper = `if (window.waitForAuth) {
  window.waitForAuth().then(user => {
    if (user) initDB();
    else console.log('Usuario no autenticado, DB no se carga');
  });
} else {
  initDB();
}`;

jsFiles.forEach(file => {
  const fp = path.join(jsDir, file);
  let content = fs.readFileSync(fp, 'utf8');
  const initRegex = /\binitDB\s*\(\s*\);/;
  if (initRegex.test(content)) {
    content = content.replace(initRegex, initWrapper);
    fs.writeFileSync(fp, content, 'utf8');
    console.log('Patched JS:', file);
  } else {
    console.log('initDB call not found in', file);
  }
});

console.log('All done');
