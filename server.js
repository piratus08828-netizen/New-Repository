const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const users = new Map();
const sessions = new Map();
const levels = [];

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Body too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createSession(username) {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, username);
  return token;
}

function getAuthUser(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  return sessions.get(token) || null;
}

function serveStatic(req, res, pathname) {
  const filePath = pathname === '/' ? '/index.html' : pathname;
  const safePath = path.normalize(filePath).replace(/^\.+/, '');
  const absolutePath = path.join(PUBLIC_DIR, safePath);

  if (!absolutePath.startsWith(PUBLIC_DIR)) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  fs.readFile(absolutePath, (err, data) => {
    if (err) {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }

    const ext = path.extname(absolutePath);
    const contentType =
      ext === '.html' ? 'text/html; charset=utf-8' :
      ext === '.css' ? 'text/css; charset=utf-8' :
      ext === '.js' ? 'application/javascript; charset=utf-8' :
      'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/auth/register' && req.method === 'POST') {
    try {
      const { username, password } = await parseBody(req);
      if (!username || !password) {
        return sendJson(res, 400, { error: 'username и password обязательны' });
      }
      if (users.has(username)) {
        return sendJson(res, 409, { error: 'Пользователь уже существует' });
      }

      users.set(username, { passwordHash: hashPassword(password) });
      const token = createSession(username);
      return sendJson(res, 201, { token, username });
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }
  }

  if (url.pathname === '/api/auth/login' && req.method === 'POST') {
    try {
      const { username, password } = await parseBody(req);
      const user = users.get(username);
      if (!user || user.passwordHash !== hashPassword(password || '')) {
        return sendJson(res, 401, { error: 'Неверные учетные данные' });
      }

      const token = createSession(username);
      return sendJson(res, 200, { token, username });
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }
  }

  if (url.pathname === '/api/levels' && req.method === 'POST') {
    const username = getAuthUser(req);
    if (!username) {
      return sendJson(res, 401, { error: 'Требуется авторизация' });
    }

    try {
      const { title, description, data } = await parseBody(req);
      if (!title || !description || !data) {
        return sendJson(res, 400, { error: 'title, description и data обязательны' });
      }

      const level = {
        id: `lvl_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        title,
        description,
        data,
        author: username,
        createdAt: new Date().toISOString(),
      };
      levels.unshift(level);
      return sendJson(res, 201, { level });
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }
  }

  if (url.pathname === '/api/levels' && req.method === 'GET') {
    return sendJson(res, 200, {
      levels: levels.map(({ id, title, description, author, createdAt }) => ({
        id,
        title,
        description,
        author,
        createdAt,
      })),
    });
  }

  if (url.pathname.startsWith('/api/levels/') && req.method === 'GET') {
    const id = url.pathname.split('/').pop();
    const level = levels.find((item) => item.id === id);
    if (!level) {
      return sendJson(res, 404, { error: 'Уровень не найден' });
    }
    return sendJson(res, 200, { level });
  }

  if (url.pathname.startsWith('/api/')) {
    return sendJson(res, 404, { error: 'API route not found' });
  }

  return serveStatic(req, res, url.pathname);
});

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
