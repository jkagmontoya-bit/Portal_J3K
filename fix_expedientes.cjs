const fs = require('fs');
let html = fs.readFileSync('public/modules/expedientes.html', 'utf8');

// Find the start of the inline script
let start = html.indexOf('<script>\r\nconst CONFIG = {"company": "J3K INGENIERÍA');
if (start === -1) {
    start = html.indexOf('<script>\nconst CONFIG = {"company": "J3K INGENIERÍA');
}

if(start !== -1) {
    console.log('start found at', start);
    const end = html.indexOf('</script>', start);
    if (end !== -1) {
        html = html.substring(0, start) + '<script src="../js/expedientes.js"></script>' + html.substring(end + 9);
        fs.writeFileSync('public/modules/expedientes.html', html);
        console.log('Replaced inline script in expedientes.html successfully!');
    } else {
        console.log('end not found');
    }
} else {
    console.log('start not found');
}
