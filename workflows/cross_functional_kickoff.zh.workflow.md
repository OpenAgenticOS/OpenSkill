---
id: workflow/cross_functional_kickoff
name: 跨职能启动包
version: 1.0.0
locale: zh
trigger: 新倡议需要多团队签字与统一认知时
estimated_time: 1-3 小时（可跨日）
difficulty: intermediate
author: openskill-maintainers
created_at: "2025-01-01"
steps:
  - id: draft_charter
    type: skill
    skill_id: cross-functional/project_kickoff
    input_mapping:
      initiative: "（倡议摘要）"
      timeline: "（目标周期）"
    output: charter
  - id: raci
    type: skill
    skill_id: cross-functional/raci_matrix
    input_mapping:
      project_scope: "{{draft_charter.output.charter}}"
      stakeholders: "（由用户列出职能/团队）"
    output: raci_table
  - id: risks
    type: skill
    skill_id: cross-functional/risk_register
    input_mapping:
      project_context: "{{draft_charter.output.charter}}"
    output: risk_table
  - id: meeting_run
    type: skill
    skill_id: cross-functional/meeting_facilitation
    input_mapping:
      meeting_title: "跨职能启动会"
      objective: "对齐章程草案、RACI 与风险登记，确认下一步"
      attendees: "（由用户列出核心团队与赞助人）"
      duration_minutes: "60"
    output: agenda
  - id: finalize
    type: human
    description: 召开启动会并定稿；可选将纪要再用 meeting_notes 技能整理
    output: signed_off_pack
---

## 说明

`meeting_run` 产出议程后，**人工开会**；会后是否生成正式纪要由团队决定。占位符 `{{...}}` 在实际复制到各技能时需替换为上一步真实输出。
