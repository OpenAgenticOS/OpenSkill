import { copyFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, "../../dist");
const pub = resolve(__dirname, "../public");

mkdirSync(pub, { recursive: true });
for (const f of [
  "openskill.en.json",
  "openskill.zh.json",
  "openskill.workflows.json",
  "openskill.recipes.json",
  "openskill.progressive.json",
  "openskill.mcp-resources.json",
]) {
  const src = resolve(dist, f);
  if (!existsSync(src)) {
    console.warn(`Skip missing ${f} (run npm run export at repo root)`);
    continue;
  }
  copyFileSync(src, resolve(pub, f));
  console.log(`Copied ${f} -> site/public/${f}`);
}
