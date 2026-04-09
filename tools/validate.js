#!/usr/bin/env node
/**
 * OpenSkill Skill Validator
 * Validates *.zh.skill.md / *.en.skill.md against JSON Schema and Markdown sections.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import matter from 'gray-matter';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { hasSystemPromptHeading, hasSystemPromptSource, hasFrontmatterSystemPrompt } from './skill_locale.js';

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
const validateSkill = ajv.compile(skillSchema);
const validateWorkflow = ajv.compile(workflowSchema);
const validateRecipe = ajv.compile(recipeSchema);

const RECOMMENDED_SECTIONS_ZH = ['## 输出示例', '## Output Example'];
const RECOMMENDED_SECTIONS_EN = ['## Output Example', '## 输出示例'];

const colors = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

function findLocaleSkillFiles(dir) {
  const files = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
      files.push(...findLocaleSkillFiles(fullPath));
    } else if (entry.endsWith('.skill.md') && (entry.includes('.zh.') || entry.includes('.en.'))) {
      files.push(fullPath);
    }
  }
  return files;
}

function resolveSkillPathsFromArgs() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  if (args.length === 0) {
    return null;
  }
  const skillsDir = join(rootDir, 'skills');
  const seen = new Set();
  const paths = [];
  for (const arg of args) {
    const abs = resolve(process.cwd(), arg);
    if (!existsSync(abs)) {
      console.error(colors.red(`File not found: ${arg}`));
      process.exit(1);
    }
    if (!abs.endsWith('.skill.md')) {
      console.error(colors.red(`Not a .skill.md file: ${arg}`));
      process.exit(1);
    }
    const underSkills = relative(skillsDir, abs);
    if (underSkills.startsWith('..') || underSkills === '') {
      console.error(colors.red(`Skill file must be under skills/: ${arg}`));
      process.exit(1);
    }
    if (!seen.has(abs)) {
      seen.add(abs);
      paths.push(abs);
    }
  }
  return paths;
}

function validateSkillFile(filePath) {
  const errors = [];
  const warnings = [];
  const relPath = relative(rootDir, filePath);

  let content;
  try {
    content = readFileSync(filePath, 'utf8');
  } catch (e) {
    return { errors: [`Cannot read file: ${e.message}`], warnings: [] };
  }

  let frontmatter;
  try {
    const parsed = matter(content);
    frontmatter = parsed.data;
    if (frontmatter.created_at instanceof Date) {
      frontmatter.created_at = frontmatter.created_at.toISOString().slice(0, 10);
    }

    if (!parsed.data || Object.keys(parsed.data).length === 0) {
      errors.push('Missing YAML frontmatter — did you forget to add --- delimiters?');
      return { errors, warnings };
    }
  } catch (e) {
    errors.push(`Invalid YAML frontmatter: ${e.message}`);
    return { errors, warnings };
  }

  const valid = validateSkill(frontmatter);
  if (!valid) {
    for (const err of validateSkill.errors) {
      const field = err.instancePath.replace('/', '') || err.params?.missingProperty || 'unknown';
      errors.push(`Schema error [${field}]: ${err.message}`);
    }
  }

  const base = relPath.split('/').pop();
  if (base.includes('.zh.')) {
    if (frontmatter.locale !== 'zh') {
      errors.push('File name `.zh.skill.md` requires `locale: zh` in frontmatter');
    }
  } else if (base.includes('.en.')) {
    if (frontmatter.locale !== 'en') {
      errors.push('File name `.en.skill.md` requires `locale: en` in frontmatter');
    }
  } else {
    errors.push('Expected filename `*.zh.skill.md` or `*.en.skill.md`');
  }

  if (!hasSystemPromptSource(content, frontmatter)) {
    errors.push(
      'Missing system prompt: add "## 系统提示词 · System Prompt" or "## System Prompt" with a fenced block (min length)'
    );
  }

  if (!hasSystemPromptHeading(content) && !hasFrontmatterSystemPrompt(frontmatter)) {
    warnings.push(
      'No system prompt heading — use "## 系统提示词 · System Prompt" or "## System Prompt" with a fenced block'
    );
  }

  const recSections = frontmatter.locale === 'en' ? RECOMMENDED_SECTIONS_EN : RECOMMENDED_SECTIONS_ZH;
  const hasExample = recSections.some((s) => content.includes(s));
  if (!hasExample) {
    warnings.push('Missing recommended "## 输出示例" / "## Output Example" section');
  }

  const fileName = relPath.split('/').pop();
  if (!fileName.endsWith('.skill.md')) {
    errors.push('File must end with .skill.md');
  }

  return { errors, warnings, id: frontmatter.id, locale: frontmatter.locale };
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

function validateWorkflowSteps(steps) {
  const errors = [];
  if (!Array.isArray(steps)) return errors;
  for (const step of steps) {
    if (step.type === 'skill' && !step.skill_id) {
      errors.push(`workflow step "${step.id}": type "skill" requires skill_id`);
    }
    if (step.type === 'human' && !step.description) {
      errors.push(`workflow step "${step.id}": type "human" should include description`);
    }
  }
  return errors;
}

function validateWorkflowFile(filePath) {
  const errors = [];
  const warnings = [];
  const relPath = relative(rootDir, filePath);
  let content;
  try {
    content = readFileSync(filePath, 'utf8');
  } catch (e) {
    return { errors: [`Cannot read file: ${e.message}`], warnings: [] };
  }
  let frontmatter;
  try {
    const parsed = matter(content);
    frontmatter = parsed.data;
    if (frontmatter.created_at instanceof Date) {
      frontmatter.created_at = frontmatter.created_at.toISOString().slice(0, 10);
    }
    if (!parsed.data || Object.keys(parsed.data).length === 0) {
      errors.push('Missing YAML frontmatter');
      return { errors, warnings };
    }
  } catch (e) {
    errors.push(`Invalid YAML frontmatter: ${e.message}`);
    return { errors, warnings };
  }
  const valid = validateWorkflow(frontmatter);
  if (!valid) {
    for (const err of validateWorkflow.errors) {
      const field = err.instancePath.replace('/', '') || err.params?.missingProperty || 'unknown';
      errors.push(`Schema error [${field}]: ${err.message}`);
    }
  }
  errors.push(...validateWorkflowSteps(frontmatter.steps));
  const base = relPath.split('/').pop();
  if (base.includes('.zh.') && frontmatter.locale !== 'zh') {
    errors.push('File name `.zh.workflow.md` requires `locale: zh`');
  }
  if (base.includes('.en.') && frontmatter.locale !== 'en') {
    errors.push('File name `.en.workflow.md` requires `locale: en`');
  }
  return { errors, warnings, id: frontmatter.id, locale: frontmatter.locale };
}

function validateRecipeFile(filePath) {
  const errors = [];
  const warnings = [];
  const relPath = relative(rootDir, filePath);
  let content;
  try {
    content = readFileSync(filePath, 'utf8');
  } catch (e) {
    return { errors: [`Cannot read file: ${e.message}`], warnings: [] };
  }
  let frontmatter;
  try {
    const parsed = matter(content);
    frontmatter = parsed.data;
    if (frontmatter.created_at instanceof Date) {
      frontmatter.created_at = frontmatter.created_at.toISOString().slice(0, 10);
    }
    if (!parsed.data || Object.keys(parsed.data).length === 0) {
      errors.push('Missing YAML frontmatter');
      return { errors, warnings };
    }
  } catch (e) {
    errors.push(`Invalid YAML frontmatter: ${e.message}`);
    return { errors, warnings };
  }
  const valid = validateRecipe(frontmatter);
  if (!valid) {
    for (const err of validateRecipe.errors) {
      const field = err.instancePath.replace('/', '') || err.params?.missingProperty || 'unknown';
      errors.push(`Schema error [${field}]: ${err.message}`);
    }
  }
  const base = relPath.split('/').pop();
  if (base.includes('.zh.') && frontmatter.locale !== 'zh') {
    errors.push('File name `.zh.recipe.md` requires `locale: zh`');
  }
  if (base.includes('.en.') && frontmatter.locale !== 'en') {
    errors.push('File name `.en.recipe.md` requires `locale: en`');
  }
  return { errors, warnings, id: frontmatter.id, locale: frontmatter.locale };
}

function validatePairing(files) {
  const warnings = [];
  const byId = new Map();
  for (const filePath of files) {
    const relPath = relative(rootDir, filePath);
    let content;
    try {
      content = readFileSync(filePath, 'utf8');
    } catch {
      continue;
    }
    let id;
    try {
      id = matter(content).data?.id;
    } catch {
      continue;
    }
    if (!id) continue;
    if (!byId.has(id)) byId.set(id, { zh: null, en: null });
    const slot = byId.get(id);
    if (relPath.includes('.zh.')) slot.zh = relPath;
    if (relPath.includes('.en.')) slot.en = relPath;
  }
  for (const [id, slot] of byId.entries()) {
    if (!slot.zh) warnings.push(`id "${id}": missing .zh.skill.md pair`);
    if (!slot.en) warnings.push(`id "${id}": missing .en.skill.md pair`);
  }
  return warnings;
}

function validatePairingByExtension(files, zhPart, enPart) {
  const warnings = [];
  const byId = new Map();
  for (const filePath of files) {
    const relPath = relative(rootDir, filePath);
    let id;
    try {
      id = matter(readFileSync(filePath, 'utf8')).data?.id;
    } catch {
      continue;
    }
    if (!id) continue;
    if (!byId.has(id)) byId.set(id, { zh: null, en: null });
    const slot = byId.get(id);
    if (relPath.includes('.zh.')) slot.zh = relPath;
    if (relPath.includes('.en.')) slot.en = relPath;
  }
  for (const [id, slot] of byId.entries()) {
    if (!slot.zh) warnings.push(`id "${id}": missing ${zhPart} pair`);
    if (!slot.en) warnings.push(`id "${id}": missing ${enPart} pair`);
  }
  return warnings;
}

async function main() {
  const skillsDir = join(rootDir, 'skills');
  const workflowsDir = join(rootDir, 'workflows');
  const recipesDir = join(rootDir, 'recipes');
  const fromArgs = resolveSkillPathsFromArgs();
  const skillFiles = fromArgs ?? findLocaleSkillFiles(skillsDir);
  const workflowFiles = fromArgs ? [] : findLocaleWorkflowFiles(workflowsDir);
  const recipeFiles = fromArgs ? [] : findLocaleRecipeFiles(recipesDir);

  if (skillFiles.length === 0 && !fromArgs) {
    console.log(colors.yellow('⚠ No locale skill files (*.zh.skill.md / *.en.skill.md) found in skills/'));
    process.exit(0);
  }

  const totalCount = skillFiles.length + workflowFiles.length + recipeFiles.length;
  console.log(
    colors.bold(
      `\n🔍 OpenSkill Validator — Checking ${skillFiles.length} skill + ${workflowFiles.length} workflow + ${recipeFiles.length} recipe files\n`
    )
  );
  console.log(colors.dim('─'.repeat(60)));

  let totalErrors = 0;
  let totalWarnings = 0;
  const failedFiles = [];

  for (const filePath of skillFiles.sort((a, b) => relative(rootDir, a).localeCompare(relative(rootDir, b)))) {
    const relPath = relative(rootDir, filePath);
    const { errors, warnings } = validateSkillFile(filePath);

    if (errors.length === 0 && warnings.length === 0) {
      console.log(colors.green(`✅ ${relPath}`));
    } else {
      if (errors.length > 0) {
        console.log(colors.red(`❌ ${relPath}`));
        failedFiles.push(relPath);
        for (const err of errors) {
          console.log(colors.red(`   ERROR: ${err}`));
        }
      } else {
        console.log(colors.yellow(`⚠  ${relPath}`));
      }
      for (const warn of warnings) {
        console.log(colors.yellow(`   WARN: ${warn}`));
      }
    }

    totalErrors += errors.length;
    totalWarnings += warnings.length;
  }

  for (const filePath of workflowFiles.sort((a, b) => relative(rootDir, a).localeCompare(relative(rootDir, b)))) {
    const relPath = relative(rootDir, filePath);
    const { errors, warnings } = validateWorkflowFile(filePath);
    if (errors.length === 0 && warnings.length === 0) {
      console.log(colors.green(`✅ ${relPath}`));
    } else {
      if (errors.length > 0) {
        console.log(colors.red(`❌ ${relPath}`));
        failedFiles.push(relPath);
        for (const err of errors) {
          console.log(colors.red(`   ERROR: ${err}`));
        }
      } else {
        console.log(colors.yellow(`⚠  ${relPath}`));
      }
      for (const warn of warnings) {
        console.log(colors.yellow(`   WARN: ${warn}`));
      }
    }
    totalErrors += errors.length;
    totalWarnings += warnings.length;
  }

  for (const filePath of recipeFiles.sort((a, b) => relative(rootDir, a).localeCompare(relative(rootDir, b)))) {
    const relPath = relative(rootDir, filePath);
    const { errors, warnings } = validateRecipeFile(filePath);
    if (errors.length === 0 && warnings.length === 0) {
      console.log(colors.green(`✅ ${relPath}`));
    } else {
      if (errors.length > 0) {
        console.log(colors.red(`❌ ${relPath}`));
        failedFiles.push(relPath);
        for (const err of errors) {
          console.log(colors.red(`   ERROR: ${err}`));
        }
      } else {
        console.log(colors.yellow(`⚠  ${relPath}`));
      }
      for (const warn of warnings) {
        console.log(colors.yellow(`   WARN: ${warn}`));
      }
    }
    totalErrors += errors.length;
    totalWarnings += warnings.length;
  }

  if (!fromArgs) {
    const pairWarnings = validatePairing(skillFiles);
    for (const w of pairWarnings) {
      console.log(colors.yellow(`⚠  PAIR: ${w}`));
      totalWarnings += 1;
    }
    const wfPair = validatePairingByExtension(workflowFiles, '.zh.workflow.md', '.en.workflow.md');
    for (const w of wfPair) {
      console.log(colors.yellow(`⚠  PAIR: ${w}`));
      totalWarnings += 1;
    }
    const rcPair = validatePairingByExtension(recipeFiles, '.zh.recipe.md', '.en.recipe.md');
    for (const w of rcPair) {
      console.log(colors.yellow(`⚠  PAIR: ${w}`));
      totalWarnings += 1;
    }
  }

  console.log(colors.dim('\n' + '─'.repeat(60)));
  console.log(`\n📊 Results: ${colors.bold(totalCount + ' files')} checked`);
  console.log(`   ${colors.red(totalErrors + ' errors')} | ${colors.yellow(totalWarnings + ' warnings')}`);

  if (failedFiles.length > 0) {
    console.log(colors.red(`\n❌ Validation FAILED. Fix the following files:`));
    failedFiles.forEach((f) => console.log(colors.red(`   - ${f}`)));
    console.log(
      '\nRun `npm run validate` locally to check your changes (or `npm run validate -- path/to/file.skill.md` for one file).'
    );
    process.exit(1);
  } else {
    console.log(colors.green(`\n✅ All files validated successfully!\n`));
    process.exit(0);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
