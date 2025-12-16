import { chromium } from "playwright";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { once } from "node:events";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";

const DEFAULT_PORT = 3005;

function isServerUp(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode != null && res.statusCode >= 200 && res.statusCode < 500);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(url: string, timeoutMs = 30_000) {
  const start = Date.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (await isServerUp(url)) return;
    if (Date.now() - start > timeoutMs) {
      throw new Error(`Timed out waiting for Next.js at ${url}`);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
}

function startDevServer(port: number): ChildProcessWithoutNullStreams {
  const child = spawn("npm", ["run", "dev", "--", "-p", String(port)], {
    stdio: "pipe",
    env: { ...process.env, PORT: String(port) },
  });

  child.stdout.on("data", (d) => process.stdout.write(d));
  child.stderr.on("data", (d) => process.stderr.write(d));

  return child;
}

async function main() {
  const port = Number(process.env.CV_PORT || DEFAULT_PORT);
  const baseUrl = `http://localhost:${port}`;
  const cvUrl = `${baseUrl}/cv?print=1`;

  let server: ChildProcessWithoutNullStreams | null = null;

  if (!(await isServerUp(cvUrl))) {
    server = startDevServer(port);
    await waitForServer(cvUrl);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });

  await page.goto(cvUrl, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });

  const outputPath = path.join(process.cwd(), "public", "TaniaPapazafeiropoulou-CV.pdf");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
    preferCSSPageSize: true,
  });

  await browser.close();

  if (server) {
    server.kill();
    await Promise.race([once(server, "exit"), new Promise((r) => setTimeout(r, 1500))]);
  }

  // eslint-disable-next-line no-console
  console.log(`Generated: ${outputPath}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
