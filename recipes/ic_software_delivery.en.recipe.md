---
id: recipe/ic_software_delivery
name: IC software engineer — delivery loop (pick your skills)
version: 1.0.0
locale: en
roles:
  - individual-contributor/software-engineer
skills_referenced:
  - individual-contributor/software-engineer/technical_spec
  - individual-contributor/software-engineer/api_design_doc
  - individual-contributor/software-engineer/bug_report_writing
  - individual-contributor/software-engineer/pr_description
  - cross-functional/professional_email
workflows_referenced:
  - workflow/release_communication
author: openskill-maintainers
created_at: "2025-01-01"
---

## Scenario

From **spec → ship → bugs → release note → mail**. Small fixes may only need `pr_description`; larger work may add `technical_spec` / `api_design_doc`.

## Suggested path (optional)

1. **New surface area:** Start with `technical_spec` and/or `api_design_doc` per team norms.
2. **Bug hunts:** Use `bug_report_writing` to clarify repro—even for yourself.
3. **PRs:** Standardize risk/test notes via `pr_description`.
4. **Internal comms:** See [release_communication](../workflows/release_communication.en.workflow.md); for a single mail use `professional_email`.

## Note

Order is optional; pair with `recipe/engineering_lead_quality` for review culture.
