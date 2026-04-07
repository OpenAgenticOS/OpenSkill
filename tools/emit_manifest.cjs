#!/usr/bin/env node
/**
 * Build tools/skill_manifest.json (array of 85 skills) from modular specs.
 * Run: node tools/emit_manifest.cjs
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { build } = require('./specs/build_core.cjs');
const management = require('./specs/skills_management.cjs');
const ic = require('./specs/skills_ic.cjs');
const csuiteXfn = require('./specs/skills_csuite_xfn.cjs');

const all = [...management(build), ...ic(build), ...csuiteXfn(build)];
const outPath = path.join(__dirname, 'skill_manifest.json');
fs.writeFileSync(outPath, JSON.stringify(all, null, 2), 'utf8');
console.log('Wrote', all.length, 'skills to', path.relative(process.cwd(), outPath));
