---
id: workflow/incident_response
name: 事件响应沟通与记录流
version: 1.0.0
locale: zh
category: engineering-ops
trigger: 生产或安全事件需要跨团队对齐时
estimated_time: 30-90 分钟（不含技术排障）
difficulty: intermediate
author: openskill-maintainers
created_at: "2025-01-01"
steps:
  - id: triage_facts
    type: human
    description: 整理已知事实、影响范围、当前缓解措施与时间线（可来自工单或聊天）
    output: fact_sheet
  - id: stakeholder_plan
    type: skill
    skill_id: cross-functional/stakeholder_update
    input_mapping:
      project: "（事件名称或系统名）"
      stakeholders: "（赞助人、客服、法务等，由用户填）"
    output: comms_plan
  - id: status_email
    type: skill
    skill_id: cross-functional/professional_email
    input_mapping:
      scenario: "事件状态同步"
      recipient_context: "（由用户描述受众）"
      key_points: "{{triage_facts.output.fact_sheet}}"
    output: email_draft
  - id: postmortem_prep
    type: skill
    skill_id: individual-contributor/devops/incident_postmortem_draft
    input_mapping:
      incident_id: "（从工单或标题填入）"
      impact_facts: "{{triage_facts.output.fact_sheet}}"
      timeline_notes: "{{triage_facts.output.fact_sheet}}"
    output: pm_draft
  - id: human_gate
    type: human
    description: 经值班负责人审核后再外发；重大事件按法务/公关流程升级
    condition: 必须人工批准
---

## 说明

技术排障与根因分析与本文档无关；本流侧重**沟通与文档化**。可按公司事件等级制度删减步骤。
