#!/usr/bin/env node
/**
 * Fix YAML round-trip: force created_at to string, input_variables.example to string
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { stringify as yamlStringify } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const skillsDir = join(rootDir, 'skills');

function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory() && !e.startsWith('.')) walk(p, acc);
    else if (e.endsWith('.zh.skill.md') || e.endsWith('.en.skill.md')) acc.push(p);
  }
  return acc;
}

function normalize(data) {
  const v = data.created_at;
  let out = null;
  if (v instanceof Date) {
    out = v.toISOString().slice(0, 10);
  } else if (v != null) {
    const s = String(v);
    const m = s.match(/(\d{4}-\d{2}-\d{2})/);
    out = m ? m[1] : null;
  }
  data.created_at = /^\d{4}-\d{2}-\d{2}$/.test(out || '') ? out : '2025-01-01';
  if (data.input_variables && Array.isArray(data.input_variables)) {
    for (const iv of data.input_variables) {
      if (iv.example != null && typeof iv.example !== 'string') {
        iv.example = String(iv.example);
      }
    }
  }
  return data;
}

for (const abs of walk(skillsDir)) {
  const raw = readFileSync(abs, 'utf8');
  const { data, content } = matter(raw);
  normalize(data);
  let fm = yamlStringify(data).trimEnd();
  // Unquoted YYYY-MM-DD is parsed as Date on re-read; force quoted string in YAML output
  fm = fm.replace(/^(\s*)created_at:\s*(\d{4}-\d{2}-\d{2})\s*$/gm, '$1created_at: "$2"');
  writeFileSync(abs, `---\n${fm}\n---\n${content}`, 'utf8');
}
console.log('Fixed YAML types in locale skill files.');
