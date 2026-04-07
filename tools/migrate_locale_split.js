#!/usr/bin/env node
/**
 * One-time migration: legacy bilingual foo.skill.md -> foo.zh.skill.md + foo.en.skill.md
 * Run from repo root: node tools/migrate_locale_split.js
 */

import { readFileSync, writeFileSync, unlinkSync, readdirSync, statSync } from 'fs';
import { join, dirname, basename, relative } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { stringify as yamlStringify } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const skillsDir = join(rootDir, 'skills');

function hasChinese(s) {
  return /[\u4e00-\u9fff]/.test(s);
}

function walkLegacySkillFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory() && !entry.startsWith('.')) {
      walkLegacySkillFiles(full, acc);
    } else if (entry.endsWith('.skill.md') && !entry.includes('.zh.') && !entry.includes('.en.')) {
      acc.push(full);
    }
  }
  return acc;
}

function splitBilingualField(text) {
  if (text == null) return { zh: '', en: '' };
  const lines = String(text).split('\n');
  const zh = [];
  const en = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (hasChinese(line)) zh.push(line);
    else en.push(line);
  }
  return {
    zh: zh.join('\n').trim(),
    en: en.join('\n').trim(),
  };
}

function splitName(name) {
  const s = String(name).trim();
  const sep = ' · ';
  const i = s.indexOf(sep);
  if (i !== -1) {
    return { zh: s.slice(0, i).trim(), en: s.slice(i + sep.length).trim() };
  }
  return { zh: s, en: s };
}

function splitVarDescription(desc) {
  const s = String(desc);
  const m = s.match(/^(.+?)\s*[·｜|]\s*(.+)$/s);
  if (m) {
    const a = m[1].trim();
    const b = m[2].trim();
    if (hasChinese(a) && !hasChinese(b)) return { zh: a, en: b };
    if (!hasChinese(a) && hasChinese(b)) return { zh: b, en: a };
  }
  return splitBilingualField(s);
}

function mapHeadingLine(line, locale) {
  const m = line.match(/^(##\s+)(.+)$/);
  if (!m) return line;
  const title = m[2].trim();
  if (title.includes(' · ')) {
    const parts = title.split(/\s*·\s*/).map((p) => p.trim());
    const pick = locale === 'zh' ? parts[0] : parts[parts.length - 1];
    return `${m[1]}${pick}`;
  }
  return line;
}

function splitMarkdownBody(body, locale) {
  const lines = body.split('\n');
  const out = [];
  let inFence = false;
  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) {
      const t = line.trim();
      if (!t) {
        out.push(line);
        continue;
      }
      if (locale === 'zh') {
        if (hasChinese(line)) out.push(line);
      } else {
        if (!hasChinese(line) && /[a-zA-Z]/.test(line)) out.push(line);
      }
      continue;
    }
    if (/^##\s/.test(line)) {
      out.push(mapHeadingLine(line, locale));
      continue;
    }
    if (!line.trim()) {
      out.push('');
      continue;
    }
    if (line.trimStart().startsWith('|')) {
      if (hasChinese(line)) {
        if (locale === 'zh') out.push(line);
      } else {
        if (locale === 'en') out.push(line);
      }
      continue;
    }
    if (locale === 'zh') {
      if (hasChinese(line)) out.push(line);
    } else {
      if (!hasChinese(line) && /[a-zA-Z]/.test(line)) out.push(line);
    }
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function stripLegacyKeys(data) {
  const out = { ...data };
  for (const k of Object.keys(out)) {
    if (/_zh$|_en$/.test(k)) delete out[k];
  }
  delete out.language;
  return out;
}

function splitExample(ex, locale) {
  if (ex == null) return ex;
  const s = String(ex);
  if (/\s*\/\s*/.test(s)) {
    const parts = s.split(/\s*\/\s*/);
    if (locale === 'zh') return parts[0].trim();
    return (parts[1] || parts[0]).trim();
  }
  const sp = splitVarDescription(s);
  return sp[locale] || s;
}

function buildLocaleData(base, locale, namePart, costar) {
  const d = stripLegacyKeys(base);
  d.locale = locale;
  d.language = locale === 'zh' ? 'zh' : 'en';
  d.name = namePart || base.name;
  d.persona = costar.persona[locale];
  d.objective = costar.objective[locale];
  d.style = costar.style[locale];
  d.tone = costar.tone[locale];
  d.audience = costar.audience[locale];
  d.output_format = costar.output_format[locale];
  if (base.input_variables && Array.isArray(base.input_variables)) {
    d.input_variables = base.input_variables.map((iv) => {
      const sp = splitVarDescription(iv.description || '');
      return {
        ...iv,
        description: sp[locale] || iv.description,
        example: iv.example != null ? splitExample(iv.example, locale) : iv.example,
      };
    });
  }
  return d;
}

function matterStringify(data, body) {
  const fm = yamlStringify(data).trimEnd();
  return `---\n${fm}\n---\n\n${body}\n`;
}

function migrateFile(absPath) {
  const raw = readFileSync(absPath, 'utf8');
  const { data, content: body } = matter(raw);
  const dir = dirname(absPath);
  const baseName = basename(absPath, '.skill.md');

  const costar = {
    persona: splitBilingualField(data.persona),
    objective: splitBilingualField(data.objective),
    style: splitBilingualField(data.style),
    tone: splitBilingualField(data.tone),
    audience: splitBilingualField(data.audience),
    output_format: splitBilingualField(data.output_format),
  };

  const mins = { persona: 20, objective: 20, style: 10, tone: 5, audience: 5, output_format: 10 };
  for (const k of Object.keys(mins)) {
    const full = String(data[k] || '').trim();
    if (costar[k].zh.length < mins[k]) costar[k].zh = full;
    if (costar[k].en.length < mins[k]) costar[k].en = full;
  }

  const names = splitName(data.name);
  const zhData = buildLocaleData(data, 'zh', names.zh, costar);
  const enData = buildLocaleData(data, 'en', names.en, costar);

  let zhBody = splitMarkdownBody(body.trim(), 'zh');
  let enBody = splitMarkdownBody(body.trim(), 'en');

  zhBody = zhBody.replace(/\.skill\.md\)/g, '.zh.skill.md)');
  enBody = enBody.replace(/\.skill\.md\)/g, '.en.skill.md)');

  const zhPath = join(dir, `${baseName}.zh.skill.md`);
  const enPath = join(dir, `${baseName}.en.skill.md`);

  writeFileSync(zhPath, matterStringify(zhData, zhBody), 'utf8');
  writeFileSync(enPath, matterStringify(enData, enBody), 'utf8');
  unlinkSync(absPath);

  return { zhPath, enPath, id: data.id };
}

function main() {
  const files = walkLegacySkillFiles(skillsDir);
  if (files.length === 0) {
    console.log('No legacy *.skill.md files found (excluding *.zh.* / *.en.*). Nothing to migrate.');
    return;
  }
  console.log(`Migrating ${files.length} legacy skill file(s)...\n`);
  for (const f of files.sort()) {
    const r = migrateFile(f);
    console.log(`${relative(rootDir, f)} -> ${relative(rootDir, r.zhPath)} + ${relative(rootDir, r.enPath)}`);
  }
  console.log('\nDone. Run: npm run validate && npm run export && npm run build-index');
}

main();
