#!/usr/bin/env node
/**
 * LLM-as-judge evaluation for a single .skill.md file.
 * Uses OpenAI-compatible chat/completions API (see tools/llm_client.js).
 *
 * Usage:
 *   node tools/eval_runner.js skills/cross-functional/okr_writing.zh.skill.md --test-case "基础场景"
 *   npm run eval -- skills/... --dry-run
 *
 * Env: OPENAI_API_KEY or LLM_API_KEY; OPENAI_BASE_URL (optional)
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import matter from 'gray-matter';
import { chatComplete } from './llm_client.js';
import {
  extractSystemPrompt,
  extractUserPromptTemplate,
  resolveSystemPromptZh,
  resolveSystemPromptEn,
} from './skill_locale.js';
import { PEEM_BASELINE_RUBRIC } from './peem_baseline.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

function parseArgs(argv) {
  const out = {
    paths: [],
    model: process.env.OPENAI_MODEL || process.env.LLM_MODEL || 'gpt-4o-mini',
    judge: null,
    testCase: null,
    dryRun: false,
    outFile: null,
    checkAcceptance: true,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--model') out.model = argv[++i];
    else if (a === '--judge') out.judge = argv[++i];
    else if (a === '--test-case') out.testCase = argv[++i];
    else if (a === '--out') out.outFile = argv[++i];
    else if (a === '--dry-run') out.dryRun = true;
    else if (a === '--no-acceptance') out.checkAcceptance = false;
    else if (!a.startsWith('-')) out.paths.push(a);
  }
  if (out.judge == null) out.judge = out.model;
  return out;
}

/** Replace {{var}} in template with values from input object */
export function fillUserTemplate(template, input) {
  if (!template) return '';
  let s = template;
  const vars = input && typeof input === 'object' ? input : {};
  for (const [k, v] of Object.entries(vars)) {
    const re = new RegExp(`\\{\\{\\s*${escapeRe(k)}\\s*\\}\\}`, 'g');
    s = s.replace(re, v == null ? '' : String(v));
  }
  return s;
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function effectiveRubric(data) {
  if (Array.isArray(data.evaluation_rubric) && data.evaluation_rubric.length > 0) {
    return data.evaluation_rubric;
  }
  return PEEM_BASELINE_RUBRIC;
}

function normalizeWeights(rubric) {
  const ws = rubric.map((r) => (typeof r.weight === 'number' && r.weight > 0 ? r.weight : 1));
  const sum = ws.reduce((a, b) => a + b, 0) || 1;
  return rubric.map((r, i) => ({ ...r, _w: ws[i] / sum }));
}

function buildJudgeSystemPrompt(locale) {
  const lang = locale === 'zh' ? 'Chinese' : 'English';
  return `You are an expert evaluator. Score the assistant response using the rubric dimensions provided.
For each dimension output a JSON object with keys: dimension (string), score (integer 1-5), rationale (string, in ${lang}).
Also output overall_score (number 1-5, weighted average of scores using the given weights).
If acceptance_criteria is provided, output acceptance_results: array of {criterion (string), pass (boolean), note (string)}.
Respond with ONLY valid JSON: { "dimensions": [...], "overall_score": number, "acceptance_results": [...] }`;
}

function buildJudgeUserContent({ systemPrompt, userMessage, modelOutput, rubric, acceptance }) {
  const rubricText = normalizeWeights(rubric)
    .map(
      (r) =>
        `- ${r.dimension} (weight ${r._w.toFixed(3)}): score 5=${r.criteria_5 || 'n/a'}; 3=${r.criteria_3 || 'n/a'}; 1=${r.criteria_1 || 'n/a'}`
    )
    .join('\n');

  let acc = '';
  if (acceptance && acceptance.length) {
    acc = `\nAcceptance criteria (natural language checklist):\n${acceptance.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n`;
  }

  return `### System / instruction prompt used:\n\n${systemPrompt}\n\n### User message:\n\n${userMessage}\n\n### Model output to evaluate:\n\n${modelOutput}\n\n### Rubric:\n${rubricText}\n${acc}`;
}

async function runOneCase({ filePath, data, raw, extracted, args }) {
  const locale = data.locale;
  const sp =
    locale === 'zh'
      ? resolveSystemPromptZh(data, extracted)
      : resolveSystemPromptEn(data, extracted);
  const userTpl = extractUserPromptTemplate(raw);
  const rubric = effectiveRubric(data);

  const testCases = data.test_cases || [];
  if (testCases.length === 0) {
    throw new Error('No test_cases in frontmatter; add at least one test case to run eval_runner.');
  }

  const selected = args.testCase
    ? testCases.filter((t) => t.name === args.testCase)
    : testCases;
  if (selected.length === 0) {
    throw new Error(`No test case named "${args.testCase}"`);
  }

  const results = [];

  for (const tc of selected) {
    const input = tc.input && typeof tc.input === 'object' ? tc.input : {};
    const userMessage = fillUserTemplate(userTpl, input);
    if (!userMessage.trim()) {
      throw new Error(`Test case "${tc.name}": empty user message after template fill — check User Prompt Template and input keys.`);
    }

    if (args.dryRun) {
      results.push({
        test_case: tc.name,
        dry_run: true,
        system_prompt_preview: sp.slice(0, 500) + (sp.length > 500 ? '…' : ''),
        user_message: userMessage,
      });
      continue;
    }

    const modelOut = await chatComplete({
      model: args.model,
      messages: [
        { role: 'system', content: sp },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.3,
      maxTokens: 4096,
    });

    const judgeUser = buildJudgeUserContent({
      systemPrompt: sp,
      userMessage,
      modelOutput: modelOut,
      rubric,
      acceptance: args.checkAcceptance ? tc.acceptance : null,
    });

    const judgeRaw = await chatComplete({
      model: args.judge,
      messages: [
        { role: 'system', content: buildJudgeSystemPrompt(locale) },
        { role: 'user', content: judgeUser },
      ],
      temperature: 0.1,
      maxTokens: 2048,
      responseFormatJson: true,
    });

    let parsed;
    try {
      parsed = JSON.parse(judgeRaw);
    } catch {
      throw new Error(`Judge did not return valid JSON: ${judgeRaw.slice(0, 400)}`);
    }

    results.push({
      test_case: tc.name,
      model: args.model,
      judge: args.judge,
      model_output: modelOut,
      judge_result: parsed,
    });
  }

  return results;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.paths.length !== 1) {
    console.error(`Usage: node tools/eval_runner.js <path/to/file.skill.md> [--model ID] [--judge ID] [--test-case NAME] [--out report.json] [--dry-run]`);
    process.exit(1);
  }

  const filePath = resolve(process.cwd(), args.paths[0]);
  const raw = readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const data = parsed.data;
  const extracted = extractSystemPrompt(raw);

  const report = {
    skill_id: data.id,
    locale: data.locale,
    source: relative(rootDir, filePath).replace(/\\/g, '/'),
    generated_at: new Date().toISOString(),
    results: await runOneCase({ filePath, data, raw, extracted, args }),
  };

  const text = JSON.stringify(report, null, 2) + '\n';
  if (args.outFile) {
    writeFileSync(resolve(process.cwd(), args.outFile), text, 'utf8');
    console.log(`Wrote ${args.outFile}`);
  } else {
    console.log(text);
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
