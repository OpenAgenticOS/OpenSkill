<!-- Auto-generated — do not edit by hand. -->

# Automation · 自动化说明

## 无需 PAT（默认）· No PAT (default)

**中文：** 工作流把路线图与统计写入 **[`docs/wiki-mirror/`](https://github.com/OpenAgenticOS/OpenSkill/blob/master/docs/wiki-mirror/Home.md)** 并 `git push` 到默认分支，使用 `GITHUB_TOKEN`。打开 [Home](https://github.com/OpenAgenticOS/OpenSkill/blob/master/docs/wiki-mirror/Home.md) 即可阅读。

**English:** The workflow writes pages under **[`docs/wiki-mirror/`](https://github.com/OpenAgenticOS/OpenSkill/blob/master/docs/wiki-mirror/Home.md)** and pushes with `GITHUB_TOKEN`. Start at [Home](https://github.com/OpenAgenticOS/OpenSkill/blob/master/docs/wiki-mirror/Home.md).

## 可选：GitHub Wiki · Optional: GitHub Wiki

**中文：** 在仓库 **Settings → General → Wiki** 启用 Wiki。添加 Secret `PROJECTS_WIKI_PAT`（classic PAT 勾选 `repo`，或 fine-grained 含 **Contents** 读写含 wiki）。Actions 会额外 `git push` 到 `.wiki` 远程。

**English:** Enable **Wiki** in **Settings → General**. Add secret `PROJECTS_WIKI_PAT` (`repo` scope or fine-grained with wiki/content access). The workflow will also push to the `.wiki` remote.

## 可选：GitHub Projects · Optional: Projects

**中文：** 工作流默认使用 **Project number = 1**（对应 Variable `PROJECT_NUMBER` 未设置时）。本仓库 owner 为组织时，常见地址形如 [https://github.com/orgs/OpenAgenticOS/projects/1](https://github.com/orgs/OpenAgenticOS/projects/1)；若 owner 为用户账号则为 `/users/USERNAME/projects/1`。需在仓库 **Secrets** 配置 `PROJECTS_WIKI_PAT`（含 **project** / **read:org** 等权限）后，才会向该 Project 添加路线图 **草稿**（标题形如 `[Roadmap:now:skill-coverage]`）。若你的 Project 不是 1 号，请在 **Settings → Variables** 设置 `PROJECT_NUMBER` 覆盖默认值。

**English:** The workflow defaults to **Project number 1** when `PROJECT_NUMBER` is unset. For an org-owned repo, open [`/orgs/OpenAgenticOS/projects/1`](https://github.com/orgs/OpenAgenticOS/projects/1); for a user owner, use `/users/USERNAME/projects/1`. Set secret `PROJECTS_WIKI_PAT` (needs **project** / **read:org**) to add roadmap **draft** items. Override with variable `PROJECT_NUMBER` if your board is not #1.

**Workflow file · 工作流文件:** [`sync-github-project-wiki.yml`](https://github.com/OpenAgenticOS/OpenSkill/blob/master/.github/workflows/sync-github-project-wiki.yml)
