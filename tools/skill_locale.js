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
