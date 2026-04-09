---
id: recipe/cross_functional_launch
name: 跨职能新倡议启动（工作流 + 单 Skill）
version: 1.0.0
locale: zh
category: cross-functional
roles:
  - cross-functional
skills_referenced:
  - cross-functional/project_kickoff
  - cross-functional/raci_matrix
  - cross-functional/risk_register
  - cross-functional/meeting_facilitation
  - cross-functional/meeting_notes
workflows_referenced:
  - workflow/cross_functional_kickoff
author: openskill-maintainers
created_at: "2025-01-01"
---

## 场景描述

新倡议需要**章程、职责、风险、会议**时，可直接跑工作流 [cross_functional_kickoff](../workflows/people-collaboration/cross_functional_kickoff.zh.workflow.md)，或只挑选其中一个 Skill 使用（例如已有章程仅补 RACI）。

## 推荐路径（可选）

1. **从零开始**：按工作流顺序生成草案，再人工开会定稿。
2. **仅缺 RACI**：单独打开 `raci_matrix`。
3. **会后**：用 `meeting_notes` 把录音/速记变成可转发纪要。

## 说明

工作流中的占位符需人工替换为实际上下文；OpenSkill 不提供运行时执行引擎。
