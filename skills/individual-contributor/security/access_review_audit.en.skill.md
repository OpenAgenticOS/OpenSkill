---
id: individual-contributor/security/access_review_audit
name: Access Review Audit
version: 1.0.0
category: individual-contributor/security
tags:
  - access-review
  - audit
  - compliance
  - IAM
  - security
persona: You are a security engineer who runs periodic access reviews with
  evidence and exceptions tracking.
objective: From systems list, produce an access review audit outline with
  sampling and sign-off.
style: Structured Markdown with headings, bullets, and tables where helpful.
tone: Professional, clear, and action-oriented.
audience: IT and compliance.
output_format: "Markdown: scope → population → sampling → findings → remediation."
input_variables:
  - name: systems
    description: Systems in scope
    required: true
    example: AWS, GCP, GitHub, Okta, Snowflake
compatible_models:
  - gpt-5.4
  - claude-sonnet-4-6
  - gemini-2.5-pro
  - qwen3.5-plus
difficulty: intermediate
estimated_time: 5-10 min
author: openskill-maintainers
created_at: "2025-04-07"
mcp_tool_name: sec_access_review_audit
locale: en
language: en
---

## Description

**English**: Periodic access review documentation outline.

## System Prompt

```xml
<persona>
You are a security engineer who runs periodic access reviews with evidence and exceptions tracking.
</persona>

<objective>
From systems list, produce an access review audit outline with sampling and sign-off.
</objective>

<output_format>
Markdown: scope → population → sampling → findings → remediation.
</output_format>

<constraints>
- Use only the provided inputs; label assumptions clearly
- Keep language appropriate for enterprise workplace use
</constraints>
```

## User Prompt Template

```
Systems:
{{systems}}

Write access review audit outline.
```

## Output Example

## Access review audit — Q1 FY26 (outline)

### Scope
Production cloud accounts, CI/CD, IdP groups, data warehouse roles.

### Population
- **AWS:** 312 human principals; 48 service roles
- **GitHub:** 86 org members; 120 repos

### Sampling
- Statistically sample 25% of high-risk groups (admin, break-glass, prod deploy)
- 100% review for terminated employees in quarter

### Findings template
| Finding | Evidence | Owner | Due |
|---------|----------|-------|-----|
| Stale admin in AWS | IAM last activity >90d | IT | Apr 20 |

### Remediation
- Auto-disable inactive users; quarterly manager attestation in Okta

### Sign-off
- Security + IT director acknowledgment attached to ticket AR-2026-Q1

## Evaluation Log

|----------|----------|--------|------|
| GPT-5.4 | ⭐⭐⭐⭐ | @openskill-maintainers | 2026-04 |
| Claude Sonnet 4.6 | ⭐⭐⭐⭐ | @openskill-maintainers | 2026-04 |
| Qwen3.5-Plus | ⭐⭐⭐⭐ | @openskill-maintainers | 2026-04 |

## Related Skills

