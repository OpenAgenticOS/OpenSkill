#!/usr/bin/env node
/**
 * Export all skills to dist/openskill.json, openskill.zh.json, openskill.en.json
 * Locale-per-file: pair by id from *.zh.skill.md + *.en.skill.md
 */

import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import matter from 'gray-matter';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {
  extractSystemPrompt,
  extractUserPromptTemplate,
  extractOutputExample,
  extractRelatedSkills,
  resolvePersonaZh,
  resolvePersonaEn,
  resolveObjectiveZh,
  resolveObjectiveEn,
  resolveStyleZh,
  resolveStyleEn,
  resolveToneZh,
  resolveToneEn,
  resolveAudienceZh,
  resolveAudienceEn,
  resolveOutputFormatZh,
  resolveOutputFormatEn,
  resolveSystemPromptZh,
  resolveSystemPromptEn,
} from './skill_locale.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const schemaPath = join(rootDir, 'schema', 'skill.schema.json');
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validateFm = ajv.compile(schema);

function findLocaleSkillFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory() && !entry.startsWith('.')) {
      files.push(...findLocaleSkillFiles(fullPath));
    } else if (entry.endsWith('.skill.md') && (entry.includes('.zh.') || entry.includes('.en.'))) {
      files.push(fullPath);
    }
  }
  return files;
}

function sha256Short(buf) {
  return createHash('sha256').update(buf).digest('hex').slice(0, 16);
}

function baseMeta(data, relPath, raw) {
  return {
    id: data.id,
    name: data.name,
    version: data.version,
    category: data.category,
    tags: data.tags,
    locale: data.locale,
    input_variables: data.input_variables,
    compatible_models: data.compatible_models,
    language: data.language,
    difficulty: data.difficulty,
    estimated_time: data.estimated_time,
    author: data.author,
    created_at: data.created_at,
    quality_score: data.quality_score,
    mcp_tool_name: data.mcp_tool_name,
    translation_status: data.translation_status,
    source_path: relPath,
    content_sha256: sha256Short(raw),
  };
}

function skillRecordLocale(data, relPath, raw, extracted, locale) {
  const sp =
    locale === 'zh'
      ? resolveSystemPromptZh(data, extracted)
      : resolveSystemPromptEn(data, extracted);
  return {
    ...baseMeta(data, relPath, raw),
    persona: locale === 'zh' ? resolvePersonaZh(data) : resolvePersonaEn(data),
    objective: locale === 'zh' ? resolveObjectiveZh(data) : resolveObjectiveEn(data),
    style: locale === 'zh' ? resolveStyleZh(data) : resolveStyleEn(data),
    tone: locale === 'zh' ? resolveToneZh(data) : resolveToneEn(data),
    audience: locale === 'zh' ? resolveAudienceZh(data) : resolveAudienceEn(data),
    output_format: locale === 'zh' ? resolveOutputFormatZh(data) : resolveOutputFormatEn(data),
    system_prompt: sp,
    user_prompt_template: extractUserPromptTemplate(raw),
    output_example: extractOutputExample(raw),
    related_skills: extractRelatedSkills(raw, data.id),
  };
}

function skillRecordMerged(zhData, enData, zhPath, enPath, zhRaw, enRaw, zhEx, enEx) {
  const primary = zhData;
  const zhSp = resolveSystemPromptZh(zhData, zhEx);
  const enSp = resolveSystemPromptEn(enData, enEx);
  const bm = baseMeta(primary, zhPath, zhRaw);
  delete bm.locale;
  return {
    ...bm,
    language: 'zh-en',
    locales: ['zh', 'en'],
    source_path: zhPath,
    source_path_en: enPath,
    persona: `${resolvePersonaZh(zhData)}\n\n---\n\n${resolvePersonaEn(enData)}`,
    objective: `${resolveObjectiveZh(zhData)}\n\n---\n\n${resolveObjectiveEn(enData)}`,
    style: `${resolveStyleZh(zhData)}\n\n---\n\n${resolveStyleEn(enData)}`,
    tone: `${resolveToneZh(zhData)}\n\n---\n\n${resolveToneEn(enData)}`,
    audience: `${resolveAudienceZh(zhData)}\n\n---\n\n${resolveAudienceEn(enData)}`,
    output_format: `${resolveOutputFormatZh(zhData)}\n\n---\n\n${resolveOutputFormatEn(enData)}`,
    persona_zh: resolvePersonaZh(zhData),
    persona_en: resolvePersonaEn(enData),
    objective_zh: resolveObjectiveZh(zhData),
    objective_en: resolveObjectiveEn(enData),
    style_zh: resolveStyleZh(zhData),
    style_en: resolveStyleEn(enData),
    tone_zh: resolveToneZh(zhData),
    tone_en: resolveToneEn(enData),
    audience_zh: resolveAudienceZh(zhData),
    audience_en: resolveAudienceEn(enData),
    output_format_zh: resolveOutputFormatZh(zhData),
    output_format_en: resolveOutputFormatEn(enData),
    system_prompt_zh: zhSp,
    system_prompt_en: enSp,
    system_prompt: zhEx || zhSp || enEx || enSp,
    name_zh: zhData.name,
    name_en: enData.name,
  };
}

function main() {
  const skillsDir = join(rootDir, 'skills');
  const files = findLocaleSkillFiles(skillsDir);
  if (files.length === 0) {
    console.error('No locale skill files (*.zh.skill.md / *.en.skill.md) under skills/');
    process.exit(1);
  }

  const outDir = join(rootDir, 'dist');
  mkdirSync(outDir, { recursive: true });

  const repo =
    process.env.GITHUB_REPOSITORY ||
    process.env.OPENSKILL_REPOSITORY ||
    'OpenAgenticOS/OpenSkill';
  const ref =
    process.env.GITHUB_REF_NAME ||
    process.env.GITHUB_REF?.replace(/^refs\/(heads|tags)\//, '') ||
    'local';

  const byId = new Map();

  for (const filePath of files.sort((a, b) => relative(rootDir, a).localeCompare(relative(rootDir, b)))) {
    const relPath = relative(rootDir, filePath).replace(/\\/g, '/');
    const raw = readFileSync(filePath, 'utf8');
    let parsed;
    try {
      parsed = matter(raw);
    } catch (e) {
      console.error(`[export-skills] ${relPath}: invalid frontmatter — ${e.message}`);
      process.exit(1);
    }
    if (!parsed.data || Object.keys(parsed.data).length === 0) {
      console.error(`[export-skills] ${relPath}: empty frontmatter`);
      process.exit(1);
    }
    if (!validateFm(parsed.data)) {
      const msgs = (validateFm.errors || []).map((err) => {
        const field = err.instancePath.replace(/^\//, '') || err.params?.missingProperty || 'root';
        return `${field}: ${err.message}`;
      });
      console.error(`[export-skills] ${relPath}: schema — ${msgs.join('; ')}`);
      process.exit(1);
    }

    const { data } = parsed;
    const id = data.id;
    const extracted = extractSystemPrompt(raw);
    const spZh = resolveSystemPromptZh(data, extracted);
    const spEn = resolveSystemPromptEn(data, extracted);
    if (!spZh || !spEn) {
      console.error(
        `[export-skills] ${relPath}: missing system prompt (fenced block under ## System Prompt / ## 系统提示词)`
      );
      process.exit(1);
    }

    const locale = data.locale;
    if (!byId.has(id)) byId.set(id, {});
    const slot = byId.get(id);
    if (locale === 'zh') {
      slot.zh = { data, relPath, raw, extracted };
    } else if (locale === 'en') {
      slot.en = { data, relPath, raw, extracted };
    } else {
      console.error(`[export-skills] ${relPath}: invalid locale ${locale}`);
      process.exit(1);
    }
  }

  const skillsFull = [];
  const skillsZh = [];
  const skillsEn = [];
  const errors = [];

  for (const [id, slot] of [...byId.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    if (!slot.zh) errors.push(`Missing zh locale file for id: ${id}`);
    if (!slot.en) errors.push(`Missing en locale file for id: ${id}`);
    if (slot.zh && slot.en) {
      skillsFull.push(
        skillRecordMerged(
          slot.zh.data,
          slot.en.data,
          slot.zh.relPath,
          slot.en.relPath,
          slot.zh.raw,
          slot.en.raw,
          slot.zh.extracted,
          slot.en.extracted
        )
      );
      skillsZh.push(skillRecordLocale(slot.zh.data, slot.zh.relPath, slot.zh.raw, slot.zh.extracted, 'zh'));
      skillsEn.push(skillRecordLocale(slot.en.data, slot.en.relPath, slot.en.raw, slot.en.extracted, 'en'));
    }
  }

  if (errors.length > 0) {
    console.error('[export-skills] Failed:\n' + errors.join('\n'));
    process.exit(1);
  }

  const sortFn = (a, b) => a.id.localeCompare(b.id);
  skillsFull.sort(sortFn);
  skillsZh.sort(sortFn);
  skillsEn.sort(sortFn);

  const basePayload = {
    format_version: 3,
    generated_at: new Date().toISOString(),
    repository: repo,
    repository_owner: repo.includes('/') ? repo.split('/')[0] : repo,
    ref,
    license: 'MIT',
    license_url: `https://raw.githubusercontent.com/${repo}/master/LICENSE`,
    skills_count: skillsFull.length,
  };

  writeFileSync(join(outDir, 'openskill.json'), JSON.stringify({ ...basePayload, skills: skillsFull }, null, 2) + '\n', 'utf8');
  writeFileSync(
    join(outDir, 'openskill.zh.json'),
    JSON.stringify({ ...basePayload, locale: 'zh', skills: skillsZh }, null, 2) + '\n',
    'utf8'
  );
  writeFileSync(
    join(outDir, 'openskill.en.json'),
    JSON.stringify({ ...basePayload, locale: 'en', skills: skillsEn }, null, 2) + '\n',
    'utf8'
  );

  console.log(
    `[export-skills] Wrote dist/openskill.json, openskill.zh.json, openskill.en.json (${skillsFull.length} skills, ref=${ref}, format_version=3)`
  );
}

main();
