---
id: workflow/cross_functional_kickoff
name: Cross-functional kickoff pack
version: 1.0.0
locale: en
trigger: New initiative needs multi-team alignment and sign-off
estimated_time: 1-3 hours (can span days)
difficulty: intermediate
author: openskill-maintainers
created_at: "2025-01-01"
steps:
  - id: draft_charter
    type: skill
    skill_id: cross-functional/project_kickoff
    input_mapping:
      initiative: "(initiative summary)"
      timeline: "(target horizon)"
    output: charter
  - id: raci
    type: skill
    skill_id: cross-functional/raci_matrix
    input_mapping:
      project_scope: "{{draft_charter.output.charter}}"
      stakeholders: "(functions or teams—user lists)"
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
      meeting_title: Cross-functional kickoff
      objective: Align charter draft, RACI, and risk register; confirm next steps
      attendees: "(core team and sponsors—user lists)"
      duration_minutes: "60"
    output: agenda
  - id: finalize
    type: human
    description: Run the kickoff and lock decisions; optionally clean up notes with meeting_notes skill.
    output: signed_off_pack
---

## Notes

After `meeting_run`, humans facilitate the meeting. Replace `{{...}}` placeholders with real text when copying between skills.
