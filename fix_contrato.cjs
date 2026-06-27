const fs = require('fs');
let html = fs.readFileSync('public/modules/contrato.html', 'utf8');

// Find the start of the inline script
let start = html.indexOf('<script>\r\nconst KEY = "contrato_arrendamiento');
if (start === -1) {
    start = html.indexOf('<script>\nconst KEY = "contrato_arrendamiento');
}

if(start !== -1) {
    console.log('start found at', start);
    const end = html.indexOf('</script>', start);
    if (end !== -1) {
        html = html.substring(0, start) + '<script src="../js/contrato.js"></script>' + html.substring(end + 9);
        fs.writeFileSync('public/modules/contrato.html', html);
        console.log('Replaced inline script in contrato.html successfully!');
    } else {
        console.log('end not found');
    }
} else {
    console.log('start not found');
}
