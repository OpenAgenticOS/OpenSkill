# Skill 文件格式规范 · Skill File Schema

> **面向贡献者** · For Contributors — 你只需要会写 Markdown！ · You only need to know Markdown!

---

## 什么是一个 Skill？· What is a Skill?

一个 Skill 是一段「**专为某个企业岗位设计的 AI 使用说明**」。它告诉大模型：
- 要扮演什么角色 (Persona)
- 要完成什么任务 (Objective)
- 要用什么风格和语气 (Style & Tone)
- 面向什么受众 (Audience)
- 输出什么格式 (Response Format)

这套六维设计基于 **COSTAR 框架**，已在企业级 LLM 部署中被广泛验证。

---

## 语言与翻译 · Language & translation

可先只写中文或只写英文；缺另一侧时请在 PR 中注明 **`Translation needed: en`** / **`Translation needed: zh`**，或请维护者打上 **`needs-translation`** 标签（见 [CONTRIBUTING.md](./CONTRIBUTING.md)、[docs/GOVERNANCE.md](./docs/GOVERNANCE.md)）。可选 frontmatter 字段（如 `persona_zh`、`system_prompt_en`）与导出包说明见下文 **「Release 与可选语言字段」**。

**English:** Start in one locale if you prefer; note **Translation needed** or ask for **`needs-translation`**. Optional locale-split fields and export bundles are documented under **Release & locale fields** below.

---

## 文件命名规则 · Naming Convention

```
skills/{层级}/{岗位}/{技能名}.skill.md

# 示例
skills/c-suite/ceo/strategic_vision.skill.md
skills/management/product-manager/prd_writing.skill.md
skills/individual-contributor/software-engineer/code_review.skill.md
skills/cross-functional/okr_writing.skill.md
```

---

## 完整格式模板 · Full Template

````markdown
---
# ── 必填字段 (Required) ─────────────────────────────────────────────
id: "{category}/{subcategory}/{skill_name}"        # 全局唯一ID
name: "技能中文名 · Skill English Name"
version: "1.0.0"
category: "c-suite/ceo"                            # 见下方分类表
tags: ["tag1", "tag2", "tag3"]                     # 3-6个标签

# ── COSTAR 六维定义 (Required) ──────────────────────────────────────
persona: |
  描述 AI 应扮演的角色身份，包括经验背景和专业领域。
  Describe the AI persona's identity, experience, and domain expertise.

objective: |
  描述这个 Skill 要帮用户完成的核心任务。
  Describe the core task this Skill helps accomplish.

style: |
  期望的输出风格（如：简洁/详细/学术/口语）。
  Expected output style (e.g., concise, detailed, academic, conversational).

tone: |
  期望的语气（如：专业/鼓励/中立/权威）。
  Expected tone (e.g., professional, encouraging, neutral, authoritative).

audience: |
  输出面向的受众（如：董事会/开发团队/最终用户）。
  Target audience for the output (e.g., board, dev team, end users).

output_format: |
  期望的输出格式（如：Markdown表格/JSON/自由文本/分点列表）。
  Expected output format (e.g., Markdown table, JSON, free text, bullet list).

# ── 可选字段 (Optional) ─────────────────────────────────────────────
input_variables:
  - name: "variable_name"
    description: "变量说明 · Variable description"
    required: true
    example: "示例值 · Example value"

compatible_models:
  - "gpt-5.4"
  - "claude-sonnet-4-6"
  - "gemini-2.5-pro"
  - "qwen3.5-plus"
  - "deepseek-chat"

language: "zh"           # zh | en | zh-en (bilingual)
difficulty: "intermediate"  # beginner | intermediate | advanced
estimated_time: "5-10 min"  # 预计运行一次的时间

# ── 可选：按语言拆分（发布 zh/en JSON 时优先使用）· Optional locale fields ──
# 若省略，则发布包仍可从正文 fenced 块解析；填写后可单独优化某一语言。
# persona_zh: |
#   中文 persona 段落
# persona_en: |
#   English persona paragraph
# system_prompt_zh: |
#   可选：仅中文系统提示（否则用正文代码块或双语块）
# system_prompt_en: |
#   Optional English-only system prompt
# translation_status: "complete"   # complete | partial | pending

# ── 贡献信息 (Auto-filled by CI) ────────────────────────────────────
author: "your-github-username"
created_at: "2025-01-01"
---

## 技能说明 · Description

> 用 1-3 句话描述这个技能能做什么，以及什么时候应该使用它。
> Describe in 1-3 sentences what this skill does and when to use it.

**适用场景 · Use Cases：**
- 场景一 · Scenario 1
- 场景二 · Scenario 2

---

## 系统提示词 · System Prompt

```xml
<persona>
{{persona 内容，完整的角色设定}}
</persona>

<objective>
{{objective 内容，清晰的任务定义}}
</objective>

<style_and_tone>
{{style + tone 内容}}
</style_and_tone>

<audience>
{{audience 内容}}
</audience>

<output_format>
{{output_format 内容，包含具体的格式指令}}
</output_format>

<constraints>
- 约束条件一 · Constraint 1
- 约束条件二 · Constraint 2
</constraints>
```

---

## Release 与可选语言字段 · Release & locale fields

CI 与 `npm run export` 会生成 **`openskill.json`**（`format_version: 2`，含完整 frontmatter）、**`openskill.zh.json`**、**`openskill.en.json`**（各自含 `locale` 与已解析的 COSTAR / `system_prompt`）。若未填写 `persona_zh` 等拆分字段，导出时对中/英包使用与现有 `persona`、`system_prompt` 正文相同的回退内容。可选字段见 [schema/skill.schema.json](./schema/skill.schema.json) 中的 `persona_zh`、`system_prompt_zh`、`translation_status` 等。

**English:** Exports resolve per-locale strings; falls back to combined bilingual `persona` / fenced `system_prompt` when splits are omitted.

---

## 用户提示词模板 · User Prompt Template

```
[在此填写用户每次使用时输入的模板]
[Fill in the template users provide each time they invoke this skill]

{{input_variable_1}}: [描述]
{{input_variable_2}}: [描述]
```

---

## 输出示例 · Output Example

> 展示一个高质量的真实输出案例。
> Show a real, high-quality output example.

```
[在此粘贴一个真实的好输出]
[Paste a real good output here]
```

---

## 使用指南 · Usage Guide

### 直接使用 · Direct Use (ChatGPT / Claude / Gemini)

1. 复制「系统提示词」粘贴到 System Prompt 区域
2. 填写「用户提示词模板」并发送

### 代码集成 · Code Integration

```python
from openskill import load_skill, run_skill

skill = load_skill("c-suite/ceo/strategic_vision")
result = run_skill(skill, {
    "company_background": "...",
    "target_market": "..."
})
```

### MCP 集成 · MCP Integration (Claude Desktop)

```json
{
  "mcpServers": {
    "openskill": {
      "command": "npx",
      "args": ["-y", "@openskill/mcp-server"]
    }
  }
}
```

---

## 评估记录 · Evaluation Log

| 测试模型 | 输出质量 | 测试者 | 日期 |
|----------|----------|--------|------|
| GPT-5.4 | ⭐⭐⭐⭐⭐ | @contributor | 2026-04 |
| Claude Sonnet 4.6 | ⭐⭐⭐⭐⭐ | @contributor | 2026-04 |
| Qwen3.5-Plus | ⭐⭐⭐⭐⭐ | @contributor | 2026-04 |

---

## 相关技能 · Related Skills

- [相关技能1](../related_skill.skill.md)
- [相关技能2](../../other/skill.skill.md)
````

---

## 分类体系 · Category Taxonomy

```yaml
c-suite:
  - ceo
  - cto
  - cfo
  - coo
  - cmo
  - chro

management:
  - engineering-manager
  - product-manager
  - sales-manager
  - hr-manager
  - operations-manager
  - finance-manager
  - marketing-manager

individual-contributor:
  - software-engineer
  - data-analyst
  - data-scientist
  - designer
  - marketing
  - sales-rep
  - customer-success
  - legal
  - finance
  - devops
  - security

cross-functional:
  # 岗位无关的通用技能
```

---

## 最简贡献版本 · Minimal Contribution Version

**不想填那么多字段？** 只需提供以下必填项，其余由维护者帮你补全：

```markdown
---
id: "your/path/skill_name"
name: "技能名称"
persona: "角色描述"
objective: "任务目标"
output_format: "输出格式"
author: "your-github-username"
---

## 技能说明
[一句话描述]

## 系统提示词
[你的提示词]

## 输出示例
[一个好例子]
```

就这些！提交 PR，社区会帮你完善其余部分 🎉
