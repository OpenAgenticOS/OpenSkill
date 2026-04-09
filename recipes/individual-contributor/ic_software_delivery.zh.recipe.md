---
id: recipe/ic_software_delivery
name: 一线工程师交付闭环（自选 Skill）
version: 1.0.0
locale: zh
category: individual-contributor/software-engineer
roles:
  - individual-contributor/software-engineer
skills_referenced:
  - individual-contributor/software-engineer/technical_spec
  - individual-contributor/software-engineer/api_design_doc
  - individual-contributor/software-engineer/bug_report_writing
  - individual-contributor/software-engineer/pr_description
  - cross-functional/professional_email
workflows_referenced:
  - workflow/release_communication
author: openskill-maintainers
created_at: "2025-01-01"
---

## 场景描述

从**规格 → 实现 → 缺陷 → 发布说明 → 邮件同步**，工程师可按需取用。小改动可能只需要 `pr_description`；大功能可串 `technical_spec` / `api_design_doc`。

## 推荐路径（可选）

1. **新接口或模块**：先 `technical_spec` 或 `api_design_doc`（二选一或都要，视团队规范）。
2. **修 Bug**：`bug_report_writing` 帮别人复现时也可自用反推根因。
3. **提 PR**：`pr_description` 统一风险与测试说明。
4. **对内发布广播**：参考 [release_communication](../workflows/product-delivery/release_communication.zh.workflow.md)；若只需邮件，直接用 `professional_email`。

## 说明

不必按顺序执行；与 Code Review Skill 配合见 `recipe/engineering_lead_quality`。
