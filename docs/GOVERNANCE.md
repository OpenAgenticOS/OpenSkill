# Governance · 社区治理

**Languages · 语言:** 下列各节先中文、后 English（同一主题）。

---

## Maintainer response · 维护者响应

**中文：** 目标在 **72 小时内** 对 Issues 与 PRs 做**首次回复**（工作日）。复杂改动可能延长，维护者会在线程中说明。

**English:** We aim for a **first response within ~72 hours** on business days for issues and PRs. Larger reviews may take longer; we’ll say so in the thread.

---

## Labels · 标签

**中文：** 下列标签供 Issue 模板、PR Labeler、Stale 等工作流使用。请在仓库 **Settings → Labels** 中创建，**名称须完全一致**（含空格，如 `good first issue`）。

**English:** These labels are used by issue templates, the PR labeler, Stale, etc. Create them under **Settings → Labels** with **exact names** (including spaces, e.g. `good first issue`).

| Label | 用途（中文） | Use (English) |
| --- | --- | --- |
| `skills` | PR 主要改 `skills/` | PR mostly changes `skills/` |
| `tooling` | 工具、`tools/`、`.github/` | Tooling, `tools/`, `.github/` |
| `schema` | `schema/` 变更 | Changes under `schema/` |
| `documentation` | 文档、`docs/`、根目录说明类 Markdown | Docs, `docs/`, top-level explanatory Markdown |
| `new-skill`, `improvement`, `help wanted`, `good first issue` | Issue 模板默认 | Default labels from issue forms |
| `needs-more-info` | 仅长期无回复的此类 Issue 可能被 Stale 标记 | Only issues with this label may go stale (see workflow exemptions) |
| `bug` | 缺陷（如工具/CI） | Defects (e.g. tooling/CI) |
| `dependencies` | Dependabot PR；Stale 对 PR 豁免 | Dependabot PRs; exempt from PR stale |
| `roadmap` | （可选）与 [data/roadmap.json](../data/roadmap.json) 中某 `id` 对应的跟踪 Issue | (Optional) Tracking issue for a roadmap `id` |
| `needs-translation` | （可选）技能仅单语、待补另一侧翻译的 PR / Issue。Stale 工作流**仅**处理带 `needs-more-info` 的 Issue，不会因 Stale 单独清理「只打了本标签」的 Issue。 | (Optional) Skill or doc needs the other locale filled in. The Stale workflow only considers issues labeled `needs-more-info`, not translation-queue items that use only this label. |

---

## Default branch · 默认分支

**中文：** 本仓库默认分支为 **`master`**（与 GitHub 上显示一致）。文档与 raw 链接均以此为准；若日后改为 `main`，需批量更新链接与说明。

**English:** The default branch is **`master`** (as shown on GitHub). Docs and raw URLs assume this; if you rename to `main`, update links accordingly.

---

## Releases · 发布节奏

**中文：** 以默认分支持续集成为主，不强制语义化版本发布。若将来发布 npm 包或 CLI，将在此补充版本策略。

**English:** We integrate continuously on the default branch; no mandatory semver releases. If we publish packages or a CLI later, we’ll document versioning here.

---

## Discussions & security · 讨论与安全

**中文：** 建议启用 **GitHub Discussions**（Q&A、展示）；Issue 选择页已链到 Discussions。安全披露见根目录 [SECURITY.md](../SECURITY.md)。

**English:** Enabling **GitHub Discussions** (Q&A, show-and-tell) is recommended; the issue picker links there. See [SECURITY.md](../SECURITY.md) for reporting security issues.

---

## Sponsors · GitHub Sponsors

**中文：** 仓库页 **Sponsor** 按钮由 [.github/FUNDING.yml](../.github/FUNDING.yml) 配置。维护者需在 GitHub 账号设置中[开通 Sponsors](https://github.com/sponsors) 后按钮才会生效；组织账号亦可单独开通。

**English:** The **Sponsor** button comes from [.github/FUNDING.yml](../.github/FUNDING.yml). The linked account must [enable GitHub Sponsors](https://github.com/sponsors) for the button to work; organizations can enroll separately.

---

## Roadmap · 路线图

**中文：** 路线图源文件为 [data/roadmap.json](../data/roadmap.json)，通过 PR 更新；仓库不维护 GitHub Wiki 或 Projects 的自动同步说明。

**English:** The roadmap lives in [data/roadmap.json](../data/roadmap.json) and is updated via pull requests. This repository does not document or automate GitHub Wiki or Projects sync.

---

## Code of Conduct · 行为准则

**中文：** 全文见 [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)（英文正文，顶部有中文概要）。

**English:** See [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) (English body; short Chinese summary at the top).
