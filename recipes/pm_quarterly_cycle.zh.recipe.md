---
id: recipe/pm_quarterly_cycle
name: 产品经理季度循环（入口指南）
version: 1.0.0
locale: zh
roles:
  - management/product-manager
skills_referenced:
  - cross-functional/okr_writing
  - management/product-manager/prd_writing
  - management/product-manager/prioritization_rice
  - management/product-manager/competitive_analysis
  - cross-functional/stakeholder_update
workflows_referenced:
  - workflow/quarterly_planning
author: openskill-maintainers
created_at: "2025-01-01"
---

## 场景描述

产品经理在季度边界常需：**对齐目标、排优先级、写需求、管理干系人预期**。本 Recipe 不强制顺序——你可只取其中任意一个 Skill 单独使用。

## 推荐路径（可选）

1. **需要团队级目标对齐时**：参考工作流 [quarterly_planning](../workflows/quarterly_planning.zh.workflow.md)（含复盘、OKR、风险、沟通计划）；若组织已有固定 OKR 流程，可只用 `okr_writing` 生成草稿。
2. **本季重点功能**：用 `prioritization_rice` 或现有框架说明「为什么先做 A」；再用 `prd_writing` 落文档。
3. **外部变化多**：用 `competitive_analysis` 做轻量竞品快照，再决定是否进入 PRD。
4. **赞助人/业务方多**：用 `stakeholder_update` 定节奏，不必每次写长文。

## 进阶

- 与工程协作时，可叠加 `individual-contributor/software-engineer/technical_spec`（若已收录）做接口层说明；本库以原子 Skill 为主，按需在 PR 中链接。
