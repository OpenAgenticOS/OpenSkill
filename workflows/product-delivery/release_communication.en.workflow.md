---
id: workflow/release_communication
name: Release communication mini-flow
version: 1.0.0
locale: en
category: product-delivery
trigger: Shipping a feature or version and need internal or customer-facing comms
estimated_time: 20-45 minutes
difficulty: beginner
author: openskill-maintainers
created_at: "2025-01-01"
steps:
  - id: collect
    type: human
    description: Gather highlights, risks, rollback stance, and support channels (from draft release notes).
    output: release_bullets
  - id: change_note
    type: skill
    skill_id: cross-functional/change_announcement
    input_mapping:
      change_summary: "{{collect.output.release_bullets}}"
      affected_audience: "(company-wide / team / customers—user specifies)"
      go_live_date: "(go-live date or window)"
    output: internal_announcement
  - id: email_followup
    type: skill
    skill_id: cross-functional/professional_email
    input_mapping:
      scenario: Post-release follow-up or reminder
      recipient_context: "(stakeholders)"
      key_points: "{{collect.output.release_bullets}}"
    output: email_draft
---

## Notes

Skip `change_note` if email-only. Customer-facing copy may still need marketing or exec skills—optional.
