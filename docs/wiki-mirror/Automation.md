<!-- Auto-generated — do not edit by hand. -->

# Automation · 自动化说明

## 无需 PAT（默认）· No PAT (default)

**中文：** 工作流把路线图与统计写入 **[`docs/wiki-mirror/`](https://github.com/OpenAgenticOS/OpenSkill/blob/master/docs/wiki-mirror/Home.md)** 并 `git push` 到默认分支，使用 `GITHUB_TOKEN`。打开 [Home](https://github.com/OpenAgenticOS/OpenSkill/blob/master/docs/wiki-mirror/Home.md) 即可阅读。

**English:** The workflow writes pages under **[`docs/wiki-mirror/`](https://github.com/OpenAgenticOS/OpenSkill/blob/master/docs/wiki-mirror/Home.md)** and pushes with `GITHUB_TOKEN`. Start at [Home](https://github.com/OpenAgenticOS/OpenSkill/blob/master/docs/wiki-mirror/Home.md).

## 可选：GitHub Wiki · Optional: GitHub Wiki

**中文：** 在仓库 **Settings → General → Wiki** 启用 Wiki。添加 Secret `PROJECTS_WIKI_PAT`（classic PAT 勾选 `repo`，或 fine-grained 含 **Contents** 读写含 wiki）。Actions 会额外 `git push` 到 `.wiki` 远程。

**English:** Enable **Wiki** in **Settings → General**. Add secret `PROJECTS_WIKI_PAT` (`repo` scope or fine-grained with wiki/content access). The workflow will also push to the `.wiki` remote.

## 可选：GitHub Projects · Optional: Projects

**中文：** [Projects 列表](https://github.com/OpenAgenticOS/OpenSkill/projects) 若为 **0**，请先在组织或用户下 **New project** 建一个 Project（表格或看板均可），从浏览器地址栏或项目 **Settings** 查看 **Project number**，在仓库 **Settings → Secrets and variables → Actions → Variables** 添加 `PROJECT_NUMBER`（整数）。再配置 `PROJECTS_WIKI_PAT`（需含 **project** 权限）。工作流会为 `data/roadmap.json` 中尚未存在的条目创建 **草稿**（标题形如 `[Roadmap:now:skill-coverage]`）。

**English:** If [Projects](https://github.com/OpenAgenticOS/OpenSkill/projects) is empty, create **New project**, read its **number**, set variable `PROJECT_NUMBER`, and provide `PROJECTS_WIKI_PAT` with **project** scope. Draft items are created per roadmap entry.

**Workflow file · 工作流文件:** [`sync-github-project-wiki.yml`](https://github.com/OpenAgenticOS/OpenSkill/blob/master/.github/workflows/sync-github-project-wiki.yml)
