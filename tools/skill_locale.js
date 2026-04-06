/**
 * Shared locale resolution and system-prompt extraction for validate.js + export_skills.js
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

export function hasFrontmatterSystemPrompt(data) {
  const z = typeof data.system_prompt_zh === 'string' ? data.system_prompt_zh.trim() : '';
  const e = typeof data.system_prompt_en === 'string' ? data.system_prompt_en.trim() : '';
  return z.length >= MIN_FM_PROMPT || e.length >= MIN_FM_PROMPT;
}

/** True if markdown or frontmatter provides a usable system prompt. */
export function hasSystemPromptSource(content, data) {
  if (hasFrontmatterSystemPrompt(data)) return true;
  const ext = extractSystemPrompt(content);
  return Boolean(ext && ext.length >= MIN_FM_PROMPT);
}

export function resolvePersonaZh(data) {
  return (data.persona_zh && String(data.persona_zh).trim()) || (data.persona && String(data.persona).trim()) || '';
}

export function resolvePersonaEn(data) {
  return (data.persona_en && String(data.persona_en).trim()) || (data.persona && String(data.persona).trim()) || '';
}

export function resolveObjectiveZh(data) {
  return (data.objective_zh && String(data.objective_zh).trim()) || (data.objective && String(data.objective).trim()) || '';
}

export function resolveObjectiveEn(data) {
  return (data.objective_en && String(data.objective_en).trim()) || (data.objective && String(data.objective).trim()) || '';
}

export function resolveStyleZh(data) {
  return (data.style_zh && String(data.style_zh).trim()) || (data.style && String(data.style).trim()) || '';
}

export function resolveStyleEn(data) {
  return (data.style_en && String(data.style_en).trim()) || (data.style && String(data.style).trim()) || '';
}

export function resolveToneZh(data) {
  return (data.tone_zh && String(data.tone_zh).trim()) || (data.tone && String(data.tone).trim()) || '';
}

export function resolveToneEn(data) {
  return (data.tone_en && String(data.tone_en).trim()) || (data.tone && String(data.tone).trim()) || '';
}

export function resolveAudienceZh(data) {
  return (data.audience_zh && String(data.audience_zh).trim()) || (data.audience && String(data.audience).trim()) || '';
}

export function resolveAudienceEn(data) {
  return (data.audience_en && String(data.audience_en).trim()) || (data.audience && String(data.audience).trim()) || '';
}

export function resolveOutputFormatZh(data) {
  return (data.output_format_zh && String(data.output_format_zh).trim()) || (data.output_format && String(data.output_format).trim()) || '';
}

export function resolveOutputFormatEn(data) {
  return (data.output_format_en && String(data.output_format_en).trim()) || (data.output_format && String(data.output_format).trim()) || '';
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
