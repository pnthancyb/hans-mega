import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = reqUrl.pathname;

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    // API endpoint: list providers
    if (pathname === "/api/providers") {
      const manifestData = fs.readFileSync(path.join(__dirname, "manifest.json"), "utf8");
      res.writeHead(200, { "Content-Type": MIME_TYPES[".json"] });
      res.end(manifestData);
      return;
    }

    // API endpoint: test provider
    if (pathname === "/api/test-provider") {
      const providerId = reqUrl.searchParams.get("id") || "hans-35";
      const number = providerId.replace(/^hans-/, "");
      const filePath = path.join(__dirname, "providers", `hans-${number}.js`);

      if (!fs.existsSync(filePath)) {
        res.writeHead(404, { "Content-Type": MIME_TYPES[".json"] });
        res.end(JSON.stringify({ error: `Provider file not found: hans-${number}.js` }));
        return;
      }

      const code = fs.readFileSync(filePath, "utf8");
      const sandboxModule = { exports: {} };
      const context = {
        console: { log: () => {}, warn: () => {}, error: () => {} },
        setTimeout,
        clearTimeout,
        URL,
        fetch: globalThis.fetch,
        module: sandboxModule,
        exports: sandboxModule.exports,
      };
      context.global = context;
      context.globalThis = context;
      vm.createContext(context);
      vm.runInContext(code, context);

      const gs = context.module.exports?.getStreams || context.globalThis.getStreams;
      res.writeHead(200, { "Content-Type": MIME_TYPES[".json"] });
      res.end(JSON.stringify({
        id: providerId,
        hasGetStreams: typeof gs === "function",
        getStreamsExportName: gs?.name || "anonymous",
        moduleExportsKeys: Object.keys(sandboxModule.exports),
      }));
      return;
    }

    // Static file routing
    let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, "");
    if (safePath === "/" || safePath === "/index.html") {
      safePath = "/index.html";
    }

    const filePath = path.join(__dirname, safePath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // Default 404
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Han's Mega Provider server listening on port ${PORT}`);
});
