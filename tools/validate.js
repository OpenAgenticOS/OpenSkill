#!/usr/bin/env node
/**
 * OpenSkill Skill Validator
 * Validates .skill.md files against the JSON Schema and checks Markdown sections.
 * With no args, scans skills/ recursively. With paths, validates only those files
 * (each must be under skills/ and end with .skill.md). Example:
 *   node tools/validate.js skills/c-suite/ceo/foo.skill.md
 *   npm run validate -- skills/c-suite/ceo/foo.skill.md
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import matter from 'gray-matter';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {
  hasSystemPromptHeading,
  hasSystemPromptSource,
  hasFrontmatterSystemPrompt,
} from './skill_locale.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const schemaPath = join(rootDir, 'schema', 'skill.schema.json');
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

const RECOMMENDED_SECTIONS = ['## 输出示例', '## Output Example'];

const colors = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

function findSkillFiles(dir) {
  const files = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
      files.push(...findSkillFiles(fullPath));
    } else if (entry.endsWith('.skill.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

/** If CLI paths are given, validate only those (must live under skills/). */
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

  if (!hasSystemPromptSource(content, frontmatter)) {
    errors.push(
      'Missing system prompt: add "## 系统提示词 · System Prompt" with a fenced block, or set `system_prompt_zh` / `system_prompt_en` in frontmatter (min length per schema)'
    );
  }

  if (!hasSystemPromptHeading(content) && !hasFrontmatterSystemPrompt(frontmatter)) {
    warnings.push(
      'No "## 系统提示词" heading — OK if you use frontmatter `system_prompt_zh` / `system_prompt_en`; otherwise reviewers expect the usual Markdown section'
    );
  }

  const hasExample = RECOMMENDED_SECTIONS.some((s) => content.includes(s));
  if (!hasExample) {
    warnings.push('Missing recommended section: "## 输出示例 · Output Example" — please add a real output example');
  }

  const splitLocale =
    frontmatter.persona_zh ||
    frontmatter.persona_en ||
    frontmatter.system_prompt_zh ||
    frontmatter.system_prompt_en;

  if (!splitLocale) {
    const hasChinese = /[\u4e00-\u9fff]/.test(content);
    const hasEnglish = /[a-zA-Z]{10,}/.test(content);
    if (!hasChinese) {
      warnings.push(
        'No Chinese content detected — add Chinese in body or `*_zh` fields, or mark Translation needed: zh / needs-translation'
      );
    }
    if (!hasEnglish) {
      warnings.push(
        'No English content detected — add English in body or `*_en` fields, or mark Translation needed: en / needs-translation'
      );
    }
  }

  const fileName = relPath.split('/').pop();
  if (!fileName.endsWith('.skill.md')) {
    errors.push('File must end with .skill.md');
  }

  return { errors, warnings };
}

async function main() {
  const skillsDir = join(rootDir, 'skills');
  const fromArgs = resolveSkillPathsFromArgs();
  const files = fromArgs ?? findSkillFiles(skillsDir);

  if (files.length === 0) {
    console.log(colors.yellow('⚠ No .skill.md files found in skills/ directory'));
    process.exit(0);
  }

  console.log(colors.bold(`\n🔍 OpenSkill Validator — Checking ${files.length} skill files\n`));
  console.log(colors.dim('─'.repeat(60)));

  let totalErrors = 0;
  let totalWarnings = 0;
  const failedFiles = [];

  for (const filePath of files) {
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
