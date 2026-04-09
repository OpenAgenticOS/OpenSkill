#!/usr/bin/env node
/**
 * Export all skills to dist/openskill.json, openskill.zh.json, openskill.en.json
 * Locale-per-file: pair by id from *.zh.skill.md + *.en.skill.md
 */

import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync, existsSync } from 'fs';
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

const skillSchemaPath = join(rootDir, 'schema', 'skill.schema.json');
const workflowSchemaPath = join(rootDir, 'schema', 'workflow.schema.json');
const recipeSchemaPath = join(rootDir, 'schema', 'recipe.schema.json');
const skillSchema = JSON.parse(readFileSync(skillSchemaPath, 'utf8'));
const workflowSchema = JSON.parse(readFileSync(workflowSchemaPath, 'utf8'));
const recipeSchema = JSON.parse(readFileSync(recipeSchemaPath, 'utf8'));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validateFm = ajv.compile(skillSchema);
const validateWorkflowFm = ajv.compile(workflowSchema);
const validateRecipeFm = ajv.compile(recipeSchema);

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

function findLocaleWorkflowFiles(dir) {
  const files = [];
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory() && !entry.startsWith('.')) {
      files.push(...findLocaleWorkflowFiles(fullPath));
    } else if (entry.endsWith('.workflow.md') && (entry.includes('.zh.') || entry.includes('.en.'))) {
      files.push(fullPath);
    }
  }
  return files;
}

function findLocaleRecipeFiles(dir) {
  const files = [];
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory() && !entry.startsWith('.')) {
      files.push(...findLocaleRecipeFiles(fullPath));
    } else if (entry.endsWith('.recipe.md') && (entry.includes('.zh.') || entry.includes('.en.'))) {
      files.push(fullPath);
    }
  }
  return files;
}

function sha256Short(buf) {
  return createHash('sha256').update(buf).digest('hex').slice(0, 16);
}

function pickSkillLayers(data) {
  const out = {};
  if (data.evaluation_rubric != null) out.evaluation_rubric = data.evaluation_rubric;
  if (data.test_cases != null) out.test_cases = data.test_cases;
  if (data.enhancers != null) out.enhancers = data.enhancers;
  if (data.composable_with != null) out.composable_with = data.composable_with;
  if (data.evaluation_history != null) out.evaluation_history = data.evaluation_history;
  if (data.evolution_history != null) out.evolution_history = data.evolution_history;
  if (data.content_hash != null) out.content_hash = data.content_hash;
  if (data.status != null) out.status = data.status;
  if (data.competence_profile != null) out.competence_profile = data.competence_profile;
  if (data.model_benchmarks != null) out.model_benchmarks = data.model_benchmarks;
  if (data.execution_profile != null) out.execution_profile = data.execution_profile;
  return out;
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
    ...pickSkillLayers(data),
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
  delete bm.evaluation_rubric;
  delete bm.test_cases;
  delete bm.enhancers;
  delete bm.composable_with;
  delete bm.evaluation_history;
  delete bm.evolution_history;
  delete bm.content_hash;
  delete bm.status;
  delete bm.competence_profile;
  delete bm.model_benchmarks;
  delete bm.execution_profile;
  const layersZh = pickSkillLayers(zhData);
  const layersEn = pickSkillLayers(enData);
  return {
    ...bm,
    language: 'zh-en',
    locales: ['zh', 'en'],
    source_path: zhPath,
    source_path_en: enPath,
    status: zhData.status ?? enData.status,
    competence_profile: zhData.competence_profile ?? enData.competence_profile,
    model_benchmarks: zhData.model_benchmarks ?? enData.model_benchmarks,
    execution_profile: zhData.execution_profile ?? enData.execution_profile,
    ...(layersZh.evaluation_rubric != null || layersEn.evaluation_rubric != null
      ? {
          evaluation_rubric_zh: layersZh.evaluation_rubric,
          evaluation_rubric_en: layersEn.evaluation_rubric,
        }
      : {}),
    ...(layersZh.test_cases != null || layersEn.test_cases != null
      ? {
          test_cases_zh: layersZh.test_cases,
          test_cases_en: layersEn.test_cases,
        }
      : {}),
    ...(layersZh.enhancers != null || layersEn.enhancers != null
      ? {
          enhancers_zh: layersZh.enhancers,
          enhancers_en: layersEn.enhancers,
        }
      : {}),
    ...(layersZh.composable_with != null || layersEn.composable_with != null
      ? {
          composable_with_zh: layersZh.composable_with,
          composable_with_en: layersEn.composable_with,
        }
      : {}),
    ...(layersZh.evaluation_history != null || layersEn.evaluation_history != null
      ? {
          evaluation_history_zh: layersZh.evaluation_history,
          evaluation_history_en: layersEn.evaluation_history,
        }
      : {}),
    ...(layersZh.evolution_history != null || layersEn.evolution_history != null
      ? {
          evolution_history_zh: layersZh.evolution_history,
          evolution_history_en: layersEn.evolution_history,
        }
      : {}),
    ...(layersZh.content_hash != null || layersEn.content_hash != null
      ? {
          content_hash_zh: layersZh.content_hash,
          content_hash_en: layersEn.content_hash,
        }
      : {}),
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

function buildProgressivePayload(byId, repo, ref) {
  const skills = [];
  for (const [, slot] of byId) {
    if (!slot.zh || !slot.en) continue;
    const zd = slot.zh.data;
    const ed = slot.en.data;
    const zraw = slot.zh.raw;
    const eraw = slot.en.raw;
    const spZh = resolveSystemPromptZh(zd, slot.zh.extracted);
    const spEn = resolveSystemPromptEn(ed, slot.en.extracted);
    const id = zd.id;

    const L0 = {
      id,
      name_zh: zd.name,
      name_en: ed.name,
      tags: zd.tags,
      category: zd.category,
      status: zd.status ?? ed.status,
      difficulty: zd.difficulty ?? ed.difficulty,
      estimated_time: zd.estimated_time ?? ed.estimated_time,
      locales: ['zh', 'en'],
    };
    const L1 = {
      ...L0,
      persona_zh: resolvePersonaZh(zd),
      persona_en: resolvePersonaEn(ed),
      objective_zh: resolveObjectiveZh(zd),
      objective_en: resolveObjectiveEn(ed),
      style_zh: resolveStyleZh(zd),
      style_en: resolveStyleEn(ed),
      tone_zh: resolveToneZh(zd),
      tone_en: resolveToneEn(ed),
      audience_zh: resolveAudienceZh(zd),
      audience_en: resolveAudienceEn(ed),
      output_format_zh: resolveOutputFormatZh(zd),
      output_format_en: resolveOutputFormatEn(ed),
      input_variables_zh: zd.input_variables,
      input_variables_en: ed.input_variables,
      competence_profile: zd.competence_profile ?? ed.competence_profile,
    };
    const L2 = {
      ...L1,
      system_prompt_zh: spZh,
      system_prompt_en: spEn,
      user_prompt_template_zh: extractUserPromptTemplate(zraw),
      user_prompt_template_en: extractUserPromptTemplate(eraw),
    };
    const L3 = {
      ...L2,
      evaluation_rubric_zh: zd.evaluation_rubric,
      evaluation_rubric_en: ed.evaluation_rubric,
      test_cases_zh: zd.test_cases,
      test_cases_en: ed.test_cases,
      evaluation_history_zh: zd.evaluation_history,
      evaluation_history_en: ed.evaluation_history,
      evolution_history_zh: zd.evolution_history,
      evolution_history_en: ed.evolution_history,
      model_benchmarks: zd.model_benchmarks ?? ed.model_benchmarks,
    };

    skills.push({ id, level_0: L0, level_1: L1, level_2: L2, level_3: L3 });
  }
  skills.sort((a, b) => a.id.localeCompare(b.id));
  return {
    format_version: 1,
    description: 'Progressive disclosure (L0 discovery through L3 evaluation metadata). Optional export.',
    generated_at: new Date().toISOString(),
    repository: repo,
    ref,
    skills_count: skills.length,
    skills,
  };
}

function buildMcpResourcesPayload(skillsFull, repo, ref) {
  return {
    format_version: 1,
    description: 'Experimental skill:// resource descriptors for MCP-style discovery.',
    generated_at: new Date().toISOString(),
    repository: repo,
    ref,
    resources: skillsFull.map((s) => ({
      uri: `skill://openskill/${s.id}`,
      name: s.name_zh || s.id,
      title_en: s.name_en,
      description: String(s.objective_zh || s.objective_en || '').slice(0, 900),
      mimeType: 'application/json',
      metadata: {
        id: s.id,
        category: s.category,
        tags: s.tags,
        status: s.status,
        difficulty: s.difficulty,
        estimated_time: s.estimated_time,
        competence_profile: s.competence_profile,
        execution_profile: s.execution_profile,
        model_benchmarks: s.model_benchmarks,
        locales: s.locales || ['zh', 'en'],
      },
    })),
  };
}

function main() {
  const argv = process.argv.slice(2);
  const wantsMcp = argv.includes('--mcp-resources');
  const wantsProgressive = argv.includes('--progressive');

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

  if (wantsProgressive) {
    const progressive = buildProgressivePayload(byId, repo, ref);
    writeFileSync(
      join(outDir, 'openskill.progressive.json'),
      JSON.stringify(progressive, null, 2) + '\n',
      'utf8'
    );
    console.log(`[export-skills] Wrote dist/openskill.progressive.json (${progressive.skills_count} skills)`);
  }
  if (wantsMcp) {
    const mcp = buildMcpResourcesPayload(skillsFull, repo, ref);
    writeFileSync(join(outDir, 'openskill.mcp-resources.json'), JSON.stringify(mcp, null, 2) + '\n', 'utf8');
    console.log(`[export-skills] Wrote dist/openskill.mcp-resources.json (${mcp.resources.length} resources)`);
  }

  exportWorkflowBundles(outDir, repo, ref);
  exportRecipeBundles(outDir, repo, ref);
}

function exportWorkflowBundles(outDir, repo, ref) {
  const workflowsDir = join(rootDir, 'workflows');
  const files = findLocaleWorkflowFiles(workflowsDir);
  const base = {
    format_version: 1,
    generated_at: new Date().toISOString(),
    repository: repo,
    ref,
    workflows_count: 0,
    workflows: [],
  };
  if (files.length === 0) {
    writeFileSync(join(outDir, 'openskill.workflows.json'), JSON.stringify(base, null, 2) + '\n', 'utf8');
    console.log('[export-skills] Wrote dist/openskill.workflows.json (0 workflows)');
    return;
  }
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
    if (!validateWorkflowFm(parsed.data)) {
      const msgs = (validateWorkflowFm.errors || []).map((err) => {
        const field = err.instancePath.replace(/^\//, '') || err.params?.missingProperty || 'root';
        return `${field}: ${err.message}`;
      });
      console.error(`[export-skills] ${relPath}: workflow schema — ${msgs.join('; ')}`);
      process.exit(1);
    }
    const { data } = parsed;
    const id = data.id;
    if (!byId.has(id)) byId.set(id, {});
    const slot = byId.get(id);
    if (data.locale === 'zh') slot.zh = { data, relPath, content: parsed.content || '' };
    else if (data.locale === 'en') slot.en = { data, relPath, content: parsed.content || '' };
    else {
      console.error(`[export-skills] ${relPath}: invalid locale`);
      process.exit(1);
    }
  }
  const merged = [];
  const errors = [];
  for (const [id, slot] of [...byId.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    if (!slot.zh) errors.push(`Missing zh workflow for id: ${id}`);
    if (!slot.en) errors.push(`Missing en workflow for id: ${id}`);
    if (slot.zh && slot.en) {
      const z = slot.zh.data;
      const e = slot.en.data;
      merged.push({
        id,
        version: z.version,
        difficulty: z.difficulty ?? e.difficulty,
        estimated_time: z.estimated_time ?? e.estimated_time,
        trigger_zh: z.trigger,
        trigger_en: e.trigger,
        locales: ['zh', 'en'],
        name_zh: z.name,
        name_en: e.name,
        steps_zh: z.steps,
        steps_en: e.steps,
        source_path_zh: slot.zh.relPath,
        source_path_en: slot.en.relPath,
        body_md_zh: slot.zh.content.trim(),
        body_md_en: slot.en.content.trim(),
        author: z.author,
        created_at: z.created_at ?? e.created_at,
      });
    }
  }
  if (errors.length) {
    console.error('[export-skills] workflows:\n' + errors.join('\n'));
    process.exit(1);
  }
  const payload = { ...base, workflows_count: merged.length, workflows: merged };
  writeFileSync(join(outDir, 'openskill.workflows.json'), JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log(`[export-skills] Wrote dist/openskill.workflows.json (${merged.length} workflows)`);
}

function exportRecipeBundles(outDir, repo, ref) {
  const recipesDir = join(rootDir, 'recipes');
  const files = findLocaleRecipeFiles(recipesDir);
  const base = {
    format_version: 1,
    generated_at: new Date().toISOString(),
    repository: repo,
    ref,
    recipes_count: 0,
    recipes: [],
  };
  if (files.length === 0) {
    writeFileSync(join(outDir, 'openskill.recipes.json'), JSON.stringify(base, null, 2) + '\n', 'utf8');
    console.log('[export-skills] Wrote dist/openskill.recipes.json (0 recipes)');
    return;
  }
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
    if (!validateRecipeFm(parsed.data)) {
      const msgs = (validateRecipeFm.errors || []).map((err) => {
        const field = err.instancePath.replace(/^\//, '') || err.params?.missingProperty || 'root';
        return `${field}: ${err.message}`;
      });
      console.error(`[export-skills] ${relPath}: recipe schema — ${msgs.join('; ')}`);
      process.exit(1);
    }
    const { data } = parsed;
    const id = data.id;
    if (!byId.has(id)) byId.set(id, {});
    const slot = byId.get(id);
    if (data.locale === 'zh') slot.zh = { data, relPath, content: parsed.content || '' };
    else if (data.locale === 'en') slot.en = { data, relPath, content: parsed.content || '' };
    else {
      console.error(`[export-skills] ${relPath}: invalid locale`);
      process.exit(1);
    }
  }
  const merged = [];
  const errors = [];
  for (const [id, slot] of [...byId.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    if (!slot.zh) errors.push(`Missing zh recipe for id: ${id}`);
    if (!slot.en) errors.push(`Missing en recipe for id: ${id}`);
    if (slot.zh && slot.en) {
      const z = slot.zh.data;
      const e = slot.en.data;
      merged.push({
        id,
        version: z.version,
        locales: ['zh', 'en'],
        name_zh: z.name,
        name_en: e.name,
        roles_zh: z.roles,
        roles_en: e.roles,
        skills_referenced_zh: z.skills_referenced,
        skills_referenced_en: e.skills_referenced,
        workflows_referenced_zh: z.workflows_referenced,
        workflows_referenced_en: e.workflows_referenced,
        source_path_zh: slot.zh.relPath,
        source_path_en: slot.en.relPath,
        body_md_zh: slot.zh.content.trim(),
        body_md_en: slot.en.content.trim(),
        author: z.author,
        created_at: z.created_at ?? e.created_at,
      });
    }
  }
  if (errors.length) {
    console.error('[export-skills] recipes:\n' + errors.join('\n'));
    process.exit(1);
  }
  const payload = { ...base, recipes_count: merged.length, recipes: merged };
  writeFileSync(join(outDir, 'openskill.recipes.json'), JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log(`[export-skills] Wrote dist/openskill.recipes.json (${merged.length} recipes)`);
}

main();
