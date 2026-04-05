#!/usr/bin/env node
/**
 * OpenSkill Skill Validator
 * Validates all .skill.md files against the JSON Schema
 * and checks for required Markdown sections.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import matter from 'gray-matter';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Load schema
const schemaPath = join(rootDir, 'schema', 'skill.schema.json');
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));

// Setup AJV
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

// Required markdown sections
const REQUIRED_SECTIONS = [
  '## 系统提示词',
  '## System Prompt',
];

const RECOMMENDED_SECTIONS = [
  '## 输出示例',
  '## Output Example',
];

// Colors for terminal output
const colors = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  blue: (s) => `\x1b[34m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

// Find all .skill.md files
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

// Validate a single skill file
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

  // Parse frontmatter
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

  // JSON Schema validation
  const valid = validate(frontmatter);
  if (!valid) {
    for (const err of validate.errors) {
      const field = err.instancePath.replace('/', '') || err.params?.missingProperty || 'unknown';
      errors.push(`Schema error [${field}]: ${err.message}`);
    }
  }

  // Check required markdown sections
  const hasSystemPrompt = REQUIRED_SECTIONS.some(s => content.includes(s));
  if (!hasSystemPrompt) {
    errors.push('Missing required section: "## 系统提示词 · System Prompt"');
  }

  // Check recommended sections
  const hasExample = RECOMMENDED_SECTIONS.some(s => content.includes(s));
  if (!hasExample) {
    warnings.push('Missing recommended section: "## 输出示例 · Output Example" — please add a real output example');
  }

  // Check bilingual content
  const hasChinese = /[\u4e00-\u9fff]/.test(content);
  const hasEnglish = /[a-zA-Z]{10,}/.test(content);
  if (!hasChinese) {
    warnings.push('No Chinese content detected — skills should be bilingual (zh-en)');
  }
  if (!hasEnglish) {
    warnings.push('No English content detected — skills should be bilingual (zh-en)');
  }

  // Check file naming convention
  const fileName = relPath.split('/').pop();
  if (!fileName.endsWith('.skill.md')) {
    errors.push('File must end with .skill.md');
  }

  return { errors, warnings };
}

// Main
async function main() {
  const skillsDir = join(rootDir, 'skills');
  const files = findSkillFiles(skillsDir);

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
    failedFiles.forEach(f => console.log(colors.red(`   - ${f}`)));
    console.log('\nRun `npm run validate` locally to check your changes.');
    process.exit(1);
  } else {
    console.log(colors.green(`\n✅ All skills validated successfully!\n`));
    process.exit(0);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
