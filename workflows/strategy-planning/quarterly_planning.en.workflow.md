---
id: workflow/quarterly_planning
name: Quarterly planning flow
version: 1.0.0
locale: en
category: strategy-planning
trigger: End of quarter or start of a new quarter
estimated_time: 2-4 hours (can span multiple days)
difficulty: intermediate
author: openskill-maintainers
created_at: "2025-01-01"
steps:
  - id: gather
    type: human
    description: Collect team context, prior-quarter signals, leadership direction, and constraints (docs, dashboards, or notes).
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
    description: Facilitate retro using the pack; capture themes and improvements (separate meeting OK).
    output: retro_notes
  - id: write_okr
    type: skill
    skill_id: cross-functional/okr_writing
    input_mapping:
      team_context: "{{gather.output.raw_context}}"
      quarter: "(fill current quarter)"
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
      project: "(team or initiative name)"
      stakeholders: "(list from user)"
    output: comms_plan
  - id: review
    type: human
    description: Review OKRs, risks, and comms plan; iterate write_okr or risk_pass if needed.
    condition: Optional loop until sponsors align
---

## Notes

Declarative guide only—skip, reorder, or run steps manually. No framework lock-in.

**Variant:** Without retro culture, replace retro steps with a short human "three things from last quarter" list and pass it to `goals_description` for OKR writing.
