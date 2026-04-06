# Security policy · 安全策略

## Supported versions · 支持的版本

本仓库为**文档与校验工具**集合，**无自托管在线服务**；技能数据以 **GitHub Releases** 上的静态 JSON / zip 形式发布（非需你方运维的运行时）。安全相关变更通过默认分支（本仓库为 **`master`**）与常规 PR 流程合并。

This repository is **documentation and validation tooling** with **no self-hosted service**; skill data ships as **static JSON and zip assets on GitHub Releases** (not a runtime you operate). Security fixes land on the **default branch** (`master` in this repo) via the normal PR process.

## Reporting a vulnerability · 报告漏洞

若你发现**仓库内容或 CI/工具链**中的安全问题（例如泄露密钥、恶意依赖、工作流接管风险），请 **不要** 公开 Issue。

If you believe you have found a **security issue** in this repository (for example leaked secrets, malicious dependencies, or workflow weaknesses), **do not** open a public issue.

**请通过以下方式私下联系维护者：**

- 使用 GitHub **Private vulnerability reporting**（若组织已在仓库设置中启用）：仓库页面 **Security → Report a vulnerability**
- 或向组织公开的联系渠道（如有）发邮件说明复现步骤与影响范围

Please use **GitHub private vulnerability reporting** if enabled (**Security → Report a vulnerability** on the repo), or contact maintainers through the organization’s official channel with steps to reproduce and impact.

我们会在合理时间内评估与回复。感谢负责任的披露。

We will assess and respond within a reasonable timeframe. Thank you for responsible disclosure.
