---
id: workflow/incident_response
name: Incident response comms flow
version: 1.0.0
locale: en
category: engineering-ops
trigger: Production or security incident needs cross-team alignment
estimated_time: 30-90 minutes (excluding technical mitigation)
difficulty: intermediate
author: openskill-maintainers
created_at: "2025-01-01"
steps:
  - id: triage_facts
    type: human
    description: Capture facts, blast radius, mitigations, and timeline (tickets or chat logs).
    output: fact_sheet
  - id: stakeholder_plan
    type: skill
    skill_id: cross-functional/stakeholder_update
    input_mapping:
      project: "(incident or system name)"
      stakeholders: "(sponsors, support, legal, etc.—user fills)"
    output: comms_plan
  - id: status_email
    type: skill
    skill_id: cross-functional/professional_email
    input_mapping:
      scenario: Incident status update
      recipient_context: "(audience description)"
      key_points: "{{triage_facts.output.fact_sheet}}"
    output: email_draft
  - id: postmortem_prep
    type: skill
    skill_id: individual-contributor/devops/incident_postmortem_draft
    input_mapping:
      incident_id: "(from ticket or title)"
      impact_facts: "{{triage_facts.output.fact_sheet}}"
      timeline_notes: "{{triage_facts.output.fact_sheet}}"
    output: pm_draft
  - id: human_gate
    type: human
    description: On-call lead reviews before external send; follow legal/PR playbooks for major incidents.
    condition: Human approval required
---

## Notes

Focuses on **communication and documentation**, not technical mitigation. Trim steps per your severity model.
