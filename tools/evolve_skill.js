#!/usr/bin/env node
/**
 * EvoSkills-style offline helper: propose improved system prompts; does NOT write .skill.md.
 * Run eval rounds with an isolated verifier (judge) model.
 *
 * Usage:
 *   node tools/evolve_skill.js skills/cross-functional/okr_writing.zh.skill.md --rounds 3
 *
 * Env: same as eval_runner (OPENAI_API_KEY, OPENAI_BASE_URL, etc.)
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
import { fillUserTemplate } from './eval_runner.js';
import { PEEM_BASELINE_RUBRIC } from './peem_baseline.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

function parseArgs(argv) {
  const out = {
    paths: [],
    rounds: 3,
    generator: process.env.OPENAI_MODEL || process.env.LLM_MODEL || 'gpt-4o-mini',
    verifier: null,
    testCase: null,
    outFile: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--rounds') out.rounds = Math.max(1, parseInt(argv[++i], 10) || 3);
    else if (a === '--generator') out.generator = argv[++i];
    else if (a === '--verifier') out.verifier = argv[++i];
    else if (a === '--test-case') out.testCase = argv[++i];
    else if (a === '--out') out.outFile = argv[++i];
    else if (!a.startsWith('-')) out.paths.push(a);
  }
  if (out.verifier == null) out.verifier = out.generator;
  return out;
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

function extractFencedCode(text) {
  const m = text.match(/```(?:\w+)?\s*([\s\S]*?)```/);
  return m ? m[1].trim() : text.trim();
}

async function judgeOutput({ model, locale, systemPrompt, userMessage, modelOutput, rubric, acceptance }) {
  const lang = locale === 'zh' ? 'Chinese' : 'English';
  const sys = `You are an expert evaluator. Return ONLY JSON: { "dimensions": [{ "dimension", "score" 1-5, "rationale" }], "overall_score": number, "acceptance_results": [{ "criterion", "pass", "note" }] }.
Rationale in ${lang}.`;

  const rubricText = normalizeWeights(rubric)
    .map(
      (r) =>
        `- ${r.dimension} (weight ${r._w.toFixed(3)}): 5=${r.criteria_5 || 'n/a'}; 3=${r.criteria_3 || 'n/a'}; 1=${r.criteria_1 || 'n/a'}`
    )
    .join('\n');
  let acc = '';
  if (acceptance && acceptance.length) {
    acc = `\nAcceptance:\n${acceptance.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n`;
  }
  const user = `### System prompt:\n${systemPrompt}\n\n### User:\n${userMessage}\n\n### Output:\n${modelOutput}\n\n### Rubric:\n${rubricText}\n${acc}`;

  const raw = await chatComplete({
    model,
    messages: [
      { role: 'system', content: sys },
      { role: 'user', content: user },
    ],
    temperature: 0.1,
    maxTokens: 2048,
    responseFormatJson: true,
  });
  return JSON.parse(raw);
}

async function scoreCandidate({ data, raw, extracted, candidateSp, testCases, generatorModel, verifierModel, locale }) {
  const rubric = effectiveRubric(data);
  const userTpl = extractUserPromptTemplate(raw);
  let total = 0;
  const details = [];

  for (const tc of testCases) {
    const input = tc.input && typeof tc.input === 'object' ? tc.input : {};
    const userMessage = fillUserTemplate(userTpl, input);
    const modelOut = await chatComplete({
      model: generatorModel,
      messages: [
        { role: 'system', content: candidateSp },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.3,
      maxTokens: 4096,
    });
    const judged = await judgeOutput({
      model: verifierModel,
      locale,
      systemPrompt: candidateSp,
      userMessage,
      modelOutput: modelOut,
      rubric,
      acceptance: tc.acceptance,
    });
    const sc = typeof judged.overall_score === 'number' ? judged.overall_score : 0;
    total += sc;
    details.push({ test_case: tc.name, overall_score: sc, judge: judged });
  }

  return { mean: testCases.length ? total / testCases.length : 0, details };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.paths.length !== 1) {
    console.error(
      'Usage: node tools/evolve_skill.js <path/to/file.skill.md> [--rounds N] [--generator ID] [--verifier ID] [--test-case NAME] [--out evolution.json]'
    );
    process.exit(1);
  }

  const filePath = resolve(process.cwd(), args.paths[0]);
  const raw = readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const data = parsed.data;
  const locale = data.locale;
  const extracted = extractSystemPrompt(raw);
  const baseSp =
    locale === 'zh'
      ? resolveSystemPromptZh(data, extracted)
      : resolveSystemPromptEn(data, extracted);

  let testCases = data.test_cases || [];
  if (testCases.length === 0) {
    console.error('No test_cases in skill; cannot evolve.');
    process.exit(1);
  }
  if (args.testCase) {
    testCases = testCases.filter((t) => t.name === args.testCase);
    if (!testCases.length) {
      console.error(`Test case not found: ${args.testCase}`);
      process.exit(1);
    }
  }

  const rubric = effectiveRubric(data);
  let bestSp = baseSp;
  let bestScore = -1;
  const roundLog = [];

  const baseline = await scoreCandidate({
    data,
    raw,
    extracted,
    candidateSp: baseSp,
    testCases,
    generatorModel: args.generator,
    verifierModel: args.verifier,
    locale,
  });
  bestScore = baseline.mean;
  roundLog.push({ round: 0, label: 'baseline', mean_score: baseline.mean, details: baseline.details });

  const genSys =
    locale === 'zh'
      ? '你是企业提示词专家。根据反馈改进「系统提示词」文本。只输出一个新的系统提示词全文，用 markdown 代码围栏包裹（``` 包裹即可）。不要解释。'
      : 'You are an enterprise prompt expert. Improve the system prompt. Output ONLY the new system prompt inside a single markdown fenced code block. No explanation.';

  for (let r = 1; r <= args.rounds; r++) {
    const prev = roundLog[roundLog.length - 1];
    const feedback = JSON.stringify(prev.details?.[0]?.judge?.dimensions || [], null, 2).slice(0, 6000);

    const genUser =
      locale === 'zh'
        ? `当前系统提示词：\n\n${bestSp}\n\n---\n评估维度摘要（JSON）：\n${feedback}\n\n请生成改进版系统提示词，保持任务目标不变，提高评分。`
        : `Current system prompt:\n\n${bestSp}\n\n---\nJudge dimension feedback (JSON):\n${feedback}\n\nPropose an improved system prompt; keep the same task objective.`;

    const genOut = await chatComplete({
      model: args.generator,
      messages: [
        { role: 'system', content: genSys },
        { role: 'user', content: genUser },
      ],
      temperature: 0.4,
      maxTokens: 8192,
    });

    const candidateSp = extractFencedCode(genOut);
    if (candidateSp.length < 80) {
      roundLog.push({ round: r, error: 'generator_output_too_short', raw: genOut.slice(0, 200) });
      continue;
    }

    const scored = await scoreCandidate({
      data,
      raw,
      extracted,
      candidateSp,
      testCases,
      generatorModel: args.generator,
      verifierModel: args.verifier,
      locale,
    });

    roundLog.push({ round: r, mean_score: scored.mean, details: scored.details, candidate_preview: candidateSp.slice(0, 400) });

    if (scored.mean > bestScore) {
      bestScore = scored.mean;
      bestSp = candidateSp;
    }
  }

  const report = {
    skill_id: data.id,
    source: relative(rootDir, filePath).replace(/\\/g, '/'),
    generated_at: new Date().toISOString(),
    best_mean_score: bestScore,
    suggested_evolution_history_entry: {
      version: data.version,
      date: new Date().toISOString().slice(0, 10),
      method: 'evo_skills_refinement',
      trigger: `evolve_skill.js mean_score=${bestScore.toFixed(2)}`,
      changes: 'See best_system_prompt in report; human review required before merge.',
    },
    best_system_prompt: bestSp,
    rounds: roundLog,
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
