/**
 * 蓉城企服 - API 代理服务器（仅用于本地开发）
 *
 * 安全说明：
 * - 默认仅监听 127.0.0.1（回环），不暴露到局域网，避免他人借本机代理直达后端 API。
 * - 若确需在真机预览时让手机访问，请显式设置环境变量 HOST=0.0.0.0，且只在可信 WiFi 下临时运行，
 *   切勿在公网 / 共享网络 / 生产环境使用该代理。生产环境客户端应直连 HTTPS 后端。
 * - 本代理不做鉴权，仅用于本地开发；任何对外暴露都必须自行加防护。
 */

const http = require('http');
const { URL } = require('url');

const PORT = process.env.PROXY_PORT || 7890;
const BACKEND_HOST = process.env.BACKEND_HOST || '127.0.0.1';
const BACKEND_PORT = process.env.BACKEND_PORT || 3001;
// 安全默认：仅回环；需局域网时在可信网络下用 HOST=0.0.0.0 显式开启
const LISTEN_HOST = process.env.HOST || '127.0.0.1';
if (LISTEN_HOST === '0.0.0.0') {
  console.warn('[安全警告] 代理已绑定 0.0.0.0，仅在可信局域网下临时使用，切勿暴露于公网/生产！');
}

const REQ_TIMEOUT = 15000;

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const targetPath = urlObj.pathname + urlObj.search;
  const targetUrl = `http://${BACKEND_HOST}:${BACKEND_PORT}${targetPath}`;

  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${targetPath}`);

  const proxyReq = http.request(targetUrl, {
    method: req.method,
    headers: { ...req.headers, host: `${BACKEND_HOST}:${BACKEND_PORT}` },
    timeout: REQ_TIMEOUT,
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    if (!res.headersSent) {
      res.writeHead(504, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ statusCode: 504, message: '代理请求超时' }));
    }
  });

  proxyReq.on('error', (err) => {
    console.error(`代理请求失败: ${err.message}`);
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ statusCode: 502, message: '代理服务器错误' }));
    }
  });

  req.pipe(proxyReq);
});

server.listen(PORT, LISTEN_HOST, () => {
  console.log(`[启动成功] 代理服务器监听 ${LISTEN_HOST}:${PORT}`);
  console.log(`[转发目标] http://${BACKEND_HOST}:${BACKEND_PORT}`);
});
