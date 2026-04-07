#!/usr/bin/env node
/**
 * Split mixed zh/en tags and translate Chinese examples in .en.skill.md per locale plan.
 * Uses tools/locale_tag_map.json + tools/locale_example_map.json
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { stringify as yamlStringify } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const skillsDir = join(rootDir, 'skills');

const tagMapZhToEn = JSON.parse(readFileSync(join(__dirname, 'locale_tag_map.json'), 'utf8'));
/** @type {Record<string, Record<string, string>>} */
const exampleMap = JSON.parse(readFileSync(join(__dirname, 'locale_example_map.json'), 'utf8'));

/** English slug -> Chinese tag */
const tagMapEnToZh = {};
for (const [zh, en] of Object.entries(tagMapZhToEn)) {
  tagMapEnToZh[en] = zh;
}

const hasCJK = (s) => /[\u4e00-\u9fff]/.test(String(s));

function normalizeCreatedAt(data) {
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
}

function stringifyExamples(data) {
  if (data.input_variables && Array.isArray(data.input_variables)) {
    for (const iv of data.input_variables) {
      if (iv.example != null && typeof iv.example !== 'string') {
        iv.example = String(iv.example);
      }
    }
  }
}

/**
 * @param {string[]} tags
 * @param {'en'|'zh'} locale
 */
function processTags(tags, locale) {
  const out = new Set();
  if (!Array.isArray(tags)) return [];
  for (const t of tags) {
    const s = String(t).trim();
    if (!s) continue;
    if (locale === 'en') {
      if (hasCJK(s)) {
        const en = tagMapZhToEn[s];
        if (en) out.add(en);
        else console.warn(`[fix-locale-tags] Unmapped Chinese tag in EN file (dropped): ${s}`);
      } else {
        out.add(s);
      }
    } else {
      if (hasCJK(s)) {
        out.add(s);
      } else {
        const zh = tagMapEnToZh[s];
        if (zh) out.add(zh);
        // else: drop bare English tags from ZH files
      }
    }
  }
  const arr = [...out];
  arr.sort((a, b) => (locale === 'zh' ? a.localeCompare(b, 'zh-CN') : a.localeCompare(b, 'en')));
  return arr;
}

function applyExampleTranslations(data, isEn) {
  if (!isEn || !data.input_variables || !data.id) return;
  const perSkill = exampleMap[data.id];
  if (!perSkill) return;
  for (const iv of data.input_variables) {
    if (iv.example == null || !hasCJK(iv.example)) continue;
    const tr = perSkill[iv.name];
    if (tr) iv.example = tr;
    else console.warn(`[fix-locale-tags] Missing example EN for ${data.id} / ${iv.name}`);
  }
}

function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory() && !e.startsWith('.')) walk(p, acc);
    else if (e.endsWith('.zh.skill.md') || e.endsWith('.en.skill.md')) acc.push(p);
  }
  return acc;
}

let n = 0;
for (const abs of walk(skillsDir)) {
  const isEn = abs.endsWith('.en.skill.md');
  const locale = isEn ? 'en' : 'zh';
  const raw = readFileSync(abs, 'utf8');
  const { data, content } = matter(raw);

  data.tags = processTags(data.tags, locale);
  applyExampleTranslations(data, isEn);
  normalizeCreatedAt(data);
  stringifyExamples(data);

  let fm = yamlStringify(data).trimEnd();
  fm = fm.replace(/^(\s*)created_at:\s*(\d{4}-\d{2}-\d{2})\s*$/gm, '$1created_at: "$2"');
  writeFileSync(abs, `---\n${fm}\n---\n${content}`, 'utf8');
  n++;
}
console.log(`fix_locale_tags_examples: updated ${n} skill files.`);
