import fs from "node:fs";
import path from "node:path";
import { pdf } from "@react-pdf/renderer";
import CvPdfDocument from "../src/cv/pdf/CvPdfDocument";
import { cv } from "../src/cv/cv";
import type { Cv } from "../src/cv/types";

// Usage:
//   npm run cv:pdf                                   → public/TaniaPapazafeiropoulou-CV.pdf from src/cv/cv.ts
//   npm run cv:pdf -- --json tailored.json --out ~/Downloads/CV-Linear.pdf
//
// --json renders a tailored CV (same shape as src/cv/cv.ts) instead of the
// site CV. Contact details always come from src/cv/cv.ts so a tailored copy
// can't get them wrong. --out is required with --json, so a tailored CV never
// replaces the public one.
function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

function loadCv(): { data: Cv; outputPath: string } {
  const jsonPath = arg("json");
  const outPath = arg("out");
  if (!jsonPath) {
    return {
      data: cv,
      outputPath: path.join(process.cwd(), "public", "TaniaPapazafeiropoulou-CV.pdf"),
    };
  }
  if (!outPath) throw new Error("--out is required when using --json");
  const tailored = JSON.parse(fs.readFileSync(jsonPath, "utf8")) as Cv;
  return {
    data: {
      ...tailored,
      header: {
        ...tailored.header,
        name: cv.header.name,
        email: cv.header.email,
        website: cv.header.website,
      },
    },
    outputPath: path.resolve(outPath),
  };
}

async function toNodeBuffer(value: unknown): Promise<Buffer> {
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) return Buffer.from(value);

  // Web ReadableStream
  if (
    value &&
    typeof value === "object" &&
    typeof (value as any).getReader === "function"
  ) {
    const reader = (value as any).getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value: chunk } = await reader.read();
      if (done) break;
      if (chunk) chunks.push(chunk);
    }
    return Buffer.concat(chunks.map((c) => Buffer.from(c)));
  }

  // Node stream (pdfkit PDFDocument etc.)
  if (
    value &&
    typeof value === "object" &&
    typeof (value as any).on === "function" &&
    typeof (value as any).pipe === "function"
  ) {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const stream = value as any;

      stream.on("data", (c: Buffer | Uint8Array) => {
        chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c));
      });
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", (err: unknown) => {
        reject(err instanceof Error ? err : new Error(String(err)));
      });
    });
  }

  throw new Error(
    `Unsupported PDF output type: ${Object.prototype.toString.call(value)}`
  );
}

async function main() {
  const { data, outputPath } = loadCv();

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const instance = pdf(<CvPdfDocument cv={data} />);
  const output = await instance.toBuffer();
  const buffer = await toNodeBuffer(output);
  fs.writeFileSync(outputPath, buffer);

  console.log(`Generated: ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
