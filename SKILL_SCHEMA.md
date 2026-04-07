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

每个技能由 **两个文件** 组成，**同一目录、同一 `id`**，仅语言不同：

- **`{技能名}.zh.skill.md`** — 纯中文 frontmatter + 正文（章节标题用中文，如 `## 技能说明`、`## 系统提示词`）
- **`{技能名}.en.skill.md`** — 纯英文 frontmatter + 正文（章节标题用英文，如 `## Description`、`## System Prompt`）

可先只提交一侧；缺另一侧时请在 PR 中注明 **`Translation needed: en`** / **`Translation needed: zh`**，或请维护者打上 **`needs-translation`** 标签（见 [CONTRIBUTING.md](./CONTRIBUTING.md)、[docs/GOVERNANCE.md](./docs/GOVERNANCE.md)）。可选 **`translation_status`** 见 schema。

**English:** Each skill is **two files** with the same **`id`**: `*.zh.skill.md` and `*.en.skill.md`. Ship one locale first if needed; note **Translation needed** or **`needs-translation`**.

---

## 文件命名规则 · Naming Convention

```
skills/{层级}/{岗位}/{技能名}.zh.skill.md
skills/{层级}/{岗位}/{技能名}.en.skill.md

# 示例（同一 id: c-suite/ceo/strategic_vision）
skills/c-suite/ceo/strategic_vision.zh.skill.md
skills/c-suite/ceo/strategic_vision.en.skill.md
skills/management/product-manager/prd_writing.zh.skill.md
skills/management/product-manager/prd_writing.en.skill.md
```

---

## 完整格式模板 · Full Template

````markdown
---
# ── 必填字段 (Required) ─────────────────────────────────────────────
id: "{category}/{subcategory}/{skill_name}"        # 全局唯一ID（.zh 与 .en 文件必须相同）
name: "技能中文名"                                 # 本文件语言内的显示名（中文文件写中文名）
version: "1.0.0"
category: "c-suite/ceo"                            # 见下方分类表
tags: ["tag1", "tag2", "tag3"]                     # 3-6个标签
locale: "zh"                                       # 必填：zh | en（须与文件名 .zh / .en 一致）

# ── COSTAR 六维定义 (Required) — 单语，勿中英混写 ───────────────────
persona: |
  本文件语言下的角色设定（中文文件全中文，英文文件全英文）。

objective: |
  本文件语言下的任务目标。

style: |
  输出风格（单语）。

tone: |
  语气（单语）。

audience: |
  受众（单语）。

output_format: |
  输出格式说明（单语）。

# ── 可选字段 (Optional) ─────────────────────────────────────────────
input_variables:
  - name: "variable_name"
    description: "变量说明"
    required: true
    example: "示例值"

compatible_models:
  - "gpt-5.4"
  - "claude-sonnet-4-6"
  - "gemini-2.5-pro"
  - "qwen3.5-plus"
  - "deepseek-chat"

language: "zh"           # 可选；通常与 locale 一致
translation_status: "complete"   # 可选：complete | partial | pending
difficulty: "intermediate"  # beginner | intermediate | advanced
estimated_time: "5-10 min"  # 预计运行一次的时间

# ── 贡献信息 (Auto-filled by CI) ────────────────────────────────────
author: "your-github-username"
created_at: "2025-01-01"   # 建议引号包裹，避免 YAML 解析为日期类型
---

## 技能说明

> 用 1-3 句话描述这个技能能做什么，以及什么时候应该使用它。

**适用场景：**
- 场景一
- 场景二

（英文文件请使用 `## Description` 等英文标题，见同目录 `*.en.skill.md` 范例。）

---

## 系统提示词

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

## Release 与导出 JSON · Release & export JSON

CI 与 `npm run export` 会生成（**`format_version: 3`**）：

- **`openskill.zh.json`** / **`openskill.en.json`** — 每个 `id` 一条记录，来自对应 locale 文件（`locale`、`persona`、`system_prompt` 等为单语）。
- **`openskill.json`** — 按 `id` **合并** zh + en：`persona_zh` / `persona_en`、`system_prompt_zh` / `system_prompt_en`、`name_zh` / `name_en`、`locales` 等（详见导出脚本）。

校验器按文件检查 `locale` 与文件名一致，并对缺失的 zh/en 配对给出警告。Schema 见 [schema/skill.schema.json](./schema/skill.schema.json)。

**English:** Three bundles; merged full record uses `*_zh` / `*_en` fields when both locales exist.

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

## 相关技能

- [相关技能1](../related_skill.zh.skill.md)
- [相关技能2](../../other/skill.zh.skill.md)

（英文正文 `## Related Skills` 中请链接 `*.en.skill.md`。）
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

**不想填那么多字段？** 至少各建 **`your_skill.zh.skill.md`** 与 **`your_skill.en.skill.md`**（`id` 相同），填齐必填项；其余由维护者帮你补全。

```markdown
---
id: "your/path/skill_name"
name: "技能名称"
locale: "zh"
persona: "角色描述"
objective: "任务目标"
output_format: "输出格式"
author: "your-github-username"
created_at: "2025-01-01"
---

## 技能说明
[一句话描述]

## 系统提示词
[你的提示词]

## 输出示例
[一个好例子]
```

就这些！提交 PR，社区会帮你完善其余部分 🎉
