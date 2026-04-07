/**
 * Regenerate tools/_examples_raw.json for use with pack_example_map.mjs
 * (CJK-only examples from *.en.skill.md frontmatter).
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const skillsDir = join(rootDir, 'skills');
const hasCJK = (s) => /[\u4e00-\u9fff]/.test(String(s));

function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory() && !e.startsWith('.')) walk(p, acc);
    else if (e.endsWith('.en.skill.md')) acc.push(p);
  }
  return acc;
}

const rows = [];
for (const p of walk(skillsDir)) {
  const { data } = matter(readFileSync(p, 'utf8'));
  const id = data.id;
  for (const iv of data.input_variables || []) {
    const ex = iv.example;
    if (ex != null && hasCJK(ex)) {
      rows.push({ id, name: iv.name, example: String(ex) });
    }
  }
}
writeFileSync(join(__dirname, '_examples_raw.json'), JSON.stringify(rows, null, 2), 'utf8');
console.log('Wrote tools/_examples_raw.json', rows.length, 'rows');
