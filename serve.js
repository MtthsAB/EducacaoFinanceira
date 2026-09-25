/* Servidor estático do "Preciso ou quero?" - zero dependências.
   Uso: node serve.js [pasta] [porta] [--no-open]

   - procura uma porta livre a partir da que você pediu;
   - abre o navegador sozinho, só depois que o servidor já está ouvindo;
   - manda os tipos MIME certos para .webmanifest, .woff2 e .svg.          */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const args = process.argv.slice(2).filter(a => a !== '--no-open');
const NO_OPEN = process.argv.includes('--no-open');

const ROOT = path.resolve(args[0] || __dirname);
const FIRST_PORT = Number(args[1]) || 8080;
const MAX_TRIES = 12;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.md': 'text/markdown; charset=utf-8',
  '.ico': 'image/x-icon'
};

if (!fs.existsSync(path.join(ROOT, 'index.html'))) {
  console.error('');
  console.error('  [ERRO] Nao encontrei index.html em:');
  console.error('         ' + ROOT);
  console.error('');
  console.error('  Rode o start.bat de dentro da pasta do projeto.');
  console.error('');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.resolve(path.join(ROOT, rel));

  if (!file.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403');
    return;
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 - nao encontrado: ' + rel);
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  });
});

function openBrowser(url) {
  if (NO_OPEN) return;
  try {
    if (process.platform === 'win32') {
      spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref();
    } else if (process.platform === 'darwin') {
      spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
    } else {
      spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref();
    }
  } catch (_) {
    /* sem navegador: o endereco esta impresso na tela */
  }
}

let tries = 0;

server.on('error', err => {
  if (err.code === 'EADDRINUSE' && tries < MAX_TRIES) {
    const busy = FIRST_PORT + tries;
    tries++;
    console.log('  Porta ' + busy + ' ocupada, tentando ' + (FIRST_PORT + tries) + '...');
    setTimeout(() => server.listen(FIRST_PORT + tries), 120);
    return;
  }
  console.error('');
  console.error('  [ERRO] Nao consegui subir o servidor: ' + err.code + ' - ' + err.message);
  console.error('');
  process.exit(1);
});

server.on('listening', () => {
  const port = server.address().port;
  const url = 'http://localhost:' + port + '/';
  console.log('');
  console.log('  Servindo: ' + ROOT);
  console.log('');
  console.log('  >>> ' + url);
  console.log('');
  console.log('  Para parar: aperte Ctrl+C nesta janela.');
  console.log('');
  openBrowser(url);
});

process.on('SIGINT', () => {
  console.log('');
  console.log('  Servidor parado.');
  process.exit(0);
});

server.listen(FIRST_PORT);
