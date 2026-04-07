#!/usr/bin/env node
/**
 * Replace ## Output Example section (through ## Evaluation Log) using tools/backfill_examples.json
 * or tools/backfill_examples_seed.cjs when JSON is absent.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const require = createRequire(import.meta.url);

function loadEntries() {
  const jsonPath = join(__dirname, 'backfill_examples.json');
  if (existsSync(jsonPath)) {
    const raw = JSON.parse(readFileSync(jsonPath, 'utf8'));
    return Array.isArray(raw) ? raw : raw.examples;
  }
  return require('./backfill_examples_seed.cjs');
}

function skillFilePath(id, locale) {
  const parts = id.split('/');
  const slug = parts[parts.length - 1];
  const rel = [...parts.slice(0, -1), `${slug}.${locale}.skill.md`];
  return join(rootDir, 'skills', ...rel);
}

function patchFile(absPath, body, locale) {
  let s = readFileSync(absPath, 'utf8');
  if (locale === 'zh') {
    const startZh = s.indexOf('## 输出示例');
    const startEn = s.indexOf('## Output Example');
    const start = startZh !== -1 ? startZh : startEn !== -1 ? startEn : -1;
    const endEvalZh = s.indexOf('\n## 评估记录', start);
    const endEvalEn = s.indexOf('\n## Evaluation Log', start);
    const ends = [endEvalZh, endEvalEn].filter((i) => i !== -1).sort((a, b) => a - b);
    const end = ends[0];
    if (start === -1 || end === -1 || end <= start) {
      throw new Error(`Missing 输出示例/Output Example → 评估记录/Evaluation Log span: ${absPath}`);
    }
    const heading = startZh !== -1 ? '## 输出示例' : '## Output Example';
    const before = s.slice(0, start);
    const after = s.slice(end);
    s = `${before}${heading}\n\n${body.trim()}\n${after}`;
  } else {
    const start = s.indexOf('## Output Example');
    const end = s.indexOf('\n## Evaluation Log', start);
    if (start === -1 || end === -1 || end <= start) {
      throw new Error(`Missing Output Example → Evaluation Log span: ${absPath}`);
    }
    const before = s.slice(0, start);
    const after = s.slice(end);
    s = `${before}## Output Example\n\n${body.trim()}\n${after}`;
  }
  writeFileSync(absPath, s, 'utf8');
}

function main() {
  const entries = loadEntries();
  for (const row of entries) {
    if (!row.id || !row.output_example_en || !row.output_example_zh) {
      throw new Error(`Invalid backfill row: ${JSON.stringify(row)}`);
    }
    const enPath = skillFilePath(row.id, 'en');
    const zhPath = skillFilePath(row.id, 'zh');
    patchFile(enPath, row.output_example_en, 'en');
    patchFile(zhPath, row.output_example_zh, 'zh');
    process.stdout.write(`patched ${row.id}\n`);
  }
  process.stdout.write(`Done. ${entries.length} skills (en+zh).\n`);
}

main();
