#!/usr/bin/env node
/**
 * Export all skills to dist/openskill.json for releases and integrations.
 * Parses YAML frontmatter (JSON Schema) and extracts the first fenced block
 * after the system-prompt heading (same convention as validate.js).
 */

import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import matter from 'gray-matter';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const schemaPath = join(rootDir, 'schema', 'skill.schema.json');
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validateFm = ajv.compile(schema);

const SYSTEM_PROMPT_HEADINGS = [
  '## 系统提示词 · System Prompt',
  '## 系统提示词',
  '## System Prompt',
];

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

/** First ```…``` body after the earliest system-prompt heading (optional fence lang line). */
function extractSystemPrompt(raw) {
  let bestIdx = -1;
  let bestLen = 0;
  for (const h of SYSTEM_PROMPT_HEADINGS) {
    const i = raw.indexOf(h);
    if (i !== -1 && (bestIdx === -1 || i < bestIdx)) {
      bestIdx = i;
      bestLen = h.length;
    }
  }
  if (bestIdx === -1) return null;
  let rest = raw.slice(bestIdx + bestLen);
  const open = rest.indexOf('```');
  if (open === -1) return null;
  let body = rest.slice(open + 3);
  const nl = body.indexOf('\n');
  if (nl !== -1) {
    const first = body.slice(0, nl).trim();
    if (/^[a-zA-Z][\w-]*$/.test(first) && first.length < 48) {
      body = body.slice(nl + 1);
    }
  }
  const close = body.indexOf('```');
  if (close === -1) return null;
  return body.slice(0, close).trim();
}

function sha256Short(buf) {
  return createHash('sha256').update(buf).digest('hex').slice(0, 16);
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

  const skills = [];
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
    const system_prompt = extractSystemPrompt(raw);
    if (!system_prompt) {
      errors.push(`${relPath}: no system prompt fenced block after heading`);
      continue;
    }

    const { data } = parsed;
    skills.push({
      id: data.id,
      name: data.name,
      version: data.version,
      category: data.category,
      tags: data.tags,
      persona: data.persona,
      objective: data.objective,
      style: data.style,
      tone: data.tone,
      audience: data.audience,
      output_format: data.output_format,
      input_variables: data.input_variables,
      compatible_models: data.compatible_models,
      language: data.language,
      difficulty: data.difficulty,
      estimated_time: data.estimated_time,
      author: data.author,
      created_at: data.created_at,
      quality_score: data.quality_score,
      mcp_tool_name: data.mcp_tool_name,
      source_path: relPath,
      system_prompt,
      content_sha256: sha256Short(raw),
    });
  }

  if (errors.length > 0) {
    console.error('[export-skills] Failed:\n' + errors.join('\n'));
    process.exit(1);
  }

  skills.sort((a, b) => a.id.localeCompare(b.id));

  const payload = {
    format_version: 1,
    generated_at: new Date().toISOString(),
    repository: repo,
    repository_owner: repo.includes('/') ? repo.split('/')[0] : repo,
    ref,
    license: 'MIT',
    license_url: `https://raw.githubusercontent.com/${repo}/master/LICENSE`,
    skills_count: skills.length,
    skills,
  };

  const outFile = join(outDir, 'openskill.json');
  writeFileSync(outFile, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log(`[export-skills] Wrote ${outFile} (${skills.length} skills, ref=${ref})`);
}

main();
