<div align="center">

# 🧠 OpenSkill

**企业大模型技能库 · Enterprise AI Skill Library**

*从 CEO 到一线员工，每个岗位都有专属的 AI 使用技能*
*From CEO to frontline — specialized AI skills for every enterprise role*

[![Skills](https://img.shields.io/badge/Skills-7-brightgreen?style=flat-square&logo=bookstack)](./skills/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](./LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-orange?style=flat-square&logo=github)](./CONTRIBUTING.md)
[![CI](https://img.shields.io/github/actions/workflow/status/OpenAgenticOS/OpenSkill/validate_skills.yml?label=CI%20Validation&style=flat-square&logo=githubactions)](https://github.com/OpenAgenticOS/OpenSkill/actions)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](https://github.com/OpenAgenticOS/OpenSkill/pulls)

[English](#english) · [中文](#中文) · [Contribute 贡献](#-如何贡献--how-to-contribute)

</div>

---

## 中文

### 什么是 OpenSkill？

OpenSkill 是一个**开源的企业级大模型技能库**，收录了从 CEO 到一线员工各个岗位的高质量 AI 技能（System Prompts）。

每个"技能"（Skill）都是一个**即用型的提示词**，设计原则：
- 🎯 **原子级**：一个 Skill 只做一件事，做好做深
- 🌐 **双语**：所有 Skill 提供中英文版本
- ✅ **经过测试**：每个 Skill 都有真实输出示例
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
- 🌐 **Bilingual**: All Skills available in Chinese and English
- ✅ **Tested**: Every Skill includes a real output example
- 🔌 **Model-agnostic**: Works with ChatGPT, Claude, Gemini, and open-source models

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
  <a href="./skills/c-suite/coo/">COO</a>
</td>
<td>
  <img src="https://img.shields.io/badge/2-skills-blue?style=flat-square" />
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
  <img src="https://img.shields.io/badge/2-skills-blue?style=flat-square" />
</td>
</tr>
<tr>
<td>💻 <strong>Individual Contributor</strong></td>
<td>
  <a href="./skills/individual-contributor/software-engineer/">Software Engineer</a> ·
  <a href="./skills/individual-contributor/data-analyst/">Data Analyst</a> ·
  <a href="./skills/individual-contributor/marketing/">Marketing</a> ·
  <a href="./skills/individual-contributor/sales-rep/">Sales Rep</a> ·
  <a href="./skills/individual-contributor/customer-success/">Customer Success</a> ·
  <a href="./skills/individual-contributor/legal/">Legal</a> ·
  <a href="./skills/individual-contributor/finance/">Finance</a>
</td>
<td>
  <img src="https://img.shields.io/badge/2-skills-blue?style=flat-square" />
</td>
</tr>
<tr>
<td>🌐 <strong>Cross-functional</strong></td>
<td>
  <a href="./skills/cross-functional/">OKR · Meeting · Email · Data Storytelling</a>
</td>
<td>
  <img src="https://img.shields.io/badge/1-skills-blue?style=flat-square" />
</td>
</tr>
</tbody>
</table>

> 📈 **持续增长中** · **Growing continuously** — 社区每周新增技能 · Community adds skills weekly

---

## ⚡ 5 分钟快速上手 · 5-Minute Quick Start

### 方式一：直接复制使用 · Direct Copy-Paste

1. 找到你岗位的技能目录（如 [CEO 战略愿景](./skills/c-suite/ceo/strategic_vision.skill.md)）
2. 复制「系统提示词」部分到 ChatGPT/Claude 的 System Prompt 区域
3. 用「用户提示词模板」填入你的实际内容，发送即可

### 方式二：Python 集成 · Python Integration

```python
# pip install requests pyyaml
import yaml, re, requests

def load_skill(skill_path: str) -> dict:
    """Load a skill from GitHub raw URL"""
    url = f"https://raw.githubusercontent.com/OpenAgenticOS/OpenSkill/main/skills/{skill_path}.skill.md"
    content = requests.get(url).text
    # Extract YAML frontmatter
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    frontmatter = yaml.safe_load(match.group(1))
    # Extract system prompt block
    prompt_match = re.search(r'## 系统提示词.*?```xml\n(.*?)```', content, re.DOTALL)
    frontmatter['system_prompt'] = prompt_match.group(1) if prompt_match else ""
    return frontmatter

# Load and use a skill
skill = load_skill("c-suite/ceo/strategic_vision")
print(f"Loaded: {skill['name']}")
print(f"System Prompt Preview:\n{skill['system_prompt'][:200]}...")
```

### 方式三：LangChain 集成 · LangChain Integration

```python
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

skill = load_skill("individual-contributor/software-engineer/code_review")

llm = ChatOpenAI(model="gpt-4o")
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

---

| 贡献方式 | 难度 | 时间 |
|---------|------|------|
| 🌟 [提交新技能](https://github.com/OpenAgenticOS/OpenSkill/issues/new?template=new_skill.yml) | ⭐ 简单 | 15 分钟 |
| 🔧 [改进现有技能](https://github.com/OpenAgenticOS/OpenSkill/issues/new?template=skill_improvement.yml) | ⭐ 简单 | 10 分钟 |
| 💬 [测试并评分](https://github.com/OpenAgenticOS/OpenSkill/issues) | ⭐ 简单 | 5 分钟 |
| 📖 [完善文档](https://github.com/OpenAgenticOS/OpenSkill/pulls) | ⭐⭐ 中等 | 30 分钟 |
| 🛠️ [改进验证工具](./tools/) | ⭐⭐⭐ 进阶 | 1+ 小时 |

---

## 🏗️ 项目结构 · Project Structure

```
OpenSkill/
├── skills/                         # 技能库主体
│   ├── c-suite/                    # 高管层 (CEO/CTO/CFO/COO)
│   ├── management/                 # 中层管理
│   ├── individual-contributor/     # 一线员工
│   └── cross-functional/           # 跨职能通用
├── schema/
│   └── skill.schema.json           # Skill 格式 JSON Schema
├── tools/
│   └── validate.js                 # CI 校验工具
├── .github/
│   ├── workflows/validate_skills.yml  # CI 自动校验
│   ├── ISSUE_TEMPLATE/             # 结构化 Issue 模板
│   └── PULL_REQUEST_TEMPLATE.md    # PR 模板
├── SKILL_SCHEMA.md                 # 完整格式文档
└── CONTRIBUTING.md                 # 贡献指南
```

---

## 📐 Skill 格式设计 · Skill Format Design

基于 **COSTAR 框架**（企业 LLM 2025 年最佳实践）设计：

| 维度 | 作用 |
|------|------|
| **P**ersona | AI 扮演什么角色 |
| **O**bjective | 要完成什么任务 |
| **S**tyle | 期望的输出风格 |
| **T**one | 期望的语气 |
| **A**udience | 面向什么受众 |
| **R**esponse Format | 期望的输出格式 |

> 参考论文：*PersonaHub (arXiv:2406.20094)* · *SkillsBench (2026)* · *COSTAR Framework (2025 Enterprise Best Practice)*

---

## 🌟 Contributors

<a href="https://github.com/OpenAgenticOS/OpenSkill/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=OpenAgenticOS/OpenSkill" />
</a>

**想加入这个列表？** [提交你的第一个 Skill！](https://github.com/OpenAgenticOS/OpenSkill/issues/new?template=new_skill.yml)

---

## 📄 License

MIT © [OpenAgenticOS](https://github.com/OpenAgenticOS) · [贡献者们 Contributors](./CONTRIBUTORS.md)

<div align="center">

**如果 OpenSkill 对你有帮助，请 ⭐ Star 这个仓库！**
**If OpenSkill helps you, please ⭐ Star this repo!**

</div>
