const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public/modules');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const filepath = path.join(dir, f);
  let content = fs.readFileSync(filepath, 'utf8');
  
  if (!content.includes('firebase-auth-compat.js')) {
    const target = '<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>';
    const replacement = target + '\n<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>';
    
    // There are some places that might have spaces before it
    const regex = /(<script src="https:\/\/www\.gstatic\.com\/firebasejs\/10\.7\.1\/firebase-app-compat\.js"><\/script>)/g;
    
    if (regex.test(content)) {
      content = content.replace(regex, `$1\n<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>`);
      fs.writeFileSync(filepath, content, 'utf8');
      console.log('Updated ' + f);
    } else {
      console.log('Could not find firebase app script in ' + f);
    }
  } else {
    console.log('Already has auth script in ' + f);
  }
});
