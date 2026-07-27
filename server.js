// Tiny zero-dependency static file server.
// This is ONLY used for the live preview. To use the app offline,
// just open index.html directly in your browser (double-click it).
const http = require("http")
const fs = require("fs")
const path = require("path")

const PORT = process.env.PORT || 3000
const ROOT = __dirname

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
}

http
  .createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0])
    if (urlPath === "/") urlPath = "/index.html"
    const filePath = path.join(ROOT, urlPath)

    // prevent path traversal
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403)
      return res.end("Forbidden")
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" })
        return res.end("Not found")
      }
      const ext = path.extname(filePath).toLowerCase()
      res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream" })
      res.end(data)
    })
  })
  .listen(PORT, () => {
    console.log(`[v0] Static server running at http://localhost:${PORT}`)
  })
