---
id: workflow/quarterly_planning
name: 季度规划全流程
version: 1.0.0
locale: zh
category: strategy-planning
trigger: 每季度末或新季度初
estimated_time: 2-4 小时（可拆分多天）
difficulty: intermediate
author: openskill-maintainers
created_at: "2025-01-01"
steps:
  - id: gather
    type: human
    description: 收集团队上下文、上季度数据、领导层方向与已知约束（可来自文档、仪表盘或口头）
    output: raw_context
  - id: retro_pack
    type: skill
    skill_id: cross-functional/retrospective_facilitation
    input_mapping:
      team_context: "{{gather.output.raw_context}}"
      duration_minutes: "75"
    output: retro_agenda
  - id: run_retro
    type: human
    description: 按 retro_pack 引导复盘，记录要点与改进项（可另开会议）
    output: retro_notes
  - id: write_okr
    type: skill
    skill_id: cross-functional/okr_writing
    input_mapping:
      team_context: "{{gather.output.raw_context}}"
      quarter: "（由用户填入当前季度）"
      goals_description: "{{run_retro.output.retro_notes}}"
    output: okr_draft
  - id: risk_pass
    type: skill
    skill_id: cross-functional/risk_register
    input_mapping:
      project_context: "{{write_okr.output.okr_draft}}"
    output: risks
  - id: align_comms
    type: skill
    skill_id: cross-functional/stakeholder_update
    input_mapping:
      project: "（团队或倡议名称）"
      stakeholders: "（由用户列出）"
    output: comms_plan
  - id: review
    type: human
    description: 团队评审 OKR、风险与沟通计划；不满意则回到 write_okr 或 risk_pass 迭代
    condition: 可选循环直至赞助人认可
---

## 说明

本工作流为**声明式指南**：可按组织习惯删减步骤、改顺序或仅手工执行其中几步。不要求任何特定 Agent 框架。

**变体**：若无正式复盘文化，可将 `retro_pack` + `run_retro` 替换为简短的「上一季三件事」人工列表，再喂入 `write_okr` 的 `goals_description`。
