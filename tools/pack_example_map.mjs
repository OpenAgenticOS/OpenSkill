/**
 * One-time generator: embed English translations for input_variables.example in .en.skill.md
 * Run: node tools/pack_example_map.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(readFileSync(join(__dirname, '_examples_raw.json'), 'utf8'));

/** @type {Record<string, string>} */
const flat = {
  'c-suite/ceo/all_hands_script|event_context':
    '2026 Q1 all-hands + week after new brand launch',
  'c-suite/ceo/all_hands_script|key_messages':
    'Balance growth and profit; AI product roadmap; office policy updates',
  'c-suite/ceo/all_hands_script|employee_concerns':
    'Layoff rumors; overtime; regional differences',

  'c-suite/ceo/board_communication|key_metrics':
    'ARR: $5.2M (target $5.0M OK), churn: 3.2% (target <2% missed)',
  'c-suite/ceo/board_communication|highlights':
    'Closed Series A; added 3 lighthouse customers',
  'c-suite/ceo/board_communication|challenges':
    'Sales hiring behind plan, impacting Q2 pipeline',
  'c-suite/ceo/board_communication|board_decisions_needed':
    'Approve expanded equity pool',

  'c-suite/ceo/investor_update_memo|milestones':
    'GA launch of predictive inventory; 2 global lighthouse signings',
  'c-suite/ceo/investor_update_memo|risks_and_asks':
    'Key AE hiring behind; please intro 2 candidates',

  'c-suite/ceo/ma_diligence_exec_summary|target_profile':
    'Regional SaaS, ARR ¥80M; strengthen East China delivery',
  'c-suite/ceo/ma_diligence_exec_summary|diligence_highlights':
    'Revenue quality OK; auto-renewal clauses; core team retention TBD',
  'c-suite/ceo/ma_diligence_exec_summary|deal_terms':
    'About 5x ARR; 12-month earn-out',

  'c-suite/ceo/strategic_vision|company_background':
    'B2B SaaS, 5 years, $5M ARR, manufacturing ERP focus',
  'c-suite/ceo/strategic_vision|market_opportunity':
    'AI is reshaping manufacturing; competitors shipping AI features',
  'c-suite/ceo/strategic_vision|time_horizon': '3 years',

  'c-suite/cfo/audit_committee_brief|meeting_date':
    'Mon Apr 20 2026 08:00:00 GMT+0800 (China Standard Time)',
  'c-suite/cfo/audit_committee_brief|icfr_and_deficiencies':
    'No material deficiencies; 2 improvement items being remediated',
  'c-suite/cfo/audit_committee_brief|related_party_items':
    'Review annual cap on related-party logistics contract',
  'c-suite/cfo/audit_committee_brief|audit_engagement':
    'Expanded revenue recognition sampling; unqualified opinion draft',

  'c-suite/cfo/board_financial_narrative|key_metrics':
    'Revenue ¥120M +18% YoY; gross margin 42% -1.5pp YoY; operating cash flow ¥18M',
  'c-suite/cfo/board_financial_narrative|business_context':
    'B-side ARR growth mainly East China; one-time restructuring cost ¥6M',
  'c-suite/cfo/board_financial_narrative|board_focus':
    'AR collection cycle and overseas collections',

  'c-suite/cfo/earnings_call_talking_points|headline_metrics':
    'Revenue +18%; gross margin 42%; operating cash flow +12%; no next-quarter guide',
  'c-suite/cfo/earnings_call_talking_points|narrative_focus':
    'Lower customer concentration; overseas pipeline expansion',
  'c-suite/cfo/earnings_call_talking_points|sensitive_topics':
    'One-time restructuring; one large customer delayed payment',

  'c-suite/chro/comp_committee_brief|meeting_date':
    'Sun May 10 2026 08:00:00 GMT+0800 (China Standard Time)',
  'c-suite/chro/comp_committee_brief|agenda_items':
    'CEO total comp market benchmark; expand 2026 option pool by 0.5%',
  'c-suite/chro/comp_committee_brief|benchmark_context':
    'Median of 25 listed peers; one-year lag data',

  'c-suite/chro/executive_team_assessment_brief|business_priorities':
    'International expansion; product line from point tools to suite; 8% cost reduction',
  'c-suite/chro/executive_team_assessment_brief|observations':
    'Long cross-region decision meetings; two VPs disagree on CS ownership; thin middle bench',
  'c-suite/chro/executive_team_assessment_brief|sensitivity_level': 'Board summary version',

  'c-suite/chro/workforce_planning_exec_summary|business_drivers':
    'Double APAC revenue; establish EU entity',
  'c-suite/chro/workforce_planning_exec_summary|current_headcount':
    '1,200 global; 45% R&D; 30% sales',
  'c-suite/chro/workforce_planning_exec_summary|constraints': 'Total cost increase ≤12%',

  'c-suite/cmo/brand_positioning_memo|business_context':
    'Manufacturing ERP + AI decision layer, mid-market',
  'c-suite/cmo/brand_positioning_memo|proof_points':
    '500+ plants; SOC2; cited in industry reports',
  'c-suite/cmo/brand_positioning_memo|competitive_landscape':
    'Global incumbents vs vertical challengers',

  'c-suite/cmo/crisis_comms_statement|incident_summary':
    'Subset of user data briefly exposed due to third-party misconfiguration; fixed',
  'c-suite/cmo/crisis_comms_statement|stakeholders':
    '~12k user emails possibly affected; no payment card data stored',
  'c-suite/cmo/crisis_comms_statement|channels':
    'Site banner, official Weibo, media email',
  'c-suite/cmo/crisis_comms_statement|legal_constraints':
    'Investigation ongoing; cannot name vendor; regulator timing TBD',

  'c-suite/cmo/product_launch_messaging_brief|product_facts':
    'GA on the 20th; AI forecasting focus; ¥299',
  'c-suite/cmo/product_launch_messaging_brief|launch_goals':
    '500 SQLs first month; +5pp upsell among existing customers',
  'c-suite/cmo/product_launch_messaging_brief|competition':
    'Competitor Z lower price but no on-prem',

  'c-suite/coo/ops_review_brief|ops_metrics':
    'On-time delivery 94% (target 96%); ticket MTTR 4.2h; unit fulfillment cost +3% YoY',
  'c-suite/coo/ops_review_brief|major_events':
    'East China warehouse expansion delayed 2 weeks; one P2 incident postmortemed',
  'c-suite/coo/ops_review_brief|constraints':
    'Single-source critical parts; no new HC in Q2',

  'c-suite/coo/pmi_ops_integration_checklist|deal_profile':
    'Acquire regional peer plant, +30% capacity; merge two supply chains',
  'c-suite/coo/pmi_ops_integration_checklist|day_one_date':
    'Mon Jun 01 2026 08:00:00 GMT+0800 (China Standard Time)',
  'c-suite/coo/pmi_ops_integration_checklist|overlap_areas':
    'Dual ERP; duplicate SKUs; sales territory conflict',
  'c-suite/coo/pmi_ops_integration_checklist|non_goals':
    'No plant closures this phase; brands not unified yet',

  'c-suite/coo/supply_chain_disruption_brief|incident_facts':
    'Port strike day 3; two critical parts ~5 days stock left',
  'c-suite/coo/supply_chain_disruption_brief|demand_and_customers':
    'Customer A needs 2k units next week; can slip 10 days',
  'c-suite/coo/supply_chain_disruption_brief|alternatives':
    'Air freight +¥1.8M; backup AP supplier needs 14-day qualification',

  'c-suite/cto/architecture_review|architecture_description':
    'Microservices, Kafka messaging, Redis cache, PostgreSQL primary...',
  'c-suite/cto/architecture_review|scale_requirements':
    '1k QPS now, ~10k in 1 year; TB-scale data',
  'c-suite/cto/architecture_review|team_size':
    '10 engineers: 3 BE, 2 FE, 1 DBA',
  'c-suite/cto/architecture_review|constraints':
    'Financial regulatory compliance; data must not leave jurisdiction',

  'c-suite/cto/security_posture_brief|current_posture_facts':
    'SSO+MFA everywhere; encryption at rest/in transit; SOC2 Type II last year; SBOM pilot 40%',
  'c-suite/cto/security_posture_brief|incidents_and_remediation':
    'One P2 in Q1, RCA filed; phishing drill click rate 4%',
  'c-suite/cto/security_posture_brief|compliance_targets':
    'Target ISO27001 by end 2026; NA customer requires data residency',

  'c-suite/cto/vendor_selection_memo|use_case':
    'Multi-cloud Kubernetes hosting and global load balancer upgrade',
  'c-suite/cto/vendor_selection_memo|candidates':
    'Vendor A: many PoPs; Vendor B: strong domestic compliance; Vendor C: cheap but thin features',
  'c-suite/cto/vendor_selection_memo|constraints':
    'Data must have in-region AZ; annual cap $800k; 90-day exit assistance',
  'c-suite/cto/vendor_selection_memo|weights':
    'Reliability 35%, cost 25%, compliance 25%, migration 15%',

  'cross-functional/data_storytelling|business_question':
    'Why did new-customer first-purchase conversion drop last quarter?',
  'cross-functional/data_storytelling|audience':
    'Director weekly meeting, 10-minute slot',
  'cross-functional/data_storytelling|data_findings':
    'First-purchase conversion 12% to 9%; mobile share up; coupons correlate with conversion',
  'cross-functional/data_storytelling|constraints':
    'Aggregates only; no individual drill-down',

  'cross-functional/decision_memo_one_pager|decision_question':
    'Migrate user auth from self-hosted IdP to managed IdP?',
  'cross-functional/decision_memo_one_pager|stakeholders':
    'Security, platform engineering, product, finance',
  'cross-functional/decision_memo_one_pager|constraints': 'Annual',
  'cross-functional/decision_memo_one_pager|options_summary':
    'A status quo; B vendor A; C vendor B + hybrid self-build',
  'cross-functional/decision_memo_one_pager|recommendation_lean':
    'Lean to B for compliance and ops cost; confirm data residency',

  'cross-functional/meeting_facilitation|objective':
    'Lock must-ship features and resource assumptions this quarter',
  'cross-functional/meeting_facilitation|attendees':
    'Product, eng lead, design, QA — one each',
  'cross-functional/meeting_facilitation|constraints':
    'Remote; record; legal must join pricing discussion',

  'cross-functional/okr_writing|team_context':
    'E-commerce growth team, 7 people, acquisition and retention',
  'cross-functional/okr_writing|goals_description':
    'Improve retention, reduce first-month churn, raise first-purchase completion',
  'cross-functional/okr_writing|current_metrics':
    'D30 retention 35%; first-purchase conversion 12%',

  'cross-functional/professional_email|scenario':
    'Ask counterpart for data definition by Friday',
  'cross-functional/professional_email|recipient_context':
    'Data team lead, cross-functional, not direct manager',
  'cross-functional/professional_email|key_points':
    'Need DAU definition; for Q2 OKR review; de-identified sample OK',
  'cross-functional/professional_email|deadline': 'Before 2026-04-12 18:00',
  'cross-functional/professional_email|language_pref':
    'Bilingual (body Chinese, subject EN+ZH)',

  'cross-functional/retrospective_facilitation|team_context':
    '8-person full-stack squad, 2-week sprints, just had an outage',
  'cross-functional/retrospective_facilitation|retro_focus':
    'Collaboration and on-call flow, not technical outage detail',
  'cross-functional/retrospective_facilitation|recent_events':
    'Ship slipped 2 days; one customer complaint; new-hire onboarding feedback',

  'cross-functional/weekly_status_update|role_context':
    'PM syncing delivery to eng director and business',
  'cross-functional/weekly_status_update|completed_items':
    'PRD approved; integration env ready; one blocker cleared',
  'cross-functional/weekly_status_update|metrics_or_milestones':
    'MVP scope locked 100%; P0 defects = 0',
  'cross-functional/weekly_status_update|risks_and_dependencies':
    'Legal terms not final, may affect signing window',
  'cross-functional/weekly_status_update|next_week_focus':
    'First round integration tests; prep launch checklist',

  'individual-contributor/customer-success/qbr_prep|customer_goals':
    '8% cost down; better store replenishment forecast; fewer IT tickets',
  'individual-contributor/customer-success/qbr_prep|usage_highlights':
    'DAU +12% MoM; one module still <30% adoption; elevated API errors for two weeks',
  'individual-contributor/customer-success/qbr_prep|open_items':
    'Waiting on customer IT for SSO; custom report backlog',

  'individual-contributor/data-analyst/sql_generation|business_question':
    'Users who purchased on each of the last 3 consecutive days',
  'individual-contributor/data-analyst/sql_generation|table_schema':
    'orders: user_id, order_date, amount, status; users: user_id, name, created_at',
  'individual-contributor/data-analyst/sql_generation|performance_priority':
    '~100M rows; must return within 30s',

  'individual-contributor/data-scientist/experiment_primer|decision_question':
    'Does new recommender improve D7 retention without hurting revenue?',
  'individual-contributor/data-scientist/experiment_primer|change_description':
    'Home feed from collaborative filtering to two-tower model',
  'individual-contributor/data-scientist/experiment_primer|baseline_rates':
    'D7 retention ~22%; revenue per user ~¥12',

  'individual-contributor/designer/ux_critique_feedback|design_context':
    'B2B trial signup 3-step flow; reduce drop at step 2',
  'individual-contributor/designer/ux_critique_feedback|target_user':
    'SMB IT lead on first trial',
  'individual-contributor/designer/ux_critique_feedback|known_constraints':
    'Must support IE11; brand primary color fixed',

  'individual-contributor/devops/incident_postmortem_draft|impact_facts':
    'API p99 >2s for 42 min; ~12% requests failed; no data loss',
  'individual-contributor/devops/incident_postmortem_draft|timeline_notes':
    '14:02 alert; 14:15 rollback; 14:44 recovered',
  'individual-contributor/devops/incident_postmortem_draft|hypothesized_cause':
    'Config change exhausted connection pool',

  'individual-contributor/finance/budget_variance_explanation|scope':
    'East China sales department selling expenses',
  'individual-contributor/finance/budget_variance_explanation|figures':
    'Budget ¥5.2M actual ¥6.1M; travel +¥0.8M; events +¥0.2M',
  'individual-contributor/finance/budget_variance_explanation|business_notes':
    'Two extra industry summits in Q1; higher airfares',

  'individual-contributor/legal/contract_review_red_flags|contract_type':
    'SaaS subscription (vendor as party A)',
  'individual-contributor/legal/contract_review_red_flags|clause_excerpts':
    'Liability cap 12 months fees; auto-renew; data to Singapore; arbitration HK',
  'individual-contributor/legal/contract_review_red_flags|jurisdiction_hint':
    'PRC law primary, some clauses Singapore',

  'individual-contributor/marketing/campaign_brief_one_pager|campaign_name':
    '2026 Q2 manufacturing lighthouse customer stories',
  'individual-contributor/marketing/campaign_brief_one_pager|goals':
    '300 SQLs; 2k whitepaper downloads; 3 small offline salons',
  'individual-contributor/marketing/campaign_brief_one_pager|constraints':
    'No specific ROI promise; mainland-only ads',

  'individual-contributor/sales-rep/cold_outreach|prospect_role_company':
    'VP Operations',
  'individual-contributor/sales-rep/cold_outreach|personalization_hook':
    'Posted on LinkedIn last week about digital transformation in manufacturing',
  'individual-contributor/sales-rep/cold_outreach|pain_point':
    'Production planning in Excel; stale inventory data hurts decisions',
  'individual-contributor/sales-rep/cold_outreach|value_proposition':
    'Our AI-ERP improves inventory turns ~30% for manufacturers',
  'individual-contributor/sales-rep/cold_outreach|language_preference': 'Chinese',

  'individual-contributor/security/triage_phishing_report|email_description':
    'Spoof HR, subject salary adjustment, .html attachment',
  'individual-contributor/security/triage_phishing_report|user_actions_so_far':
    'Clicked link but did not enter password',

  'individual-contributor/software-engineer/code_review|context':
    'User data export feature handling sensitive PII',
  'individual-contributor/software-engineer/code_review|review_focus': 'Security',

  'management/engineering-manager/one_on_one_agenda|employee_name': 'Wang Fang',
  'management/engineering-manager/one_on_one_agenda|role_level':
    'Mid-level front-end engineer L4',
  'management/engineering-manager/one_on_one_agenda|last_one_on_one_summary':
    'Wants more involvement in technical design reviews',
  'management/engineering-manager/one_on_one_agenda|current_focus':
    'Design system migration; integration with platform team',
  'management/engineering-manager/one_on_one_agenda|manager_observations':
    'Quiet in reviews lately; delivery quality stable',

  'management/engineering-manager/performance_review|employee_name': 'Zhang Ming',
  'management/engineering-manager/performance_review|role_level':
    'Senior backend engineer L5',
  'management/engineering-manager/performance_review|review_period': 'H2 2024',
  'management/engineering-manager/performance_review|key_achievements':
    'Led payment re-architecture, latency 200ms to 40ms; shipped new customer onboarding solo',
  'management/engineering-manager/performance_review|areas_for_improvement':
    'Inconsistent docs; sometimes quiet in meetings, fewer technical insights shared',
  'management/engineering-manager/performance_review|performance_rating':
    'Exceeds expectations',

  'management/hr-manager/interview_scorecard|job_description':
    'Java; high concurrency; work with product',
  'management/hr-manager/interview_scorecard|must_have_skills':
    'Kubernetes, Kafka, 5+ years distributed systems',
  'management/hr-manager/interview_scorecard|culture_values':
    'Ownership, candid feedback, customer success',

  'management/hr-manager/offer_letter_review_checklist|jurisdiction':
    'Mainland China (Shanghai)',
  'management/hr-manager/offer_letter_review_checklist|employment_type':
    'Full-time labor contract',
  'management/hr-manager/offer_letter_review_checklist|offer_text_or_summary':
    'Base, bonus, 6-month probation, NDA/IP, 12-month non-compete',
  'management/hr-manager/offer_letter_review_checklist|company_policies':
    'Equity in separate agreement; WFH needs approval',
  'management/hr-manager/offer_letter_review_checklist|sensitivity':
    'Candidate employed; clarify start date and notice period',

  'management/product-manager/prd_writing|feature_name': 'User notification center',
  'management/product-manager/prd_writing|problem_statement':
    'Users miss important alerts and break workflows',
  'management/product-manager/prd_writing|user_persona':
    'Enterprise admin processing 100+ approvals daily',
  'management/product-manager/prd_writing|business_context':
    'Raise engagement; fewer support tickets from missed messages',
  'management/product-manager/prd_writing|constraints':
    'Ship in existing mobile framework; no separate app',

  'management/product-manager/prioritization_rice|candidate_items':
    'Notification center refresh; report export perf; i18n copy pipeline',
  'management/product-manager/prioritization_rice|reach_assumptions':
    'Monthly active enterprise admins (MAU)',
  'management/product-manager/prioritization_rice|effort_unit': 'Person-weeks',
  'management/product-manager/prioritization_rice|constraints':
    'Key customer contract needs export by Q2',

  'management/sales-manager/pipeline_review_coaching|team_snapshot':
    '6 AEs; quarterly quota ¥8M; weighted forecast ¥6.2M',
  'management/sales-manager/pipeline_review_coaching|pipeline_metrics':
    'Weighted pipeline ¥12M; 18 opps stage 3+; avg 45 days in stage 3',
  'management/sales-manager/pipeline_review_coaching|forecast_rules':
    'Default prob by stage; commit only verbal + can sign next week',
  'management/sales-manager/pipeline_review_coaching|deal_highlights':
    'One POC delayed; two deals at competitive risk',
  'management/sales-manager/pipeline_review_coaching|known_blockers':
    'Slow pricing approval; one industry event postponed',
};

const nested = {};
const missing = [];
for (const row of raw) {
  const k = `${row.id}|${row.name}`;
  const en = flat[k];
  if (en === undefined) {
    missing.push(k);
    continue;
  }
  if (!nested[row.id]) nested[row.id] = {};
  nested[row.id][row.name] = en;
}

if (missing.length) {
  console.error('Missing translations:', missing);
  process.exit(1);
}

writeFileSync(join(__dirname, 'locale_example_map.json'), JSON.stringify(nested, null, 2), 'utf8');
console.log('Wrote tools/locale_example_map.json', Object.keys(nested).length, 'skills');
