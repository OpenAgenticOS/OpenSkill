#!/usr/bin/env node
/**
 * Export all skills to dist/openskill.json, openskill.zh.json, openskill.en.json
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

function findSkillFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory() && !entry.startsWith('.')) {
      files.push(...findSkillFiles(fullPath));
    } else if (entry.endsWith('.skill.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function sha256Short(buf) {
  return createHash('sha256').update(buf).digest('hex').slice(0, 16);
}

function baseMeta(data, relPath, raw, extracted) {
  return {
    id: data.id,
    name: data.name,
    version: data.version,
    category: data.category,
    tags: data.tags,
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

function skillRecordFull(data, relPath, raw, extracted) {
  return {
    ...baseMeta(data, relPath, raw, extracted),
    persona: data.persona,
    objective: data.objective,
    style: data.style,
    tone: data.tone,
    audience: data.audience,
    output_format: data.output_format,
    persona_zh: data.persona_zh,
    persona_en: data.persona_en,
    objective_zh: data.objective_zh,
    objective_en: data.objective_en,
    style_zh: data.style_zh,
    style_en: data.style_en,
    tone_zh: data.tone_zh,
    tone_en: data.tone_en,
    audience_zh: data.audience_zh,
    audience_en: data.audience_en,
    output_format_zh: data.output_format_zh,
    output_format_en: data.output_format_en,
    system_prompt_zh: data.system_prompt_zh,
    system_prompt_en: data.system_prompt_en,
    system_prompt: extracted || resolveSystemPromptZh(data, extracted) || resolveSystemPromptEn(data, extracted),
  };
}

function skillRecordZh(data, relPath, raw, extracted) {
  const sp = resolveSystemPromptZh(data, extracted);
  return {
    ...baseMeta(data, relPath, raw, extracted),
    persona: resolvePersonaZh(data),
    objective: resolveObjectiveZh(data),
    style: resolveStyleZh(data),
    tone: resolveToneZh(data),
    audience: resolveAudienceZh(data),
    output_format: resolveOutputFormatZh(data),
    system_prompt: sp,
  };
}

function skillRecordEn(data, relPath, raw, extracted) {
  const sp = resolveSystemPromptEn(data, extracted);
  return {
    ...baseMeta(data, relPath, raw, extracted),
    persona: resolvePersonaEn(data),
    objective: resolveObjectiveEn(data),
    style: resolveStyleEn(data),
    tone: resolveToneEn(data),
    audience: resolveAudienceEn(data),
    output_format: resolveOutputFormatEn(data),
    system_prompt: sp,
  };
}

function main() {
  const skillsDir = join(rootDir, 'skills');
  const files = findSkillFiles(skillsDir);
  if (files.length === 0) {
    console.error('No .skill.md files under skills/');
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

  const skillsFull = [];
  const skillsZh = [];
  const skillsEn = [];
  const errors = [];

  for (const filePath of files.sort((a, b) => relative(rootDir, a).localeCompare(relative(rootDir, b)))) {
    const relPath = relative(rootDir, filePath).replace(/\\/g, '/');
    const raw = readFileSync(filePath, 'utf8');
    let parsed;
    try {
      parsed = matter(raw);
    } catch (e) {
      errors.push(`${relPath}: invalid frontmatter — ${e.message}`);
      continue;
    }
    if (!parsed.data || Object.keys(parsed.data).length === 0) {
      errors.push(`${relPath}: empty frontmatter`);
      continue;
    }
    if (!validateFm(parsed.data)) {
      const msgs = (validateFm.errors || []).map((err) => {
        const field = err.instancePath.replace(/^\//, '') || err.params?.missingProperty || 'root';
        return `${field}: ${err.message}`;
      });
      errors.push(`${relPath}: schema — ${msgs.join('; ')}`);
      continue;
    }

    const { data } = parsed;
    const extracted = extractSystemPrompt(raw);
    const spZh = resolveSystemPromptZh(data, extracted);
    const spEn = resolveSystemPromptEn(data, extracted);
    if (!spZh || !spEn) {
      errors.push(`${relPath}: missing system prompt (fenced block or system_prompt_zh/system_prompt_en)`);
      continue;
    }

    skillsFull.push(skillRecordFull(data, relPath, raw, extracted));
    skillsZh.push(skillRecordZh(data, relPath, raw, extracted));
    skillsEn.push(skillRecordEn(data, relPath, raw, extracted));
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
    format_version: 2,
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
    `[export-skills] Wrote dist/openskill.json, openskill.zh.json, openskill.en.json (${skillsFull.length} skills, ref=${ref})`
  );
}

main();
