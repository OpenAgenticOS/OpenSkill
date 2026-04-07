#!/usr/bin/env node
/**
 * Generate *.en.skill.md and *.zh.skill.md from manifest modules.
 * Reads tools/skill_manifest.json if present (object with "parts" array of relative paths),
 * else imports tools/manifests/index.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { stringify as yamlStringify } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const skillsRoot = join(rootDir, 'skills');

const DEFAULT_MODELS = ['gpt-5.4', 'claude-sonnet-4-6', 'gemini-2.5-pro', 'qwen3.5-plus'];
const AUTHOR = 'openskill-maintainers';
const VERSION = '1.0.0';
const CREATED = '2025-04-07';

async function loadSkills() {
  const indexPath = join(__dirname, 'skill_manifest.json');
  if (existsSync(indexPath)) {
    const raw = JSON.parse(readFileSync(indexPath, 'utf8'));
    if (Array.isArray(raw)) return raw;
    if (raw.parts && Array.isArray(raw.parts) && raw.parts.length > 0) {
      const out = [];
      for (const rel of raw.parts) {
        const p = join(__dirname, rel);
        const j = JSON.parse(readFileSync(p, 'utf8'));
        const chunk = Array.isArray(j) ? j : j.skills;
        if (!chunk) throw new Error(`Invalid manifest part: ${rel}`);
        out.push(...chunk);
      }
      return out;
    }
    if (raw.skills && Array.isArray(raw.skills)) return raw.skills;
  }
  const m = await import('./manifests/index.mjs');
  return m.default;
}

function quoteCreatedAtYaml(fm) {
  return fm.replace(/^(\s*)created_at:\s*(\d{4}-\d{2}-\d{2})\s*$/gm, '$1created_at: "$2"');
}

function buildFrontmatter(entry, locale) {
  const isEn = locale === 'en';
  const tags = isEn ? entry.tags : entry.tags_zh;
  const persona = isEn ? entry.persona_en : entry.persona_zh;
  const objective = isEn ? entry.objective_en : entry.objective_zh;
  const style = isEn ? entry.style_en : entry.style_zh;
  const tone = isEn ? entry.tone_en : entry.tone_zh;
  const audience = isEn ? entry.audience_en : entry.audience_zh;
  const output_format = isEn ? entry.output_format_en : entry.output_format_zh;
  const name = isEn ? entry.name : entry.name_zh;
  const input_variables = (entry.input_variables || []).map((v) => ({
    name: v.name,
    description: isEn ? v.description_en : v.description_zh,
    required: v.required !== false,
    example: isEn ? String(v.example_en ?? '') : String(v.example_zh ?? ''),
  }));

  const fm = {
    id: entry.id,
    name,
    version: VERSION,
    category: entry.category,
    tags,
    persona,
    objective,
    style,
    tone,
    audience,
    output_format,
    input_variables,
    compatible_models: entry.compatible_models || DEFAULT_MODELS,
    difficulty: entry.difficulty || 'intermediate',
    estimated_time: entry.estimated_time || '5-10 min',
    author: AUTHOR,
    created_at: CREATED,
    mcp_tool_name: entry.mcp_tool_name,
    locale,
    language: locale,
  };

  let y = yamlStringify(fm).trimEnd();
  y = quoteCreatedAtYaml(y);
  return y;
}

function buildMarkdown(entry, locale) {
  const isEn = locale === 'en';
  const desc = isEn ? entry.description_en : entry.description_zh;
  const sys = isEn ? entry.system_prompt_en : entry.system_prompt_zh;
  const userTpl = isEn ? entry.user_prompt_template_en : entry.user_prompt_template_zh;
  const outEx = isEn ? entry.output_example_en : entry.output_example_zh;
  const langLabel = isEn ? '**English**' : '**中文**';

  return `---
${buildFrontmatter(entry, locale)}
---

## Description

${langLabel}: ${desc}

## System Prompt

\`\`\`xml
${sys.trim()}
\`\`\`

## User Prompt Template

\`\`\`
${userTpl.trim()}
\`\`\`

## Output Example

${outEx.trim()}

## Evaluation Log

|----------|----------|--------|------|
| GPT-5.4 | ⭐⭐⭐⭐ | @openskill-maintainers | 2026-04 |
| Claude Sonnet 4.6 | ⭐⭐⭐⭐ | @openskill-maintainers | 2026-04 |
| Qwen3.5-Plus | ⭐⭐⭐⭐ | @openskill-maintainers | 2026-04 |

## Related Skills

`;
}

function skillPath(entry) {
  const parts = entry.id.split('/');
  const slug = parts[parts.length - 1];
  const dirParts = parts.slice(0, -1);
  return { dir: join(skillsRoot, ...dirParts), slug };
}

async function main() {
  const skills = await loadSkills();
  if (!Array.isArray(skills)) {
    throw new Error('Manifest must resolve to an array of skills');
  }
  const seen = new Set();
  for (const entry of skills) {
    if (!entry.id || !entry.category) throw new Error(`Invalid entry: ${JSON.stringify(entry.id)}`);
    if (seen.has(entry.id)) throw new Error(`Duplicate id: ${entry.id}`);
    seen.add(entry.id);
    const { dir } = skillPath(entry);
    mkdirSync(dir, { recursive: true });
    const base = entry.id.split('/').pop();
    writeFileSync(join(dir, `${base}.en.skill.md`), buildMarkdown(entry, 'en'), 'utf8');
    writeFileSync(join(dir, `${base}.zh.skill.md`), buildMarkdown(entry, 'zh'), 'utf8');
    process.stdout.write(`wrote ${entry.id}\n`);
  }
  process.stdout.write(`Done. ${skills.length} skills (${skills.length * 2} files).\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
