# 贡献指南 · Contributing to OpenSkill

**语言导航 · Language navigation:** [中文](#中文--contributing-in-chinese) · [English](#english--contributing-in-english)

**方向与协作 · Direction:** 路线图以 [data/roadmap.json](./data/roadmap.json) 为源（通过 PR 修改）；可在 GitHub 上直接浏览该 JSON 或通过本地编辑器阅读。

---

## 中文 — Contributing in Chinese

### 我们的承诺 · Our pledge（摘要）

OpenSkill 欢迎所有人参与：不论职级与背景，只要你在工作中用过 AI、愿意分享可复用的提示词经验，你的贡献都有价值。

> 完整社区行为准则见 **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)**（正文为英文，与 Contributor Covenant 2.1 一致）。

### 语言与翻译 · Language & translation

- **只会中文或只会英文也可以贡献**：在 `skills/.../` 下新增 **`{技能名}.zh.skill.md`** 与 **`{技能名}.en.skill.md`**（同一 **`id`**）；可先只提交一侧。  
- 在 PR 描述中注明 **`Translation needed: en`** 或 **`Translation needed: zh`**，或请维护者打上 **`needs-translation`** 标签（见 [GOVERNANCE.md](./docs/GOVERNANCE.md)），方便他人补译。  
- 允许 **机翻初稿** + 人工轻量校对。Release 中的 **`openskill.zh.json` / `openskill.en.json`** 按 locale 各出一条记录；全量 **`openskill.json`**（`format_version: 3`）合并双语字段，见 [SKILL_SCHEMA.md](./SKILL_SCHEMA.md)。  
- 本地校验：`npm run validate`；生成与发版相同的 JSON：`npm run export`（输出在 `dist/`，已 gitignore）。  
- **`tags`** 与 **`input_variables.example`** 按文件语言单语书写（`.zh` 仅中文标签/示例，`.en` 仅英文）；批量修正可运行 `npm run fix-locale-tags`（依赖 [tools/locale_tag_map.json](./tools/locale_tag_map.json)）。

**English:** Add **`{name}.zh.skill.md`** and **`{name}.en.skill.md`** with the same **`id`**; ship one locale first if needed. State **`Translation needed`** or **`needs-translation`**. **`openskill.json`** merges zh+en when both exist. Run **`npm run export`** locally to match CI output.

### 贡献方式

#### 方式一：提交新技能（最受欢迎）

不必会写代码，需要：

1. 相关岗位的实际工作经验  
2. 在某个**具体任务**上 AI 效果可靠  

**步骤**

1. **查重** — 浏览 [`skills/`](./skills/) 或 [在仓库内搜索](https://github.com/OpenAgenticOS/OpenSkill/search?q=extension%3Amd+skill)  
2. **按格式写文件** — 复制 [`SKILL_SCHEMA.md`](./SKILL_SCHEMA.md) 中的最简模板  
3. **放对目录** — `skills/{层级}/{岗位}/你的技能名.zh.skill.md` 与 `.../你的技能名.en.skill.md`（`id` 相同）  
4. **发 PR** — 标题建议：`[New Skill] 岗位/技能名`  
5. **等待评审** — 目标 **72 小时内** 首次回复（工作日）  

**不会用 Git？** 可在浏览器里 [在仓库中新建文件](https://github.com/OpenAgenticOS/OpenSkill/new/master)（路径放在对应岗位的 `skills/.../` 下）。GitHub 界面为英文时，可对照 README「如何贡献」中的 **Add file → Create new file**、**Propose new file**。

#### 方式 1b：可选分层字段、工作流与 Recipe

- **Skill frontmatter 扩展（均可选）**：`evaluation_rubric`、`test_cases`（评估）、`enhancers` 与 `composable_with`（工具/组合提示）。不填不影响校验通过；见 [SKILL_SCHEMA.md](./SKILL_SCHEMA.md) 与 [schema/skill.schema.json](./schema/skill.schema.json)。
- **工作流**：在 [`workflows/`](./workflows/) 下成对添加 `*.zh.workflow.md` 与 `*.en.workflow.md`，同一 `id`（如 `workflow/my_flow`），符合 [schema/workflow.schema.json](./schema/workflow.schema.json)。步骤为**声明式**，不要求特定 Agent 框架。
- **Recipe**：在 [`recipes/`](./recipes/) 下成对添加 `*.zh.recipe.md` 与 `*.en.recipe.md`，同一 `id`（如 `recipe/my_entry`），符合 [schema/recipe.schema.json](./schema/recipe.schema.json)。面向阅读与导航，非可执行脚本。

本地请运行 **`npm run validate`** 与 **`npm run export`**，确认生成 `dist/openskill.workflows.json`、`dist/openskill.recipes.json`。

- **评估 / 演进 / 渐进导出（可选）**：配置 **`OPENAI_API_KEY`**（或 **`LLM_API_KEY`**）与可选 **`OPENAI_BASE_URL`** 后，可对含 **`test_cases`** 的技能运行 **`npm run eval -- skills/.../x.zh.skill.md`**（支持 `--dry-run`、`--test-case`、`--out`）。**`npm run evolve -- skills/.../x.zh.skill.md`** 离线生成改进版系统提示词提案（JSON），**不会**自动改仓库文件。需要 `openskill.progressive.json` 与 `openskill.mcp-resources.json` 时运行 **`npm run export:all`**。脱敏后的执行记录可放在 **`traces/`**（YAML），校验见 [schema/trace.schema.json](./schema/trace.schema.json)。

#### 方式二：改进现有技能

直接编辑对应 `*.zh.skill.md` / `*.en.skill.md` 并发 PR；在描述里写清**改了什么、为何改、新输出好在哪里**。

#### 方式三：评测与反馈

不开 PR 也可以：在 Issue 里贴模型、输入摘要、输出摘录与主观评分（1–5），帮助维护者迭代质量。

#### 方式四：使用 Issue 模板

打开 [**Choose an issue template（选择模板）**](https://github.com/OpenAgenticOS/OpenSkill/issues/new/choose)，按需选择：

| 模板（界面英文名称以 GitHub 为准） | 用途 |
| --- | --- |
| New Skill / 新增技能 | 新技能想法、草稿提示词 |
| Skill Improvement / 技能改进 | 现有技能质量、分类、翻译问题 |
| Tooling & CI / 工具与 CI | 校验脚本、Actions、依赖 |
| Documentation / 文档 | README、贡献说明、索引类文档 |

### 技能质量标准（评审时会看）

| 标准 | 说明 |
| --- | --- |
| 原子性 | 一个 Skill 只做一件事 |
| 语言与翻译 | 完整中英更佳（zh + en 各一文件）；单语贡献请标注 **`Translation needed`** 或 **`needs-translation`**（见上文「语言与翻译」） |
| 输出示例 | 至少一个真实、可用的输出样例 |
| 验收标准 | 写清「怎样算做得好」 |
| 格式 | 通过仓库的 Schema 与 CI 校验 |

不强制：学术级完美、覆盖所有变体、绑定某一模型版本。

### PR 与合并流程

1. 推送 PR 后，CI 会做 Schema 校验、Markdown 规范检查，并检查 `docs/SKILL_INDEX.md` 是否与 `npm run build-index` 一致。  
2. Maintainer 会审核内容质量（技能是否原子、语言/翻译是否交代清楚、示例是否可信）。  
3. **合并要求**：至少 **1** 名 Maintainer 批准（与 [`tools/branch_protection.json`](./tools/branch_protection.json) 及 GitHub 分支保护一致；若组织改为 2 人，以仓库设置为准）。

### 本地开发（可选）

建议使用 **Node.js 24**（与 CI 及 Dev Container 一致）。

```bash
npm install          # Install dependencies · 安装依赖
npm run validate     # Validate all skills · 校验全部技能
npm run export       # Core dist/openskill*.json + workflows + recipes
npm run export:all   # 额外生成 progressive、mcp-resources（与站点部署 / Release 一致）
npm run build-index  # Regenerate docs/SKILL_INDEX.md · 更新索引（改技能后 PR 前请运行）
```

校验单个或多个文件（路径须在 `skills/` 下）：`npm run validate -- skills/c-suite/ceo/strategic_vision.zh.skill.md`

### 维护者：批量生成与回填（可选）

大改版时可在 `tools/specs/` 维护紧凑规格，运行 **`npm run emit-manifest`** 生成 **`tools/skill_manifest.json`**，再 **`npm run generate-skills`** 写出成对的 `*.en.skill.md` / `*.zh.skill.md`。存量技能的输出示例可用 **`npm run backfill-output-examples`**（数据来自 `tools/backfill_examples.json`，缺省时回退到 `tools/backfill_examples_seed.cjs`）。完成后请依次：**`npm run validate`** → **`npm run fix-locale-tags`** → **`npm run export`** → **`npm run build-index`**。

### 致谢说明

- 贡献者列表见 [CONTRIBUTORS.md](./CONTRIBUTORS.md) 与 [GitHub Contributors](https://github.com/OpenAgenticOS/OpenSkill/graphs/contributors)。  
- 请在技能 frontmatter 填写 `author`（GitHub 用户名）以便署名。

---

## English — Contributing in English

### Our pledge (summary)

OpenSkill is open to everyone. If you use AI in real work and can share a **reusable, role-specific prompt**, your contribution matters—no “AI expert” title required.

> Full community norms are in **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)** (English text, Contributor Covenant 2.1).

### Language & translation

- **You may ship Chinese-only or English-only first** — fill COSTAR, system prompt, and guidance in the language you know best.  
- Note **`Translation needed: en`** or **`Translation needed: zh`** in the PR, or ask maintainers for **`needs-translation`** (see [GOVERNANCE.md](./docs/GOVERNANCE.md)).  
- **Machine translation + light human review** is OK. Release bundles **`openskill.zh.json`** / **`openskill.en.json`** are per locale; full **`openskill.json`** merges pairs — see [SKILL_SCHEMA.md](./SKILL_SCHEMA.md).  
- Locally: **`npm run validate`** (optional: **`npm run validate -- path/to/file.zh.skill.md`**) and **`npm run export`** to match CI output under `dist/`.

### Ways to contribute

#### 1) Add a new skill (most common)

You do **not** need to be a developer. You need:

1. Real experience in a role, and  
2. A **single, concrete task** where the model output is reliably useful.

**Steps**

1. **Search first** — browse [`skills/`](./skills/) or [search the repo](https://github.com/OpenAgenticOS/OpenSkill/search?q=extension%3Amd+skill).  
2. **Copy the template** from [`SKILL_SCHEMA.md`](./SKILL_SCHEMA.md) (minimal template section).  
3. **Place the files** under `skills/{level}/{role}/your_skill_name.zh.skill.md` and `.../your_skill_name.en.skill.md` (same **`id`**).  
4. **Open a PR** — suggested title: `[New Skill] role/skill-name`.  
5. **Review** — we aim for a **first response within ~72 hours** on business days.

**New to Git?** Use the GitHub UI: [create a new file in the repo](https://github.com/OpenAgenticOS/OpenSkill/new/master) under the right `skills/...` path. If the UI is in Chinese, see the README **How to Contribute** section for the English button names (**Add file**, **Create new file**, **Propose new file**).

#### 1b) Optional layers: rubric, workflows, recipes

- **Skill frontmatter (all optional):** `evaluation_rubric`, `test_cases`, `enhancers`, `composable_with` — see [SKILL_SCHEMA.md](./SKILL_SCHEMA.md) / [schema/skill.schema.json](./schema/skill.schema.json). Skills without them still validate.
- **Workflows:** paired `workflows/*.zh.workflow.md` + `*.en.workflow.md`, same `id` like `workflow/my_flow`, schema [workflow.schema.json](./schema/workflow.schema.json). Steps are **declarative**; no runtime lock-in.
- **Recipes:** paired `recipes/*.zh.recipe.md` + `*.en.recipe.md`, same `id` like `recipe/my_entry`, schema [recipe.schema.json](./schema/recipe.schema.json). Human-readable entry guides only.

Run **`npm run validate`** and **`npm run export`** locally; expect `dist/openskill.workflows.json` and `dist/openskill.recipes.json`.

- **Eval / evolve / progressive export (optional):** With **`OPENAI_API_KEY`** or **`LLM_API_KEY`** (and optional **`OPENAI_BASE_URL`**), run **`npm run eval -- skills/.../x.en.skill.md`** on skills that define **`test_cases`** (`--dry-run`, `--test-case`, `--out`). **`npm run evolve -- skills/.../x.en.skill.md`** writes a JSON proposal only (does not modify the repo). For **`openskill.progressive.json`** and **`openskill.mcp-resources.json`**, run **`npm run export:all`**. Sanitized run logs may live under **`traces/`** as YAML — see [schema/trace.schema.json](./schema/trace.schema.json).

#### 2) Improve an existing skill

Edit the `*.zh.skill.md` / `*.en.skill.md` files and open a PR. Explain **what** changed, **why**, and how output quality improved.

#### 3) Feedback without a PR

Open an Issue with model name, a short input summary, an output excerpt, and a 1–5 quality rating.

#### 4) Issue templates

Use [**Choose an issue template**](https://github.com/OpenAgenticOS/OpenSkill/issues/new/choose):

| Template | Use for |
| --- | --- |
| New Skill | New skill ideas, draft prompts |
| Skill Improvement | Quality, taxonomy, translation |
| Tooling & CI | Validators, GitHub Actions, dependencies |
| Documentation | README, contributor docs, index docs |

### Quality bar (what reviewers check)

| Criterion | Meaning |
| --- | --- |
| Atomic | One skill = one task |
| Language & translation | Full zh+en is ideal; single-locale PRs should note **`Translation needed`** or **`needs-translation`** (see **Language & translation** above), or use `*_zh` / `*_en` fields |
| Example | At least one real, trustworthy output sample |
| Acceptance criteria | Clear “what good looks like” |
| Format | Passes schema validation and CI |

Not required: academic perfection, every edge case, or locking to one model.

### PR & merge

1. CI runs schema validation, Markdown lint, and checks that `docs/SKILL_INDEX.md` matches `npm run build-index`.  
2. Maintainers review substance (atomicity, language/translation handling, examples).  
3. **Merge**: at least **1** approving review from a Maintainer (see [`tools/branch_protection.json`](./tools/branch_protection.json) and branch protection; if your org requires 2, follow the repo settings).

### Local setup (optional)

Use **Node.js 24** (same as CI and the Dev Container).

```bash
npm install
npm run validate
npm run export        # Core JSON bundles under dist/
npm run export:all    # Also progressive + MCP resource JSON (same as site deploy / release)
npm run build-index   # Run before pushing skill changes so the index stays in sync
```

Single or multiple files (must be under `skills/`): `npm run validate -- path/to/file.zh.skill.md`

### Maintainers: bulk generation & backfill (optional)

For large refreshes, maintain compact specs under **`tools/specs/`**, run **`npm run emit-manifest`** to build **`tools/skill_manifest.json`**, then **`npm run generate-skills`** to emit paired `*.en.skill.md` / `*.zh.skill.md`. To replace **Output Example** sections on existing files, use **`npm run backfill-output-examples`** (reads **`tools/backfill_examples.json`**, falling back to **`tools/backfill_examples_seed.cjs`**). Then run **`npm run validate`**, **`npm run fix-locale-tags`**, **`npm run export`**, and **`npm run build-index`**.

### Recognition

- See [CONTRIBUTORS.md](./CONTRIBUTORS.md) and the [GitHub contributors graph](https://github.com/OpenAgenticOS/OpenSkill/graphs/contributors).  
- Set `author` in the skill frontmatter to credit your GitHub username.

---

感谢你让 OpenSkill 变得更好。  
Thank you for making OpenSkill better.
