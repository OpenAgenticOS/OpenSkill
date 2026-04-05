# 贡献指南 · Contributing to OpenSkill

**语言导航 · Language navigation:** [中文](#中文--contributing-in-chinese) · [English](#english--contributing-in-english)

**方向与协作 · Direction:** 路线图源数据为 [data/roadmap.json](./data/roadmap.json)（PR 修改）；可读版在 [docs/wiki-mirror/Roadmap.md](https://github.com/OpenAgenticOS/OpenSkill/blob/master/docs/wiki-mirror/Roadmap.md)（Actions 自动提交）。可选 PAT / `PROJECT_NUMBER` 同步 GitHub Wiki 与 [Projects](https://github.com/OpenAgenticOS/OpenSkill/projects)，见 [Automation.md](https://github.com/OpenAgenticOS/OpenSkill/blob/master/docs/wiki-mirror/Automation.md)。

---

## 中文 — Contributing in Chinese

### 我们的承诺 · Our pledge（摘要）

OpenSkill 欢迎所有人参与：不论职级与背景，只要你在工作中用过 AI、愿意分享可复用的提示词经验，你的贡献都有价值。

> 完整社区行为准则见 **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)**（正文为英文，与 Contributor Covenant 2.1 一致）。

### 贡献方式

#### 方式一：提交新技能（最受欢迎）

不必会写代码，需要：

1. 相关岗位的实际工作经验  
2. 在某个**具体任务**上 AI 效果可靠  

**步骤**

1. **查重** — 浏览 [`skills/`](./skills/) 或 [在仓库内搜索](https://github.com/OpenAgenticOS/OpenSkill/search?q=extension%3Amd+skill)  
2. **按格式写文件** — 复制 [`SKILL_SCHEMA.md`](./SKILL_SCHEMA.md) 中的最简模板  
3. **放对目录** — `skills/{层级}/{岗位}/你的技能名.skill.md`  
4. **发 PR** — 标题建议：`[New Skill] 岗位/技能名`  
5. **等待评审** — 目标 **72 小时内** 首次回复（工作日）  

**不会用 Git？** 可在浏览器里 [在仓库中新建文件](https://github.com/OpenAgenticOS/OpenSkill/new/master)（路径放在对应岗位的 `skills/.../` 下）。GitHub 界面为英文时，可对照 README「如何贡献」中的 **Add file → Create new file**、**Propose new file**。

#### 方式二：改进现有技能

直接编辑对应 `.skill.md` 并发 PR；在描述里写清**改了什么、为何改、新输出好在哪里**。

#### 方式三：评测与反馈

不开 PR 也可以：在 Issue 里贴模型、输入摘要、输出摘录与主观评分（1–5），帮助维护者迭代质量。

#### 方式四：使用 Issue 模板

打开 [**Choose an issue template（选择模板）**](https://github.com/OpenAgenticOS/OpenSkill/issues/new/choose)，按需选择：

| 模板（界面英文名称以 GitHub 为准） | 用途 |
|-------------------------------------|------|
| New Skill / 新增技能 | 新技能想法、草稿提示词 |
| Skill Improvement / 技能改进 | 现有技能质量、分类、翻译问题 |
| Tooling & CI / 工具与 CI | 校验脚本、Actions、依赖 |
| Documentation / 文档 | README、贡献说明、索引类文档 |

### 技能质量标准（评审时会看）

| 标准 | 说明 |
|------|------|
| 原子性 | 一个 Skill 只做一件事 |
| 双语 | 中英文并列（可先机翻再人工校对） |
| 输出示例 | 至少一个真实、可用的输出样例 |
| 验收标准 | 写清「怎样算做得好」 |
| 格式 | 通过仓库的 Schema 与 CI 校验 |

不强制：学术级完美、覆盖所有变体、绑定某一模型版本。

### PR 与合并流程

1. 推送 PR 后，CI 会做 Schema 校验、Markdown 规范检查，并检查 `docs/SKILL_INDEX.md` 是否与 `npm run build-index` 一致。  
2. Maintainer 会审核内容质量（技能是否原子、双语、示例是否可信）。  
3. **合并要求**：至少 **1** 名 Maintainer 批准（与 [`tools/branch_protection.json`](./tools/branch_protection.json) 及 GitHub 分支保护一致；若组织改为 2 人，以仓库设置为准）。

### 本地开发（可选）

```bash
npm install          # Install dependencies · 安装依赖
npm run validate     # Validate all skills · 校验全部技能
npm run build-index  # Regenerate docs/SKILL_INDEX.md · 更新索引（改技能后 PR 前请运行）
```

校验单个文件：`npm run validate skills/c-suite/ceo/strategic_vision.skill.md`

### 致谢说明

- 贡献者列表见 [CONTRIBUTORS.md](./CONTRIBUTORS.md) 与 [GitHub Contributors](https://github.com/OpenAgenticOS/OpenSkill/graphs/contributors)。  
- 请在技能 frontmatter 填写 `author`（GitHub 用户名）以便署名。

---

## English — Contributing in English

### Our pledge (summary)

OpenSkill is open to everyone. If you use AI in real work and can share a **reusable, role-specific prompt**, your contribution matters—no “AI expert” title required.

> Full community norms are in **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)** (English text, Contributor Covenant 2.1).

### Ways to contribute

#### 1) Add a new skill (most common)

You do **not** need to be a developer. You need:

1. Real experience in a role, and  
2. A **single, concrete task** where the model output is reliably useful.

**Steps**

1. **Search first** — browse [`skills/`](./skills/) or [search the repo](https://github.com/OpenAgenticOS/OpenSkill/search?q=extension%3Amd+skill).  
2. **Copy the template** from [`SKILL_SCHEMA.md`](./SKILL_SCHEMA.md) (minimal template section).  
3. **Place the file** under `skills/{level}/{role}/your_skill_name.skill.md`.  
4. **Open a PR** — suggested title: `[New Skill] role/skill-name`.  
5. **Review** — we aim for a **first response within ~72 hours** on business days.

**New to Git?** Use the GitHub UI: [create a new file in the repo](https://github.com/OpenAgenticOS/OpenSkill/new/master) under the right `skills/...` path. If the UI is in Chinese, see the README **How to Contribute** section for the English button names (**Add file**, **Create new file**, **Propose new file**).

#### 2) Improve an existing skill

Edit the `.skill.md` file and open a PR. Explain **what** changed, **why**, and how output quality improved.

#### 3) Feedback without a PR

Open an Issue with model name, a short input summary, an output excerpt, and a 1–5 quality rating.

#### 4) Issue templates

Use [**Choose an issue template**](https://github.com/OpenAgenticOS/OpenSkill/issues/new/choose):

| Template | Use for |
|----------|---------|
| New Skill | New skill ideas, draft prompts |
| Skill Improvement | Quality, taxonomy, translation |
| Tooling & CI | Validators, GitHub Actions, dependencies |
| Documentation | README, contributor docs, index docs |

### Quality bar (what reviewers check)

| Criterion | Meaning |
|-----------|---------|
| Atomic | One skill = one task |
| Bilingual | Chinese **and** English in the file (machine translation OK if reviewed) |
| Example | At least one real, trustworthy output sample |
| Acceptance criteria | Clear “what good looks like” |
| Format | Passes schema validation and CI |

Not required: academic perfection, every edge case, or locking to one model.

### PR & merge

1. CI runs schema validation, Markdown lint, and checks that `docs/SKILL_INDEX.md` matches `npm run build-index`.  
2. Maintainers review substance (atomicity, bilingual content, examples).  
3. **Merge**: at least **1** approving review from a Maintainer (see [`tools/branch_protection.json`](./tools/branch_protection.json) and branch protection; if your org requires 2, follow the repo settings).

### Local setup (optional)

```bash
npm install
npm run validate
npm run build-index   # Run before pushing skill changes so the index stays in sync
```

Single file: `npm run validate path/to/file.skill.md`

### Recognition

- See [CONTRIBUTORS.md](./CONTRIBUTORS.md) and the [GitHub contributors graph](https://github.com/OpenAgenticOS/OpenSkill/graphs/contributors).  
- Set `author` in the skill frontmatter to credit your GitHub username.

---

感谢你让 OpenSkill 变得更好。  
Thank you for making OpenSkill better.
