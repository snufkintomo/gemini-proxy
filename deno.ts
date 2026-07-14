const DEEPAI_API_HOST = "generativelanguage.googleapis.com";

Deno.serve(async (request) => {
  const url = new URL(request.url);

  // Serve Homepage
  if (url.pathname === "/") {
    try {
      const readmeUrl = new URL("./Readme.md", import.meta.url);
      if (readmeUrl.protocol === "file:") {
        const text = await Deno.readTextFile(readmeUrl);
        return new Response(text, { headers: { "content-type": "text/markdown; charset=utf-8" } });
      } else {
        const res = await fetch(readmeUrl);
        if (res.ok) {
          return new Response(await res.text(), { headers: { "content-type": "text/markdown; charset=utf-8" } });
        }
      }
    } catch {
      // Ignore error and fall through to fallback HTML page
    }

    return new Response(
      `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Google Gemini 免翻墙代理</title>
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
    h1 { color: #1a73e8; margin-top: 0; }
    code { background: #f1f3f4; padding: 3px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
    pre { background: #f1f3f4; padding: 15px; border-radius: 8px; overflow-x: auto; }
    a { color: #1a73e8; text-decoration: none; }
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
    <div class="status">✓ Running / 运行中</div>
    <h1>Google Gemini 免翻墙代理</h1>
    <p>您的 Google Gemini API 代理服务已成功在 Deno Deploy 上运行！</p>
    <p><strong>使用方法：</strong></p>
    <p>在您的 API 客户端或代码中，将官方域名 <code>generativelanguage.googleapis.com</code> 替换为您的代理服务域名即可。</p>
    <p>例如，将：<br><code>https://generativelanguage.googleapis.com/v1beta/models/...</code></p>
    <p>替换为：<br><code>https://${url.host}/v1beta/models/...</code></p>
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
});
