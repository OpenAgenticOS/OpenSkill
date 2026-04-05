# GitHub Projects & Wiki · 看板与维基指南

**中文：** 本文说明如何把 **[路线图](./ROADMAP.md)** 落到 **GitHub Projects**（执行跟踪）和 **Wiki**（易读说明），方便贡献者「一眼知道在发生什么」。

**English:** How to connect the **[roadmap](./ROADMAP.md)** to **GitHub Projects** (execution) and the **Wiki** (readable guides) so everyone sees what is happening.

---

## GitHub Projects（推荐组织或仓库级）· Projects setup

### 1. 创建 Project · Create a project

**中文：** 在 **OpenSkill 仓库** 或 **OpenAgenticOS 组织** 下新建 **Project**（Table / Board 均可）。官方文档：<https://docs.github.com/en/issues/planning-and-tracking-with-projects>

**English:** Create a **Project** under the **OpenSkill** repo or **OpenAgenticOS** org (Table or Board). Docs: <https://docs.github.com/en/issues/planning-and-tracking-with-projects>

**快捷入口 · Quick links**

- 仓库 Projects 列表：<https://github.com/OpenAgenticOS/OpenSkill/projects>
- 若使用组织级 Project，请在组织 **Projects** 页创建后，将本段链接替换为实际 URL 并提交 PR 更新本文与 README。

### 2. 建议视图 · Suggested views

**中文：**

- **Board**：列名 `Backlog` → `Ready` → `In progress` → `Done`（与路线图状态一致）。
- **Table**：列显示 `Title`、`Assignees`、`Labels`、`Milestone`（可选）、自定义字段 `Priority`、`Area`、`Track`（见 [ROADMAP.md](./ROADMAP.md)）。

**English:** Use a **Board** with `Backlog` → `Ready` → `In progress` → `Done`, or a **Table** with labels/milestones plus custom fields `Priority`, `Area`, `Track`.

### 3. 与工作项的衔接 · Linking work

**中文：**

1. 路线图中的每一项**大主题**应对应至少一个 **Issue**（可用 `roadmap` 标签，需在仓库中创建该标签）。  
2. 把 Issue **加入 Project**；PR 可关联同一 Issue，合并后拖至 **Done**。  
3. **Dependabot** PR 可单独一列或过滤 `dependencies`，避免与技能内容任务混在一起。

**English:** One **Issue** per roadmap theme (optional `roadmap` label); add issues to the project; link PRs; keep Dependabot PRs filtered separately.

### 4. 自动化（可选）· Automation (optional)

**中文：** 在 Project 设置中使用内置规则：例如「PR 合并后自动将关联 Issue 标为 Done」。无需在本仓库再新增 workflow 即可使用 GitHub 自带能力。

**English:** Use built-in project workflows (e.g. auto-close linked issues when PRs merge) without extra repo workflows if you prefer.

---

## Wiki · 维基

### 1. 启用 Wiki · Enable Wiki

**中文：** 仓库 **Settings → General → Features → Wiki** 勾选启用。默认仅维护者可写；可向活跃贡献者开放协作权限。

**English:** **Settings → General → Features → Wiki**. Default: maintainers only; extend edit access to trusted contributors if needed.

**入口 · URL:** <https://github.com/OpenAgenticOS/OpenSkill/wiki>

### 2. 建议页面结构 · Suggested pages

| 页面 · Page | 用途 · Purpose |
|-------------|----------------|
| **Home** | 一句话介绍 + 链到 README、CONTRIBUTING、[路线图](./ROADMAP.md)（可贴本仓库相对路径或 GitHub 上 `blob/master/docs/ROADMAP.md`）。 |
| **First contribution** | 图文：从「选模板」到「开 PR」；中英各一节。 |
| **Skills by role** | 按岗位推荐优先试用的技能文件链接（减轻 README 长度）。 |
| **FAQ** | 与 Discussions 互补：重复问题从 Discussion 摘抄到 Wiki。 |
| **Roadmap（可选镜像）** | 简短摘要 + 「完整版见仓库 `docs/ROADMAP.md`」，避免 Wiki 与仓库长期漂移。 |

**中文：** **单一事实来源**：路线图正文以仓库 **`docs/ROADMAP.md`** 为准；Wiki 只做摘要或翻译，并在页脚注明「最后同步日期」。

**English:** **Source of truth** for the roadmap text is **`docs/ROADMAP.md`** in the repo; the Wiki should summarize and note last sync date.

### 3. 与 Discussions 的分工 · Wiki vs Discussions

| Wiki | Discussions |
|------|-------------|
| 稳定、可反复引用的说明 | 开放式问答、想法、展示 |
| 由维护者整理成页 | 线程式、可标记已回答 |

---

## README 与模板的链接维护 · Keeping links fresh

**中文：** 在创建好**第一个**仓库或组织 Project 后，维护者应：

1. 将 Project 的公开 URL 写入本文件「快捷入口」小节（若与默认列表不同）。  
2. 在 [README.md](../README.md) 的路线图小节确认 Projects / Wiki 链接可点击。

**English:** After the first project exists, update this doc and the README roadmap section with the canonical project URL.

---

## 修订记录 · Changelog

| 日期 · Date | 变更 · Change |
|-------------|---------------|
| 2026-04-05 | 首版 Projects + Wiki 指南 · Initial guide |
