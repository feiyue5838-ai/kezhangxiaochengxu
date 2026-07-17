/**
 * 蓉城企服 - API 代理服务器
 * 解决微信模拟器无法访问 127.0.0.1 的问题
 * 监听 0.0.0.0:7890，将请求转发到后端 127.0.0.1:3001
 */

const http = require('http');
const { URL } = require('url');

const PORT = 7890;
const BACKEND_HOST = '127.0.0.1';
const BACKEND_PORT = 3001;

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  
  // 目标地址
  const targetPath = urlObj.pathname + urlObj.search;
  const targetUrl = `http://${BACKEND_HOST}:${BACKEND_PORT}${targetPath}`;

  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${targetPath}`);

  const proxyReq = http.request(targetUrl, {
    method: req.method,
    headers: {
      ...req.headers,
      host: `${BACKEND_HOST}:${BACKEND_PORT}`,
    },
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  req.pipe(proxyReq);
  proxyReq.on('error', (err) => {
    console.error(`代理请求失败: ${err.message}`);
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ statusCode: 502, message: '代理服务器错误' }));
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[启动成功] 代理服务器监听 0.0.0.0:${PORT}`);
  console.log(`[转发目标] http://${BACKEND_HOST}:${BACKEND_PORT}`);
});
