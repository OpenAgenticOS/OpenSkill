---
id: workflow/release_communication
name: 发布沟通简短流
version: 1.0.0
locale: zh
trigger: 功能或版本即将上线，需要对内或对客户沟通时
estimated_time: 20-45 分钟
difficulty: beginner
author: openskill-maintainers
created_at: "2025-01-01"
steps:
  - id: collect
    type: human
    description: 收集版本亮点、风险、回滚策略与支持渠道（可从发布说明草稿复制）
    output: release_bullets
  - id: change_note
    type: skill
    skill_id: cross-functional/change_announcement
    input_mapping:
      change_summary: "{{collect.output.release_bullets}}"
      affected_audience: "（内部全员 / 某部门 / 客户群，由用户指定）"
      go_live_date: "（上线日或窗口）"
    output: internal_announcement
  - id: email_followup
    type: skill
    skill_id: cross-functional/professional_email
    input_mapping:
      scenario: "发布后跟进或提醒"
      recipient_context: "（干系人）"
      key_points: "{{collect.output.release_bullets}}"
    output: email_draft
---

## 说明

若仅需邮件、无需全公司公告，可跳过 `change_note`。对外客户文案可能还需 C-suite 或市场技能，本流不强制。
