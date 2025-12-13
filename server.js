const express = require("express");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use((req, res, next) => {
    const hostname =
      req.hostname === "www.tany4.com" ? "tany4.com" : req.hostname;
    if (
      req.headers["x-forwarded-proto"] === "http" ||
      req.hostname === "www.tany4.com"
    ) {
      res.redirect(301, `https://${hostname}${req.url}`);
      return;
    }

    if (
      req.path.startsWith("/_next/static/") ||
      /\.(png|jpg|jpeg|gif|webp|svg|ico|pdf)$/i.test(req.path)
    ) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.setHeader("Expires", "Thu, 31 Dec 2099 23:59:59 GMT");
    }

    res.setHeader(
      "strict-transport-security",
      "max-age=31536000; includeSubDomains; preload"
    );
    next();
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
