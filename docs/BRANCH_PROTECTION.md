# Branch protection · 分支保护

**Languages · 语言:** 中文说明与 English notes below refer to the same settings.

---

## 概述 · Overview

**中文：** 建议在 GitHub 上为默认分支（本仓库为 **`master`**）启用保护规则，并与下方 CI 检查名称对齐。

**English:** Enable branch protection on the **default branch** (`master` here) and align required checks with the names below.

---

## Reference JSON · 参考 JSON

**中文：** [tools/branch_protection.json](../tools/branch_protection.json) 仅供维护者在 UI/API 配置时**人工对照**；GitHub 不会自动读取该文件。

**English:** [tools/branch_protection.json](../tools/branch_protection.json) is a **human reference** for settings; GitHub does not consume it automatically.

---

## Required checks · 必填检查

**中文：** 在 **Settings → Branches → Branch protection rules** 中勾选的状态检查名称，必须与 Actions 里 **job 的 `name:`** 一致：

**English:** Required status check names must match the **job `name:`** fields in Actions:

| 勾选名称 · Check name | 来源 · From |
| --- | --- |
| `Validate Skill Files` | Workflow “Validate Skills” → job `validate-skills` |
| `Lint Markdown` | Job `lint-markdown` |

**中文：** 若重命名 workflow 或 job，须同步更新分支保护中的勾选项，否则 PR 无法合并。

**English:** If you rename workflows or jobs, update branch protection or merges will block.

---

## Reviews · 评审

**中文：** 当前参考配置为 **至少 1** 个批准；若组织改为 2，请同步更新 [CONTRIBUTING.md](../CONTRIBUTING.md)。可选：与 [CODEOWNERS](../.github/CODEOWNERS) 联动要求 Code Owner 评审。

**English:** The reference JSON uses **1** required approval; if your org requires 2, update [CONTRIBUTING.md](../CONTRIBUTING.md). Optional: require Code Owner review with [CODEOWNERS](../.github/CODEOWNERS).

---

## 建议在 UI 中启用的选项 · Suggested UI options

**中文：**

- Require a pull request before merging  
- Require status checks to pass（勾选上表两项）  
- Require approvals（数量与组织策略一致）  
- 可选：Require review from Code Owners  

**English:** Same as above—enable PRs, required checks (both jobs), approvals count, and optionally Code Owner review.
