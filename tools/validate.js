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

const schemaPath = join(rootDir, 'schema', 'skill.schema.json');
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

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

  const valid = validate(frontmatter);
  if (!valid) {
    for (const err of validate.errors) {
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

async function main() {
  const skillsDir = join(rootDir, 'skills');
  const fromArgs = resolveSkillPathsFromArgs();
  const files = fromArgs ?? findLocaleSkillFiles(skillsDir);

  if (files.length === 0) {
    console.log(colors.yellow('⚠ No locale skill files (*.zh.skill.md / *.en.skill.md) found in skills/'));
    process.exit(0);
  }

  console.log(colors.bold(`\n🔍 OpenSkill Validator — Checking ${files.length} skill files\n`));
  console.log(colors.dim('─'.repeat(60)));

  let totalErrors = 0;
  let totalWarnings = 0;
  const failedFiles = [];

  for (const filePath of files.sort((a, b) => relative(rootDir, a).localeCompare(relative(rootDir, b)))) {
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

  if (!fromArgs) {
    const pairWarnings = validatePairing(files);
    for (const w of pairWarnings) {
      console.log(colors.yellow(`⚠  PAIR: ${w}`));
      totalWarnings += 1;
    }
  }

  console.log(colors.dim('\n' + '─'.repeat(60)));
  console.log(`\n📊 Results: ${colors.bold(files.length + ' files')} checked`);
  console.log(`   ${colors.red(totalErrors + ' errors')} | ${colors.yellow(totalWarnings + ' warnings')}`);

  if (failedFiles.length > 0) {
    console.log(colors.red(`\n❌ Validation FAILED. Fix the following files:`));
    failedFiles.forEach((f) => console.log(colors.red(`   - ${f}`)));
    console.log(
      '\nRun `npm run validate` locally to check your changes (or `npm run validate -- path/to/file.skill.md` for one file).'
    );
    process.exit(1);
  } else {
    console.log(colors.green(`\n✅ All skills validated successfully!\n`));
    process.exit(0);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
