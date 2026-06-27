const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, 'public', 'manifest.json');
const modulesDir = path.join(__dirname, 'public', 'modules');

if (!fs.existsSync(modulesDir)) {
  fs.mkdirSync(modulesDir);
}

let content = fs.readFileSync(manifestPath, 'utf8');
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
}
const manifestData = JSON.parse(content);

manifestData.modules.forEach(mod => {
  if (mod.b64) {
    const filePath = path.join(modulesDir, `${mod.id}.html`);
    const buffer = Buffer.from(mod.b64, 'base64');
    fs.writeFileSync(filePath, buffer);
    
    // Update manifest to point to file
    mod.url = `/modules/${mod.id}.html`;
    delete mod.b64;
    delete mod.mime;
  }
});

fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2), 'utf8');
console.log('Optimización completada. El manifest.json es ahora ligero.');
