export const config = {
  runtime: "edge",
};

const DEEPAI_API_HOST = "generativelanguage.googleapis.com";

export default async function handler(request) {
  const url = new URL(request.url);

  // Serve Homepage
  if (url.pathname === "/") {
    return new Response(
      `<!DOCTYPE html>
<html lang="zh-HK">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Google Gemini 免翻牆代理 (Vercel)</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
      line-height: 1.6;
      color: #333;
      background-color: #f9f9f9;
    }
    .container {
      background: #fff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    h1 { color: #000; margin-top: 0; }
    code { background: #f1f3f4; padding: 3px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
    pre { background: #f1f3f4; padding: 15px; border-radius: 8px; overflow-x: auto; }
    a { color: #0070f3; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .status {
      display: inline-block;
      background: #e6f4ea;
      color: #137333;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.85em;
      font-weight: bold;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="status">✓ Running on Vercel / 運行中</div>
    <h1>Google Gemini 免翻牆代理</h1>
    <p>您的 Google Gemini API 代理服務已成功在 Vercel Edge Networks 上運行！</p>
    <p><strong>使用方法：</strong></p>
    <p>在您的 API 客戶端或程式碼中，將官方域名 <code>generativelanguage.googleapis.com</code> 替換為您的 Vercel 代理服務網址即可。</p>
    <p>例如，將：<br><code>https://generativelanguage.googleapis.com/v1beta/models/...</code></p>
    <p>替換為：<br><code>https://${url.host}/v1beta/models/...</code></p>
  </div>
</body>
</html>`,
      { headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  // Rewrite host to Google Gemini API
  url.host = DEEPAI_API_HOST;

  // Create a new headers object to remove proxy-unsafe headers
  const headers = new Headers(request.headers);
  headers.delete("host");

  // Create proxy request
  const proxyReq = new Request(url, {
    method: request.method,
    headers: headers,
    body: (request.method === "GET" || request.method === "HEAD") ? null : request.body,
    redirect: "manual",
  });

  return await fetch(proxyReq);
}
