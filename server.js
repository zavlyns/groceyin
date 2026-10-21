const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;
const HOST = '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '/groceyin' || reqPath === '/groceyin/') {
    reqPath = '/index.html';
  }

  let filePath = path.join(__dirname, reqPath);
  let ext = path.extname(filePath).toLowerCase();

  // If file doesn't exist or is a route without extension, fallback to index.html (SPA Fallback)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, 'index.html');
    ext = '.html';
  }

  const contentType = MIME_TYPES[ext] || 'text/html';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content, 'utf-8');
    }
  });
});

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

server.listen(PORT, HOST, () => {
  const localIp = getLocalIp();
  console.log(`\n======================================================`);
  console.log(`🛒 GroceryIn Server Running:`);
  console.log(`💻 Local: http://localhost:${PORT}/`);
  console.log(`📱 HP (Wi-Fi): http://${localIp}:${PORT}/`);
  console.log(`🌐 Live Web: https://zavlyns.github.io/groceyin/`);
  console.log(`======================================================\n`);
});
