/**
 * Expand compact skill spec into full manifest entry for generate_skills.js
 */
'use strict';

const DEFAULT_MODELS = ['gpt-5.4', 'claude-sonnet-4-6', 'gemini-2.5-pro', 'qwen3.5-plus'];

function build(spec) {
  const styleEn = spec.styleEn || 'Structured Markdown with headings, bullets, and tables where helpful.';
  const styleZh = spec.styleZh || '结构化 Markdown：标题、要点，必要时附表格。';
  const toneEn = spec.toneEn || 'Professional, clear, and action-oriented.';
  const toneZh = spec.toneZh || '专业、清晰、可执行。';
  const se = spec.systemExtraEn ? `\n${spec.systemExtraEn}` : '';
  const sz = spec.systemExtraZh ? `\n${spec.systemExtraZh}` : '';

  const id = `${spec.category}/${spec.slug}`;
  const input_variables = (spec.vars || []).map((v) => ({
    name: v.name,
    description_en: v.descriptionEn,
    description_zh: v.descriptionZh,
    required: v.required !== false,
    example_en: String(v.exampleEn ?? ''),
    example_zh: String(v.exampleZh ?? ''),
  }));

  const system_prompt_en = `<persona>
${spec.personaEn}
</persona>

<objective>
${spec.objectiveEn}
</objective>

<output_format>
${spec.outputFormatEn}
</output_format>

<constraints>
- Use only the provided inputs; label assumptions clearly
- Keep language appropriate for enterprise workplace use${se}
</constraints>`;

  const system_prompt_zh = `<persona>
${spec.personaZh}
</persona>

<objective>
${spec.objectiveZh}
</objective>

<output_format>
${spec.outputFormatZh}
</output_format>

<constraints>
- 仅使用所给输入；对假设进行标注
- 语言适合企业职场场景${sz}
</constraints>`;

  return {
    id,
    category: spec.category,
    mcp_tool_name: spec.mcp,
    name: spec.name,
    name_zh: spec.nameZh,
    tags: spec.tags,
    tags_zh: spec.tagsZh,
    persona_en: spec.personaEn,
    persona_zh: spec.personaZh,
    objective_en: spec.objectiveEn,
    objective_zh: spec.objectiveZh,
    style_en: styleEn,
    style_zh: styleZh,
    tone_en: toneEn,
    tone_zh: toneZh,
    audience_en: spec.audienceEn,
    audience_zh: spec.audienceZh,
    output_format_en: spec.outputFormatEn,
    output_format_zh: spec.outputFormatZh,
    input_variables,
    system_prompt_en,
    system_prompt_zh,
    user_prompt_template_en: spec.userEn.trim(),
    user_prompt_template_zh: spec.userZh.trim(),
    description_en: spec.descEn,
    description_zh: spec.descZh,
    output_example_en: spec.outEn.trim(),
    output_example_zh: spec.outZh.trim(),
    compatible_models: spec.compatible_models || DEFAULT_MODELS,
    difficulty: spec.difficulty || 'intermediate',
    estimated_time: spec.estimated_time || '5-10 min',
  };
}

module.exports = { build };
