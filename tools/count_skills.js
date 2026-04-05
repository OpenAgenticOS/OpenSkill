#!/usr/bin/env node
/**
 * Count skills per category and display a summary table
 */

import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const skillsDir = join(rootDir, 'skills');

function countSkills(dir, depth = 0) {
  const counts = {};
  const entries = readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      counts[entry] = countSkills(fullPath, depth + 1);
    } else if (entry.endsWith('.skill.md')) {
      counts.__count = (counts.__count || 0) + 1;
    }
  }
  return counts;
}

function flatCount(obj) {
  let total = obj.__count || 0;
  for (const [key, val] of Object.entries(obj)) {
    if (key !== '__count' && typeof val === 'object') {
      total += flatCount(val);
    }
  }
  return total;
}

const counts = countSkills(skillsDir);
let grandTotal = 0;

console.log('\n📚 OpenSkill — Skill Coverage Report');
console.log('─'.repeat(50));

for (const [category, subcats] of Object.entries(counts)) {
  const total = flatCount(subcats);
  grandTotal += total;
  console.log(`\n${category}/ (${total} skills)`);
  
  for (const [subcat, skills] of Object.entries(subcats)) {
    if (subcat === '__count') continue;
    const count = typeof skills === 'object' ? flatCount(skills) : 0;
    console.log(`  ├── ${subcat}/ (${count})`);
  }
}

console.log('\n─'.repeat(50));
console.log(`📊 Total: ${grandTotal} skills across ${Object.keys(counts).length} categories\n`);
