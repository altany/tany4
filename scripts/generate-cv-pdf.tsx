import fs from "node:fs";
import path from "node:path";
import { pdf } from "@react-pdf/renderer";
import CvPdfDocument from "../src/cv/pdf/CvPdfDocument";
import { cv } from "../src/cv/cv";

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
  const outputPath = path.join(
    process.cwd(),
    "public",
    "TaniaPapazafeiropoulou-CV.pdf"
  );

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const instance = pdf(<CvPdfDocument cv={cv} />);
  const output = await instance.toBuffer();
  const buffer = await toNodeBuffer(output);
  fs.writeFileSync(outputPath, buffer);

  console.log(`Generated: ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
