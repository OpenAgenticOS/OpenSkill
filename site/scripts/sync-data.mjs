import { copyFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, "../../dist");
const pub = resolve(__dirname, "../public");

mkdirSync(pub, { recursive: true });
for (const f of ["openskill.en.json", "openskill.zh.json"]) {
  copyFileSync(resolve(dist, f), resolve(pub, f));
  console.log(`Copied ${f} -> site/public/${f}`);
}
