/**
 * Shared locale resolution and system-prompt extraction for validate.js + export_skills.js
 * Locale-per-file: each .zh.skill.md / .en.skill.md has single-locale COSTAR + body.
 */

export const SYSTEM_PROMPT_HEADINGS = [
  '## 系统提示词 · System Prompt',
  '## 系统提示词',
  '## System Prompt',
];

/** First fenced block after the earliest system-prompt heading. */
export function extractSystemPrompt(raw) {
  let bestIdx = -1;
  let bestLen = 0;
  for (const h of SYSTEM_PROMPT_HEADINGS) {
    const i = raw.indexOf(h);
    if (i !== -1 && (bestIdx === -1 || i < bestIdx)) {
      bestIdx = i;
      bestLen = h.length;
    }
  }
  if (bestIdx === -1) return null;
  let rest = raw.slice(bestIdx + bestLen);
  const open = rest.indexOf('```');
  if (open === -1) return null;
  let body = rest.slice(open + 3);
  const nl = body.indexOf('\n');
  if (nl !== -1) {
    const first = body.slice(0, nl).trim();
    if (/^[a-zA-Z][\w-]*$/.test(first) && first.length < 48) {
      body = body.slice(nl + 1);
    }
  }
  const close = body.indexOf('```');
  if (close === -1) return null;
  return body.slice(0, close).trim();
}

export function hasSystemPromptHeading(content) {
  return SYSTEM_PROMPT_HEADINGS.some((h) => content.includes(h));
}

const MIN_FM_PROMPT = 20;

/** Legacy: optional frontmatter prompts (no longer in schema v2). Kept for tooling compatibility. */
export function hasFrontmatterSystemPrompt(data) {
  const z = typeof data.system_prompt_zh === 'string' ? data.system_prompt_zh.trim() : '';
  const e = typeof data.system_prompt_en === 'string' ? data.system_prompt_en.trim() : '';
  return z.length >= MIN_FM_PROMPT || e.length >= MIN_FM_PROMPT;
}

/** True if markdown or legacy frontmatter provides a usable system prompt. */
export function hasSystemPromptSource(content, data) {
  if (hasFrontmatterSystemPrompt(data)) return true;
  const ext = extractSystemPrompt(content);
  return Boolean(ext && ext.length >= MIN_FM_PROMPT);
}

/** Single-locale field: use as-is (locale file already monolingual). */
export function resolveField(data, key) {
  const v = data[key];
  return v != null && String(v).trim() ? String(v).trim() : '';
}

/** Merged export: zh slice uses zh-file persona, etc. */
export function resolvePersonaZh(data) {
  return resolveField(data, 'persona');
}

export function resolvePersonaEn(data) {
  return resolveField(data, 'persona');
}

export function resolveObjectiveZh(data) {
  return resolveField(data, 'objective');
}

export function resolveObjectiveEn(data) {
  return resolveField(data, 'objective');
}

export function resolveStyleZh(data) {
  return resolveField(data, 'style');
}

export function resolveStyleEn(data) {
  return resolveField(data, 'style');
}

export function resolveToneZh(data) {
  return resolveField(data, 'tone');
}

export function resolveToneEn(data) {
  return resolveField(data, 'tone');
}

export function resolveAudienceZh(data) {
  return resolveField(data, 'audience');
}

export function resolveAudienceEn(data) {
  return resolveField(data, 'audience');
}

export function resolveOutputFormatZh(data) {
  return resolveField(data, 'output_format');
}

export function resolveOutputFormatEn(data) {
  return resolveField(data, 'output_format');
}

export function resolveSystemPromptZh(data, extractedFence) {
  const z = typeof data.system_prompt_zh === 'string' ? data.system_prompt_zh.trim() : '';
  if (z.length >= MIN_FM_PROMPT) return z;
  return extractedFence || '';
}

export function resolveSystemPromptEn(data, extractedFence) {
  const e = typeof data.system_prompt_en === 'string' ? data.system_prompt_en.trim() : '';
  if (e.length >= MIN_FM_PROMPT) return e;
  return extractedFence || '';
}

// ── User Prompt Template extraction ──

const USER_PROMPT_HEADINGS = [
  '## 用户提示词模板 · User Prompt Template',
  '## 用户提示词模板',
  '## User Prompt Template',
];

export function extractUserPromptTemplate(raw) {
  let bestIdx = -1;
  let bestLen = 0;
  for (const h of USER_PROMPT_HEADINGS) {
    const i = raw.indexOf(h);
    if (i !== -1 && (bestIdx === -1 || i < bestIdx)) {
      bestIdx = i;
      bestLen = h.length;
    }
  }
  if (bestIdx === -1) return '';
  let rest = raw.slice(bestIdx + bestLen);
  const nextH2 = rest.indexOf('\n## ');
  if (nextH2 !== -1) rest = rest.slice(0, nextH2);
  const open = rest.indexOf('```');
  if (open === -1) return '';
  let body = rest.slice(open + 3);
  const nl = body.indexOf('\n');
  if (nl !== -1) {
    const first = body.slice(0, nl).trim();
    if (/^[a-zA-Z][\w-]*$/.test(first) && first.length < 48) {
      body = body.slice(nl + 1);
    }
  }
  const close = body.indexOf('```');
  if (close === -1) return '';
  return body.slice(0, close).trim();
}

// ── Output Example extraction ──

const OUTPUT_EXAMPLE_HEADINGS = [
  '## 输出示例 · Output Example',
  '## 输出示例',
  '## Output Example',
];

const SECTION_TERMINATORS = [
  '\n## Evaluation Log',
  '\n## 评估记录',
  '\n## Related Skills',
  '\n## 相关技能',
];

export function extractOutputExample(raw) {
  let bestIdx = -1;
  let bestLen = 0;
  for (const h of OUTPUT_EXAMPLE_HEADINGS) {
    const i = raw.indexOf(h);
    if (i !== -1 && (bestIdx === -1 || i < bestIdx)) {
      bestIdx = i;
      bestLen = h.length;
    }
  }
  if (bestIdx === -1) return '';
  let rest = raw.slice(bestIdx + bestLen);
  let end = rest.length;
  for (const term of SECTION_TERMINATORS) {
    const ti = rest.indexOf(term);
    if (ti !== -1 && ti < end) end = ti;
  }
  return rest.slice(0, end).trim();
}

// ── Related Skills extraction ──

const RELATED_SKILLS_HEADINGS = [
  '## 相关技能 · Related Skills',
  '## 相关技能',
  '## Related Skills',
];

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

export function extractRelatedSkills(raw, sourceId) {
  let bestIdx = -1;
  let bestLen = 0;
  for (const h of RELATED_SKILLS_HEADINGS) {
    const i = raw.indexOf(h);
    if (i !== -1 && (bestIdx === -1 || i < bestIdx)) {
      bestIdx = i;
      bestLen = h.length;
    }
  }
  if (bestIdx === -1) return [];
  let rest = raw.slice(bestIdx + bestLen);
  const nextH2 = rest.indexOf('\n## ');
  if (nextH2 !== -1) rest = rest.slice(0, nextH2);

  const results = [];
  for (const m of rest.matchAll(LINK_RE)) {
    const name = m[1];
    const href = m[2];
    const id = resolveSkillIdFromHref(href, sourceId);
    if (id) results.push({ name, id });
  }
  return results;
}

function resolveSkillIdFromHref(href, sourceId) {
  const match = href.match(/([^/]+)\.(zh|en)\.skill\.md$/);
  if (!match) return null;
  const skillSlug = match[1];
  const parts = sourceId.split('/');
  const segments = href.replace(/\\/g, '/').split('/');
  const dirParts = parts.slice(0, -1);
  for (const seg of segments.slice(0, -1)) {
    if (seg === '.') continue;
    if (seg === '..') dirParts.pop();
    else dirParts.push(seg);
  }
  dirParts.push(skillSlug);
  return dirParts.join('/');
}
