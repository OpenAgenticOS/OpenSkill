#!/usr/bin/env node
/**
 * Count skills per category (unique id; locale pairs count as one)
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const skillsDir = join(rootDir, 'skills');

function findZhSkillFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory() && !entry.startsWith('.')) {
      findZhSkillFiles(fullPath, files);
    } else if (entry.endsWith('.zh.skill.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function categoryFromId(id) {
  const parts = id.split('/');
  if (parts.length >= 1) return parts[0];
  return 'unknown';
}

function subcategoryFromId(id) {
  const parts = id.split('/');
  if (parts.length >= 2) return parts[1];
  return '';
}

const zhFiles = findZhSkillFiles(skillsDir);
const byCategory = {};

for (const f of zhFiles) {
  const raw = readFileSync(f, 'utf8');
  let id = '';
  try {
    const { data } = matter(raw);
    id = data.id || '';
  } catch {
    continue;
  }
  if (!id) continue;
  const cat = categoryFromId(id);
  const sub = subcategoryFromId(id);
  if (!byCategory[cat]) byCategory[cat] = {};
  if (!byCategory[cat][sub]) byCategory[cat][sub] = 0;
  byCategory[cat][sub]++;
}

console.log('\n📚 OpenSkill — Skill Coverage Report (unique id per .zh+.en pair)');
console.log('─'.repeat(50));

let grandTotal = 0;
for (const cat of Object.keys(byCategory).sort()) {
  const subs = byCategory[cat];
  let catTotal = 0;
  for (const sub of Object.keys(subs)) {
    catTotal += subs[sub];
  }
  grandTotal += catTotal;
  console.log(`\n${cat}/ (${catTotal} skills)`);
  for (const sub of Object.keys(subs).sort()) {
    console.log(`  ├── ${sub}/ (${subs[sub]})`);
  }
}

console.log('\n─'.repeat(50));
console.log(`📊 Total: ${grandTotal} skills (locale pairs)\n`);
