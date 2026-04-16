const http = require('http');
const fs = require('fs');
const path = require('path');

const host = '0.0.0.0';
const port = Number(process.env.PORT) || 5000;
const root = __dirname;

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

function send(res, statusCode, headers, body) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(decoded).replace(/^([/\\])+/, '');
  const filePath = path.join(root, normalized || 'index.html');
  if (!filePath.startsWith(root)) {
    return null;
  }
  return filePath;
}

const server = http.createServer((req, res) => {
  const filePath = safePath(req.url || '/');
  if (!filePath) {
    send(res, 403, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Forbidden');
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    let targetPath = filePath;

    if (!statError && stats.isDirectory()) {
      targetPath = path.join(filePath, 'index.html');
    }

    fs.readFile(targetPath, (readError, data) => {
      if (readError) {
        send(res, 404, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Not found');
        return;
      }

      const ext = path.extname(targetPath).toLowerCase();
      const headers = {
        'Content-Type': contentTypes[ext] || 'application/octet-stream',
        'Cache-Control': process.env.NODE_ENV === 'production' ? 'public, max-age=3600' : 'no-store'
      };
      send(res, 200, headers, data);
    });
  });
});

server.listen(port, host, () => {
  console.log(`Serving static site at http://${host}:${port}`);
});
