<div align="center">

# 🧠 OpenSkill

**企业大模型技能库 · Enterprise AI Skill Library**

*从 CEO 到一线员工，每个岗位都有专属的 AI 使用技能*
*From CEO to frontline — specialized AI skills for every enterprise role*

[![Skills](https://img.shields.io/badge/Skills-39-brightgreen?style=flat-square&logo=bookstack)](./skills/)
[![Sponsor](https://img.shields.io/badge/Sponsor-30363D?style=flat-square&logo=GitHub-Sponsors&logoColor=EA4AAA)](https://github.com/sponsors/OpenAgenticOS)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](./LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-orange?style=flat-square&logo=github)](./CONTRIBUTING.md)
[![CI](https://github.com/OpenAgenticOS/OpenSkill/actions/workflows/validate_skills.yml/badge.svg)](https://github.com/OpenAgenticOS/OpenSkill/actions/workflows/validate_skills.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](https://github.com/OpenAgenticOS/OpenSkill/pulls)
[![Open in Dev Containers](https://img.shields.io/badge/Dev%20Containers-Open-007ACC?style=flat-square&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/clone?url=https://github.com/OpenAgenticOS/OpenSkill)

[English](#english) · [中文](#中文) · [Vision 愿景](#vision) · [Contribute 贡献](#-如何贡献--how-to-contribute) · [Community 社区](#community)

</div>

---

<a id="vision"></a>

## Vision · 愿景

与 [data/roadmap.json](./data/roadmap.json) 中 `vision` 字段一致 · Same as the `vision` field in that file:

> **中文：** 打造可复用、可评审的企业大模型技能库，以双语为方向（可先单语并标注翻译协作），覆盖从高管到一线岗位；社区通过 Issue/PR 模板贡献，CI 保障格式与质量。
>
> **English:** A reusable, reviewable enterprise LLM skill library—bilingual by aspiration, with single-locale first contributions welcome when translation needs are noted—from leadership to frontline roles, with community contributions via Issue/PR templates and CI guarding format and quality.

---

## 中文

### 什么是 OpenSkill？

OpenSkill 是一个**开源的企业级大模型技能库**，收录了从 CEO 到一线员工各个岗位的高质量 AI 技能（System Prompts）。

每个"技能"（Skill）都是一个**即用型的提示词**，设计原则：
- 🎯 **原子级**：一个 Skill 只做一件事，做好做深
- 🌐 **双语**：目标为每个 Skill 具备中英可用内容；也欢迎先提交单语并标注翻译需求（见 [CONTRIBUTING.md](./CONTRIBUTING.md)）
- ✅ **可评审**：每个 Skill 以包含真实输出示例为目标（存量内容持续补齐）
- 🔌 **框架无关**：兼容 ChatGPT / Claude / Gemini / 开源模型

### 为什么需要 OpenSkill？

当前大多数提示词库存在以下问题：
- ❌ 通用化，没有针对特定岗位的深度设计
- ❌ 质量参差不齐，无法评估
- ❌ 无法版本控制，团队无法复用
- ❌ 与 Agent 框架不兼容

OpenSkill 的解法：用**结构化的 Skill 格式（基于 COSTAR 框架）**解决以上所有问题，并建立社区驱动的质量保障体系。

---

## English

### What is OpenSkill?

OpenSkill is an **open-source enterprise AI skill library** containing high-quality AI skills (system prompts) for every role, from CEO to frontline employees.

Each "Skill" is a **ready-to-use prompt** designed with:
- 🎯 **Atomic**: One Skill does one thing — deeply and well
- 🌐 **Bilingual**: We aim for Chinese and English coverage per skill; single-locale first contributions are welcome with a clear translation note (see [CONTRIBUTING.md](./CONTRIBUTING.md))
- ✅ **Reviewable**: Every Skill aims to include a real output example (we keep backfilling gaps)
- 🔌 **Model-agnostic**: Works with ChatGPT, Claude, Gemini, and open-source models

### Why OpenSkill?

Most prompt libraries today are:
- ❌ Too generic — little depth for specific job roles  
- ❌ Uneven quality — hard to judge what “good” looks like  
- ❌ Hard to version — teams can’t reuse safely  
- ❌ Weak fit for agents — not structured for tooling  

OpenSkill addresses this with a **structured COSTAR-based skill format** and **community-driven quality norms**.

---

## 📚 技能目录 · Skill Directory

<table>
<thead>
<tr>
<th>层级 Level</th>
<th>岗位 Roles</th>
<th>技能数 Skills</th>
</tr>
</thead>
<tbody>
<tr>
<td>🏢 <strong>C-Suite</strong></td>
<td>
  <a href="./skills/c-suite/ceo/">CEO</a> ·
  <a href="./skills/c-suite/cto/">CTO</a> ·
  <a href="./skills/c-suite/cfo/">CFO</a> ·
  <a href="./skills/c-suite/coo/">COO</a> ·
  <a href="./skills/c-suite/cmo/">CMO</a> ·
  <a href="./skills/c-suite/chro/">CHRO</a>
</td>
<td>
  <img src="https://img.shields.io/badge/20-skills-blue?style=flat-square" alt="20 skills in C-Suite folders" />
</td>
</tr>
<tr>
<td>👔 <strong>Management</strong></td>
<td>
  <a href="./skills/management/engineering-manager/">Engineering Manager</a> ·
  <a href="./skills/management/product-manager/">Product Manager</a> ·
  <a href="./skills/management/hr-manager/">HR Manager</a> ·
  <a href="./skills/management/sales-manager/">Sales Manager</a>
</td>
<td>
  <img src="https://img.shields.io/badge/7-skills-blue?style=flat-square" alt="7 skills in Management folders" />
</td>
</tr>
<tr>
<td>💻 <strong>Individual Contributor</strong></td>
<td>
  <a href="./skills/individual-contributor/software-engineer/">Software Engineer</a> ·
  <a href="./skills/individual-contributor/data-analyst/">Data Analyst</a> ·
  <a href="./skills/individual-contributor/data-scientist/">Data Scientist</a> ·
  <a href="./skills/individual-contributor/designer/">Designer</a> ·
  <a href="./skills/individual-contributor/marketing/">Marketing</a> ·
  <a href="./skills/individual-contributor/sales-rep/">Sales Rep</a> ·
  <a href="./skills/individual-contributor/customer-success/">Customer Success</a> ·
  <a href="./skills/individual-contributor/legal/">Legal</a> ·
  <a href="./skills/individual-contributor/finance/">Finance</a> ·
  <a href="./skills/individual-contributor/devops/">DevOps</a> ·
  <a href="./skills/individual-contributor/security/">Security</a>
</td>
<td>
  <img src="https://img.shields.io/badge/11-skills-blue?style=flat-square" alt="11 skills in IC folders" />
</td>
</tr>
<tr>
<td>🌐 <strong>Cross-functional</strong></td>
<td>
  <a href="./skills/cross-functional/">OKR · Meeting · Email · Data Storytelling</a>
</td>
<td>
  <img src="https://img.shields.io/badge/1-skills-blue?style=flat-square" alt="1 skill cross-functional" />
</td>
</tr>
</tbody>
</table>

> 📈 **欢迎共建** · **Built with the community** — 通过 Issue / PR 提交技能与改进 · Submit skills and improvements via Issues and PRs

---

## ⚡ 5 分钟快速上手 · 5-Minute Quick Start

### 方式一：直接复制使用 · Direct Copy-Paste

1. 找到你岗位的技能目录（如 [CEO 战略愿景](./skills/c-suite/ceo/strategic_vision.skill.md)）
2. 复制「系统提示词」部分到 ChatGPT/Claude 的 System Prompt 区域
3. 用「用户提示词模板」填入你的实际内容，发送即可

### 方式二：Release 聚合 JSON（推荐集成）· Release bundle (recommended)

每个 [GitHub Release](https://github.com/OpenAgenticOS/OpenSkill/releases) 附带：

- **`openskill.json`** — 全量记录（含可选 `persona_zh` / `system_prompt_zh` 等拆分字段，见 [SKILL_SCHEMA.md](./SKILL_SCHEMA.md)）
- **`openskill.zh.json`** — `locale: "zh"`，每条 skill 的 COSTAR / `system_prompt` 已解析为中文侧（无拆分时与正文一致）
- **`openskill.en.json`** — `locale: "en"`，英文侧同上

维护者推送 **`v*`** 标签即可由 Actions 构建并上传；下载地址与 **owner/repo** 无关，fork 亦适用。

**English:** Each release ships **`openskill.json`** (full), **`openskill.zh.json`**, and **`openskill.en.json`** with resolved `system_prompt` per locale. Push a **`v*`** tag to build (any fork uses its own Releases URL).

```python
import json
import urllib.request

BASE = "https://github.com/OpenAgenticOS/OpenSkill/releases/latest/download"
for name in ("openskill.json", "openskill.zh.json", "openskill.en.json"):
    with urllib.request.urlopen(f"{BASE}/{name}") as r:
        bundle = json.loads(r.read().decode())
    print(name, "skills:", bundle["skills_count"])

with urllib.request.urlopen(f"{BASE}/openskill.en.json") as r:
    bundle = json.loads(r.read().decode())
by_id = {s["id"]: s for s in bundle["skills"]}
skill = by_id["c-suite/ceo/strategic_vision"]
print(skill["name"], len(skill["system_prompt"]))
```

本地生成（需 Node 24）：`npm ci && npm run export` → 写入 `dist/openskill.json`、`dist/openskill.zh.json`、`dist/openskill.en.json`（`dist/` 在 `.gitignore` 中）。

**English (local):** `npm ci && npm run export` writes the three JSON files under `dist/` (gitignored).

### 方式三：Python 读 Raw `.skill.md` · Python raw Markdown

```python
# pip install requests pyyaml
import yaml, re, requests

def load_skill(skill_path: str) -> dict:
    """Load a skill from GitHub raw URL"""
    url = f"https://raw.githubusercontent.com/OpenAgenticOS/OpenSkill/master/skills/{skill_path}.skill.md"
    content = requests.get(url).text
    # Extract YAML frontmatter
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    frontmatter = yaml.safe_load(match.group(1))
    # Extract system prompt block
    prompt_match = re.search(r'## 系统提示词.*?```(?:xml)?\n(.*?)```', content, re.DOTALL)
    frontmatter['system_prompt'] = prompt_match.group(1) if prompt_match else ""
    return frontmatter

# Load and use a skill
skill = load_skill("c-suite/ceo/strategic_vision")
print(f"Loaded: {skill['name']}")
print(f"System Prompt Preview:\n{skill['system_prompt'][:200]}...")
```

### 方式四：LangChain 集成 · LangChain Integration

```python
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

skill = load_skill("individual-contributor/software-engineer/code_review")

llm = ChatOpenAI(model="gpt-5.4")
response = llm.invoke([
    SystemMessage(content=skill['system_prompt']),
    HumanMessage(content=f"请评审以下代码：\n```python\n{your_code}\n```")
])
print(response.content)
```

---

## 🤝 如何贡献 · How to Contribute

**OpenSkill 的核心是社区。** 你不需要是 AI 专家，只需要有某个岗位的实际工作经验！

OpenSkill's core is its community. You don't need to be an AI expert — just real work experience in any role!

### 最快的贡献方式 · Fastest Way to Contribute

**在 GitHub 网页上直接添加新技能（无需本地环境）：**

1. 进入 [`skills/`](./skills/) 找到你的岗位目录
2. 点击右上角 **「Add file」→「Create new file」**
3. 文件名格式：`你的技能名.skill.md`
4. 复制 [最简贡献模板](./SKILL_SCHEMA.md#最简贡献版本--minimal-contribution-version)
5. 填写内容，点击 **「Propose new file」** 提交 PR

**就这么简单！** 维护者会在 72 小时内帮你完善格式。

**语言：** 可先只写中文或只写英文；若另一侧尚未补齐，请在 PR 里注明 **`Translation needed: en`** 或 **`Translation needed: zh`**（或请维护者打 **`needs-translation`** 标签）。详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

**English (same flow):** Open [`skills/`](./skills/), use **Add file → Create new file**, name your file `something.skill.md`, paste the [minimal template](./SKILL_SCHEMA.md#最简贡献版本--minimal-contribution-version), then **Propose new file** to open a PR. Maintainers typically respond within ~72 hours.

**Language:** You may start in **Chinese or English only**; if the other locale is not ready, note **`Translation needed: en`** or **`Translation needed: zh`** in the PR (or ask for **`needs-translation`**). See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

| 贡献方式 · How to contribute | 难度 · Level | 时间 · Time |
| --- | --- | --- |
| 🌟 [新技能 / New skill](https://github.com/OpenAgenticOS/OpenSkill/issues/new?template=new_skill.yml) | ⭐ 简单 · Easy | 15 min |
| 🔧 [改进技能 / Improve skill](https://github.com/OpenAgenticOS/OpenSkill/issues/new?template=skill_improvement.yml) | ⭐ 简单 · Easy | 10 min |
| 💬 [测试反馈 / Test & feedback](https://github.com/OpenAgenticOS/OpenSkill/issues) | ⭐ 简单 · Easy | 5 min |
| 📖 [文档 / Docs](https://github.com/OpenAgenticOS/OpenSkill/pulls) | ⭐⭐ 中等 · Medium | 30 min |
| 🛠️ [工具链 / Tooling](./tools/) | ⭐⭐⭐ 进阶 · Advanced | 1+ h |

---

<a id="community"></a>

## 社区与交流 · Community

- **[GitHub Discussions](https://github.com/OpenAgenticOS/OpenSkill/discussions)** — 用法交流、集成与想法（可先搜索是否已有主题）· Q&A, integrations, and ideas  
- **[Issues](https://github.com/OpenAgenticOS/OpenSkill/issues)** — 缺陷、技能提案与模板化反馈 · Bugs, skill proposals, and structured feedback  
- **[Code of Conduct](./CODE_OF_CONDUCT.md)** — 参与前请阅读 · Please read before participating  
- **[Security](./SECURITY.md)** — **漏洞请按此私下报告，勿发公开 Issue** · Report vulnerabilities privately, not in public issues  

---

## 🧑‍💻 开发者与维护 · Developers & maintainers

本地运行 `npm run validate` / `npm run build-index` / `npm run export` 请使用 **Node.js 24**（与 `package.json` 的 `engines` 及 CI 一致）。  
**English:** Use **Node.js 24** locally for `npm run validate` / `npm run build-index` / `npm run export` (matches `package.json` `engines` and CI).

**发版 · Cutting a release：** 打标签并推送即可触发 **Release · dist bundle** 工作流，上传 `openskill.json`、`openskill.zh.json`、`openskill.en.json` 与 zip：`git tag v1.0.0 && git push origin v1.0.0`（需仓库 **Actions → General → Workflow permissions** 允许 **Read and write**）。Fork 上同样按各自 `owner/repo` 生成 Release。  
**English:** Tag and push to run **Release · dist bundle**: uploads three JSON files plus zip. `git tag v1.0.0 && git push origin v1.0.0` (enable **Workflow permissions → Read and write**). Forks publish under their own owner.

| 文档 · Doc | 中文 | English |
| --- | --- | --- |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | 贡献流程、单语/翻译标注、本地校验、合并预期 | Contributor flow, single-locale & translation notes, local validation, merge expectations |
| [docs/GOVERNANCE.md](./docs/GOVERNANCE.md) | 响应时间、标签、Discussions、分支保护说明 | Response SLA, labels, Discussions, branch protection notes |
| [docs/SKILL_INDEX.md](./docs/SKILL_INDEX.md) | 机器生成技能索引（`npm run build-index`） | Generated skill index (`npm run build-index`) |
| [SKILL_SCHEMA.md](./SKILL_SCHEMA.md) | Skill 完整格式与字段说明 | Full skill format and frontmatter reference |
| [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | 社区行为准则（正文英 + 顶部中文概要） | Code of Conduct (EN body, CN summary on top) |
| [SECURITY.md](./SECURITY.md) | 安全披露方式 | How to report security issues |

**赞助 · Sponsors:** 若组织已开通 GitHub Sponsors，可通过页顶 [Sponsor 徽章](https://github.com/sponsors/OpenAgenticOS) 支持；配置见 [.github/FUNDING.yml](./.github/FUNDING.yml)。  
**Sponsors:** If the org has GitHub Sponsors enabled, use the badge above — settings live in [.github/FUNDING.yml](./.github/FUNDING.yml).

**中文：** 可选安装 [Dev Containers](https://containers.dev/)，在 VS Code 中 **Reopen in Container**，容器内已配置 Node 24 与 `npm ci`。

**English:** Optional: install [Dev Containers](https://containers.dev/) and use **Reopen in Container** in VS Code; the image uses Node 24 and runs `npm ci` on create.

---

## 🏗️ 项目结构 · Project Structure

```
OpenSkill/
├── skills/                         # 技能库主体
│   ├── c-suite/                    # 高管层 (CEO/CTO/CFO/COO/CMO/CHRO)
│   ├── management/                 # 中层管理
│   ├── individual-contributor/     # 一线（工程/数据/营销/销售等，见表格）
│   └── cross-functional/           # 跨职能通用
├── data/                           # roadmap.json（愿景与阶段计划，维护者参考）
├── docs/                           # 治理、技能索引
├── schema/
│   └── skill.schema.json           # Skill 格式 JSON Schema
├── tools/
│   ├── validate.js                 # Schema + 章节校验（可传 skills/ 下路径；npm run validate -- …）
│   ├── export_skills.js            # 生成 dist/openskill*.json（发版用）
│   ├── count_skills.js             # 统计输出
│   └── build_index.js              # 生成 docs/SKILL_INDEX.md
├── .github/
│   ├── workflows/                  # CI、发版 dist、Dependabot 等
│   ├── ISSUE_TEMPLATE/             # 结构化 Issue 模板
│   ├── dependabot.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── .devcontainer/                  # Dev Containers（可选）
├── SKILL_SCHEMA.md                 # 完整格式文档
├── CONTRIBUTING.md                 # 贡献指南
├── CODE_OF_CONDUCT.md
└── SECURITY.md
```

---

## 📐 Skill 格式设计 · Skill Format Design

基于 **COSTAR 框架**（企业 LLM 2025 年最佳实践）设计：

| 维度 | 作用 |
| --- | --- |
| **P**ersona | AI 扮演什么角色 |
| **O**bjective | 要完成什么任务 |
| **S**tyle | 期望的输出风格 |
| **T**one | 期望的语气 |
| **A**udience | 面向什么受众 |
| **R**esponse Format | 期望的输出格式 |

> 延伸阅读 · Further reading: *PersonaHub* ([arXiv:2406.20094](https://arxiv.org/abs/2406.20094))；COSTAR 类结构化提示在企业落地中较常见。  
> *Further reading:* *PersonaHub* ([arXiv:2406.20094](https://arxiv.org/abs/2406.20094)); structured prompts like COSTAR are widely used in enterprise practice.

---

## 🌟 Contributors

<a href="https://github.com/OpenAgenticOS/OpenSkill/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=OpenAgenticOS/OpenSkill" />
</a>

**想加入这个列表？** [提交你的第一个 Skill！](https://github.com/OpenAgenticOS/OpenSkill/issues/new?template=new_skill.yml)

---

## 📄 License

MIT © [OpenAgenticOS](https://github.com/OpenAgenticOS) · [Contributors 贡献者](./CONTRIBUTORS.md) · [Code of Conduct](./CODE_OF_CONDUCT.md) · [Security](./SECURITY.md)

<div align="center">

**如果 OpenSkill 对你有帮助，请 ⭐ Star 这个仓库！**
**If OpenSkill helps you, please ⭐ Star this repo!**

</div>
