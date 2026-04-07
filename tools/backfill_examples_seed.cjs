'use strict';

/** 35 legacy skills: substantive Output Example bodies for en + zh */
module.exports = [
  {
    id: 'management/sales-manager/pipeline_review_coaching',
    output_example_en:
      '## Coaching summary — Rep: Jordan / Region: UKI\n\n### Pipeline snapshot\n- **Coverage:** 2.8x quota (target 3.2x) — gap driven by two stalled enterprise deals >£120k.\n- **Hygiene:** 9 late-stage opportunities missing next-step dates.\n\n### Coaching focus\n1. **Qualification:** For Deal A, confirm economic buyer meeting is scheduled within 10 days or downgrade stage.\n2. **Velocity:** For Deal B, align CS + solutions engineer on a mutual success plan to unblock security review.\n\n### 7-day commitments\n| Action | Owner | Due |\n|--------|-------|-----|\n| MEDDPICC refresh on Deal A | Jordan | Apr 14 |\n| Security packet v2 sent | SE lead | Apr 12 |\n\n### Manager note\nPraise Jordan for strong discovery notes; reinforce "no next step, no stage advance" rule publicly in team meeting.',
    output_example_zh:
      '## 辅导摘要 — 代表：Jordan / 区域：英国爱尔兰\n\n### 管道快照\n- **覆盖：** 2.8x 配额（目标 3.2x）——缺口来自两单停滞的 >12 万英镑企业商机。\n- **卫生：** 9 个后期商机缺少下一步日期。\n\n### 辅导重点\n1. **资质：** 对商机 A，10 天内确认经济决策人会议，否则降级阶段。\n2. **速度：** 对商机 B，对齐 CS 与解决方案工程师，输出共同成功计划以打通安全评审。\n\n### 7 天承诺\n| 行动 | 负责人 | 截止 |\n|------|--------|------|\n| 商机 A 刷新 MEDDPICC | Jordan | 4/14 |\n| 发送安全材料 v2 | SE 负责人 | 4/12 |\n\n### 经理备注\n肯定 Jordan 的发现纪要质量；在周会重申「无下一步则不升阶段」。',
  },
  {
    id: 'management/product-manager/prioritization_rice',
    output_example_en:
      '## RICE prioritization — Q2 candidates (excerpt)\n\n| Initiative | Reach | Impact | Confidence | Effort | Score |\n|------------|-------|--------|------------|--------|-------|\n| Async exports | 8k admins/mo | 2 (massive time save) | 80% | 6 person-weeks | **85** |\n| SSO JIT groups | 3k tenants | 1.5 (security + onboarding) | 70% | 4 person-weeks | **79** |\n| Dark mode | 25k users | 0.5 (quality-of-life) | 90% | 10 person-weeks | **11** |\n\n### Decision\nShip **async exports** first (highest RICE + revenue-adjacent). Defer dark mode until design system tokens stabilize.\n\n### Notes\nConfidence for SSO is 70% due to unknown IdP edge cases — spike 3 days before committing roadmap.',
    output_example_zh:
      '## RICE 排序 — Q2 候选（节选）\n\n| 项目 | 触达 | 影响 | 信心 | 工作量 | 分数 |\n|------|------|------|------|--------|------|\n| 异步导出 | 月 8k 管理员 | 2（大幅省时） | 80% | 6 人周 | **85** |\n| SSO JIT 组 | 3k 租户 | 1.5（安全+上线） | 70% | 4 人周 | **79** |\n| 深色模式 | 25k 用户 | 0.5（体验） | 90% | 10 人周 | **11** |\n\n### 决策\n优先交付 **异步导出**（RICE 最高且贴近收入）。深色模式待设计令牌稳定后再排。\n\n### 备注\nSSO 信心 70% 因 IdP 边界未知 — 承诺路线图前先 3 天尖刺验证。',
  },
  {
    id: 'management/product-manager/prd_writing',
    output_example_en:
      '## PRD — Settlement CSV export v2 (excerpt)\n\n### Problem\nFinance admins lose ~6 hours/week re-running exports and manually splitting large downloads.\n\n### Goals / non-goals\n- **Goals:** async export for >10k rows; stable column order; RBAC parity with sync export.\n- **Non-goals:** custom per-tenant column sets (phase 2).\n\n### Functional requirements\n1. User triggers export; if rows >10k, show job ID + status page.\n2. Email + in-app notification on completion.\n\n### Success metrics\n- Support tickets tagged "export" **-25%** within 30 days of GA.\n- p95 job completion **<10 minutes** for 50k rows.\n\n### Risks\n- Storage cost for temporary files — mitigate with 7-day TTL + lifecycle policy.',
    output_example_zh:
      '## PRD — 结算 CSV 导出 v2（节选）\n\n### 问题\n财务管理员每周约浪费 6 小时重复导出并手工拆分大文件。\n\n### 目标/非目标\n- **目标：** >1 万行走异步导出；列顺序稳定；与同步导出 RBAC 一致。\n- **非目标：** 按租户自定义列（二期）。\n\n### 功能需求\n1. 用户触发导出；若行数 >1 万，展示任务 ID + 状态页。\n2. 完成时邮件 + 应用内通知。\n\n### 成功指标\n- 标签为「导出」的工单 **-25%**（全量后 30 天）。\n- 5 万行任务 p95 完成 **<10 分钟**。\n\n### 风险\n- 临时文件存储成本 — 以 7 天 TTL + 生命周期策略缓解。',
  },
  {
    id: 'management/hr-manager/offer_letter_review_checklist',
    output_example_en:
      '## Offer letter review — Candidate: A. Chen / Role: Senior Backend Engineer\n\n### Checklist\n- [x] Job title matches requisition REQ-4412\n- [x] Base salary within approved band (L5: $150k–$175k) — offer $168k OK\n- [x] Equity grant uses current FMV template dated Apr 1\n- [x] Start date allows background check completion (May 6)\n- [ ] **Gap:** relocation clause references old policy v4 — update to v5 language\n\n### Compliance notes\n- Non-compete not included (CA hire) — consistent with legal guidance.\n\n### Recommendation\n**Approve after** replacing relocation clause paragraph with v5 text; then route for e-sign.',
    output_example_zh:
      '## Offer 审核 — 候选人：A. Chen / 岗位：资深后端工程师\n\n### 清单\n- [x] 职位名称与需求 REQ-4412 一致\n- [x] 基本工资在批准带宽内（L5：15–17.5 万）— 16.8 万 OK\n- [x] 股权使用 4/1 当期 FMV 模板\n- [x] 入职日允许背调完成（5/6）\n- [ ] **缺口：** 搬迁条款仍引用旧政策 v4 — 需改为 v5 表述\n\n### 合规\n- 未含竞业限制（加州入职）— 符合法务指引。\n\n### 建议\n**替换** 搬迁段为 v5 文本后批准，再走电子签。',
  },
  {
    id: 'management/hr-manager/interview_scorecard',
    output_example_en:
      '## Interview scorecard — Senior Backend Engineer (Panel: Jordan, Priya)\n\n### Competencies (1–5)\n| Area | Jordan | Priya | Notes |\n|------|--------|-------|-------|\n| System design | 4 | 5 | Strong trade-off discussion on idempotency |\n| Coding | 4 | 4 | Clean tests; minor edge case miss |\n| Collaboration | 5 | 4 | Clear async communication examples |\n\n### Behavioral signals\n- Ownership: led incident retro without blame — **positive**\n- Conflict: resolved priority dispute with data — **positive**\n\n### Recommendation\n**Hire** at L5. Minor gap: distributed tracing depth — address in onboarding plan.\n\n### Biases check\n- Both interviewers used structured prompts; no "culture fit" vagueness.',
    output_example_zh:
      '## 面试评分卡 — 资深后端（评委：Jordan、Priya）\n\n### 能力（1–5）\n| 维度 | Jordan | Priya | 备注 |\n|------|--------|-------|------|\n| 系统设计 | 4 | 5 | 幂等权衡讨论扎实 |\n| 编程 | 4 | 4 | 测试清晰；边界小缺 |\n| 协作 | 5 | 4 | 异步沟通案例清楚 |\n\n### 行为信号\n- 主人翁：主导无责事故复盘 — **正向**\n- 冲突：用数据化解优先级争执 — **正向**\n\n### 建议\n**录用** L5。小缺口：分布式追踪深度 — 写入入职计划。\n\n### 偏见检查\n- 双方使用结构化问题；无模糊「文化契合」表述。',
  },
  {
    id: 'management/engineering-manager/performance_review',
    output_example_en:
      '## Performance review — Alex / IC4 Backend (cycle FY25 H2)\n\n### Summary\nAlex consistently delivers complex billing integrations with high quality. Growth edge is earlier cross-team alignment on ambiguous requirements.\n\n### Impact highlights\n- Shipped EU tax engine refactor on time; **zero** SEVs post-launch.\n- Mentored two L3 engineers through first on-call rotations.\n\n### Growth themes\n- **Stakeholder management:** initiate written "decision memo" for ambiguous asks before deep implementation.\n- **Technical leadership:** lead quarterly reliability roadmap slice for exports.\n\n### Rating / calibration notes\n**Meets high bar** — impact and scope match IC4 expectations; promotion to IC5 not yet sustained across quarters.\n\n### Next 6 months goals\n1. Own exports SLO improvement project (error budget + alerting).\n2. Present architecture deep dive to platform guild.',
    output_example_zh:
      '## 绩效评估 — Alex / IC4 后端（FY25 下半年）\n\n### 摘要\nAlex 持续高质量交付复杂计费集成；成长点是在需求模糊时更早做跨团队对齐。\n\n### 影响亮点\n- 按时交付欧洲税务引擎重构；上线后 **零** SEV。\n- 指导两名 L3 完成首次值班。\n\n### 成长主题\n- **干系人管理：** 深度开发前先写「决策备忘录」处理模糊需求。\n- **技术领导：** 牵头每季度可靠性路线中的导出切片。\n\n### 评级/校准\n**明显达标** — 影响与范围符合 IC4；晋升 IC5 尚未跨季度稳定证明。\n\n### 未来 6 个月目标\n1. 负责导出 SLO 提升项目（错误预算+告警）。\n2. 在平台公会做架构深聊分享。',
  },
  {
    id: 'management/engineering-manager/one_on_one_agenda',
    output_example_en:
      '## 1:1 agenda — Sam / 40 minutes / Apr 9\n\n### Check-in (5)\n- Energy level; anything celebrating from last week?\n\n### Core topics (20)\n- **Design reviews:** you mentioned wanting more critique — propose rotating facilitator next sprint.\n- **On-call load:** review ticket volume; adjust secondary if needed.\n\n### Feedback & expectations (8)\n- **Strength:** proactive docs on webhook retries — keep it up.\n- **Growth:** bring risks earlier in weekly update (don\'t wait for green status).\n\n### Blockers & support (5)\n- Need access to vendor sandbox — I will ping IT today.\n\n### Development theme\nPractice concise written decisions (1-page ADR template).\n\n### Actions\n| Action | Owner | Due |\n|--------|-------|-----|\n| IT sandbox access | Manager | Apr 10 |\n| Draft ADR for export job states | Sam | Apr 16 |',
    output_example_zh:
      '## 1:1 议程 — Sam / 40 分钟 / 4/9\n\n### 破冰（5）\n- 精力状态；上周有什么值得庆祝？\n\n### 核心（20）\n- **设计评审：** 你希望更多批评 — 建议下迭代轮流主持。\n- **值班负荷：** 看工单量；必要时调整二线。\n\n### 反馈与期望（8）\n- **优势：** webhook 重试文档主动 — 保持。\n- **成长：** 风险更早写进周更（别等全绿再说）。\n\n### 阻碍与支持（5）\n- 需要供应商沙箱权限 — 我今天找 IT。\n\n### 发展主题\n练习简洁书面决策（1 页 ADR 模板）。\n\n### 行动项\n| 行动 | 负责人 | 截止 |\n|------|--------|------|\n| IT 沙箱权限 | 经理 | 4/10 |\n| 导出任务状态 ADR 草稿 | Sam | 4/16 |',
  },
  {
    id: 'individual-contributor/security/triage_phishing_report',
    output_example_en:
      '## Phishing triage — Ticket #SOC-8821\n\n### Verdict\n**Malicious** — credential harvesting page impersonating Okta login; URL uses homoglyph domain.\n\n### Indicators\n- Sender: `security@acme-okta.com` (lookalike)\n- Link resolves to IP in AS4134 with fresh cert (2 days)\n- Attachment: none\n\n### Actions taken\n- Block URL at proxy + submit to threat intel feed\n- Reset password for the one user who clicked (U: `jsmith`) and force MFA re-enroll\n- Purge message from mailboxes via admin search\n\n### Customer comms\nInternal notice: "If you entered credentials, reset immediately via known Okta portal."\n\n### Follow-ups\n- Add DLP rule for homoglyph domains containing "okta"',
    output_example_zh:
      '## 钓鱼分流 — 工单 #SOC-8821\n\n### 结论\n**恶意** — 仿冒 Okta 登录的凭据钓鱼页；URL 使用同形异义域名。\n\n### 指标\n- 发件人：`security@acme-okta.com`（仿冒）\n- 链接解析到 AS4134 段新证书（2 天）\n- 附件：无\n\n### 已采取措施\n- 代理封禁 URL + 提交威胁情报\n- 对唯一点击用户 `jsmith` 重置密码并强制重绑 MFA\n- 管理搜索清理邮箱中的邮件\n\n### 对内沟通\n「若已输入凭据，请通过已知 Okta 入口立即重置。」\n\n### 跟进\n- 增加针对含「okta」同形域的 DLP 规则',
  },
  {
    id: 'individual-contributor/sales-rep/cold_outreach',
    output_example_en:
      'Subject: quick question on payout close week\n\nHi Dana — I noticed FinScale expanded to two new entities last quarter. Teams like yours often hit a wall when spreadsheet approvals don\'t scale across entities.\n\nIf you\'re open, I can share a 1-page checklist we use with finance ops leaders to cut manual hours without changing banks.\n\nWorth a 12-minute chat next week?\n\nBest,\n[Name]\n[Title] | [Company]\nP.S. If this isn\'t you, who owns payout operations?',
    output_example_zh:
      '主题：关于关账周打款流程的快速请教\n\nDana 你好 — 注意到 FinScale 上季度新增两个主体。类似规模的团队常在「表格审批跨主体不可扩展」上遇到瓶颈。\n\n若你愿意，我可以分享我们给财务运营负责人用的 1 页清单：在不换银行的前提下压缩手工时间。\n\n下周方便聊 12 分钟吗？\n\n祝好，\n[姓名]\n[职位] | [公司]\nP.S. 若你不是对口人，方便引荐负责打款运营的同事吗？',
  },
  {
    id: 'individual-contributor/legal/contract_review_red_flags',
    output_example_en:
      '## Contract red flags — Vendor MSA draft v3 (excerpt)\n\n### High risk\n1. **Unlimited liability** for indirect/consequential damages — not acceptable; propose mutual cap at fees paid in prior 12 months.\n2. **IP assignment** sweeps "any improvements" broadly — narrow to deliverables listed in SOW.\n\n### Medium risk\n- **Auto-renewal** 3-year term without price cap — add 90-day notice + CPI ceiling.\n- **SLA credits** capped at monthly fees while uncapped indemnity exists — imbalance.\n\n### Low / operational\n- Governing law: Delaware OK; venue acceptable.\n- Data processing exhibit references outdated DPA template (2023) — update to 2026 version.\n\n### Suggested reply to counterparty\n"We can agree on strong SLAs, but need mutual liability caps aligned to industry standard and narrower IP scope tied to statements of work."',
    output_example_zh:
      '## 合同红旗 — 供应商 MSA 草案 v3（节选）\n\n### 高风险\n1. **无限责任**（间接/后果性损害）— 不可接受；建议双方以过去 12 个月已付费用为上限。\n2. **知识产权转让** 泛化「任何改进」— 收窄至 SOW 列明交付物。\n\n### 中风险\n- **自动续约** 三年且价格无上限 — 增加 90 天通知 + CPI 上限。\n- **SLA 抵扣** 上限为月费但赔偿不对等 — 需平衡。\n\n### 低/运营\n- 适用法律：特拉华 OK；管辖可接受。\n- 数据处理附件仍引用 2023 DPA 模板 — 更新至 2026 版。\n\n### 给对方回复建议\n「我们认可强 SLA，但责任上限需符合行业惯例，且 IP 范围应与工作说明书绑定。」',
  },
  {
    id: 'individual-contributor/finance/budget_variance_explanation',
    output_example_en:
      '## Budget variance explanation — Marketing / March FY26\n\n### Headline\nMarketing spend **+12% vs budget** ($1.12M actual vs $1.00M plan).\n\n### Drivers\n1. **Events (+$85k):** two industry conferences moved into March from April.\n2. **Paid search (+$42k):** CPC up ~11% on branded + category terms after competitor campaign.\n\n### Mitigations already in motion\n- Shift $60k from Q2 syndication budget to cover March events.\n- SEM team running negative keyword audit weekly through April.\n\n### Outlook\nExpect April marketing spend to normalize unless CPC remains elevated — monitor weekly and revisit forecast in week 3.',
    output_example_zh:
      '## 预算差异说明 — 市场 / FY26 年 3 月\n\n### 要点\n市场费用 **较预算 +12%**（实际 112 万 vs 计划 100 万）。\n\n### 驱动\n1. **活动（+8.5 万）：** 两场行业会从 4 月提前到 3 月。\n2. **搜索投放（+4.2 万）：** 竞品战役后品牌+类目词 CPC 约 +11%。\n\n### 已在执行的缓解\n- 从 Q2 内容分发预算调剂 6 万覆盖 3 月活动。\n- SEM 团队在 4 月前每周做否定词审计。\n\n### 展望\n预计 4 月费用回归正常，除非 CPC 持续高位 — 周监控并在第 3 周更新预测。',
  },
  {
    id: 'individual-contributor/devops/incident_postmortem_draft',
    output_example_en:
      '## Blameless postmortem — INC-2026-0412 Checkout degradation\n\n### Summary\nBetween 09:10–09:55 UTC, checkout error rate peaked at 6.2% due to a bad feature flag default combined with a cache stampede after deploy `rel-8819`.\n\n### Customer impact\n~3.4k failed checkouts; estimated revenue at risk $180k (model).\n\n### Timeline (UTC)\n- 09:08 deploy completes\n- 09:10 flag `checkout.cache` defaults ON without warm keys\n- 09:18 SEV2 declared; flag disabled at 09:22\n- 09:55 error rate normalized\n\n### Root causes\n1. Missing canary on flag default change\n2. Cache TTL too aggressive for hot keys\n\n### Action items\n| Action | Owner | Due |\n|--------|-------|-----|\n| Add launch review checklist item for flag defaults | SRE | Apr 20 |\n| Implement cache warming job | Backend | Apr 25 |\n\n### Lessons\nTreat feature flags as production config — same rigor as code changes.',
    output_example_zh:
      '## 无责复盘 — INC-2026-0412 结账降级\n\n### 摘要\n09:10–09:55 UTC 结账错误率峰值 6.2%，因特性开关默认值不当 + 发布 `rel-8819` 后缓存挤爆。\n\n### 客户影响\n约 3400 次失败结账；估计收入风险 18 万（模型）。\n\n### 时间线（UTC）\n- 09:08 发布完成\n- 09:10 开关 `checkout.cache` 默认开启但未预热键\n- 09:18 宣告 SEV2；09:22 关闭开关\n- 09:55 错误率恢复\n\n### 根因\n1. 开关默认值变更缺金丝雀\n2. 热键缓存 TTL 过激进\n\n### 行动项\n| 行动 | 负责人 | 截止 |\n|------|--------|------|\n| 发布评审清单增加「开关默认值」项 | SRE | 4/20 |\n| 实施缓存预热任务 | 后端 | 4/25 |\n\n### 经验\n把特性开关当作生产配置 —— 与代码变更同等严谨。',
  },
  {
    id: 'individual-contributor/designer/ux_critique_feedback',
    output_example_en:
      '## UX critique — Billing settings redesign (v4)\n\n### What works\n- Clear hierarchy: "Payment methods" separated from "Approval rules" reduces cognitive load.\n- Inline validation on IBAN entry prevents late failures — nice.\n\n### Issues\n1. **Severity: High** — Primary CTA "Save" looks disabled (low contrast in dark mode). Fix token `primary-on-surface` to meet 4.5:1.\n2. **Severity: Medium** — Users may not discover advanced filters behind "More" — add tooltip + first-run hint.\n\n### Suggestions\n- Swap order: show "risky actions" (delete bank) behind explicit confirmation modal with summary.\n- Add empty state illustration + 2-line explanation for first-time admins.\n\n### Positive close\nOverall direction is strong; polish accessibility and discoverability before GA.',
    output_example_zh:
      '## 体验评审 — 计费设置重设计（v4）\n\n### 优点\n- 层级清晰：「支付方式」与「审批规则」分区降低认知负担。\n- IBAN 内联校验避免后期失败 —— 很好。\n\n### 问题\n1. **高：** 主按钮「保存」在深色模式下像禁用（对比不足）。调整 `primary-on-surface` 至 4.5:1。\n2. **中：** 高级筛选藏在「更多」后不易发现 —— 加提示与首次引导。\n\n### 建议\n- 调整顺序：删除银行等高风险动作放入明确确认的弹窗并附摘要。\n- 首次管理员增加空状态插画 + 两行说明。\n\n### 收尾肯定\n方向很强；全量前补齐无障碍与可发现性。',
  },
  {
    id: 'individual-contributor/data-scientist/experiment_primer',
    output_example_en:
      '## Experiment primer — Uplift on onboarding checklist\n\n### Decision to run\nWe believe a guided checklist increases activation within 7 days for SMB tenants.\n\n### Hypothesis\nIf we show a 4-step checklist on first login, then **Day-7 activation** increases by ≥6 percentage points without hurting support volume.\n\n### Unit of randomization\n**Tenant** (not user) to avoid interference within the same account.\n\n### Metrics\n- **Primary:** % tenants completing "first payout test" within 7 days\n- **Guardrails:** support tickets per activated tenant; time-to-first-value median\n\n### Power / duration\n- Need ~6k tenants over 14 days for 80% power at 6pt lift (rough estimate)\n\n### Stop rules\nStop early if guardrail metric worsens >20% vs control for 3 consecutive days.\n\n### Analysis plan\nIntent-to-treat; CUPED optional for variance reduction; segment by region but avoid fishing.',
    output_example_zh:
      '## 实验primer — 入职清单提升激活\n\n### 是否做实验\n我们相信引导式清单可提升 SMB 租户 7 日内激活。\n\n### 假设\n若首次登录展示 4 步清单，则 **第 7 日激活率** 提升 ≥6 个百分点，且不推高支持工单。\n\n### 随机单元\n**租户**（非用户）以避免同账户干扰。\n\n### 指标\n- **主指标：** 7 天内完成「首次打款测试」的租户占比\n- **护栏：** 每激活租户工单数；价值实现时间中位数\n\n### 功效/周期\n- 粗估需约 6k 租户、14 天达 80% 功效（6 点提升）\n\n### 止损\n若护栏相对对照连续 3 天恶化 >20% 则提前停止。\n\n### 分析\nITT；可用 CUPED 降方差；可按地区分群但避免钓鱼式挖掘。',
  },
  {
    id: 'cross-functional/weekly_status_update',
    output_example_en:
      '## Weekly status — Platform team / Week ending Apr 6\n\n### Highlights\n- Shipped async export MVP to 10% canary; no SLO regressions.\n- Reduced CI flaky rate from 9% → 4% after quarantine job.\n\n### This week plan\n- Expand canary to 25% with finance pilot customers\n- Finish cache warming design review\n\n### Risks / asks\n- **Risk:** vendor cert rotation Apr 10 — need on-call coverage overlap\n- **Ask:** approve contractor 0.5 FTE for 6 weeks (peak support)\n\n### Metrics\n- Checkout availability: 99.97% (target 99.95%)\n- MTTR incidents: 42m (target <60m)',
    output_example_zh:
      '## 周度状态 — 平台团队 / 截至 4/6\n\n### 亮点\n- 异步导出 MVP 金丝雀 10% 上线；SLO 无回退。\n- 隔离任务后 CI 不稳定率从 9% → 4%。\n\n### 本周计划\n- 金丝雀扩至 25% 并纳入财务试点客户\n- 完成缓存预热设计评审\n\n### 风险/诉求\n- **风险：** 4/10 供应商证书轮换 — 需值班重叠\n- **诉求：** 批准 6 周 0.5 外包（高峰支持）\n\n### 指标\n- 结账可用性：99.97%（目标 99.95%）\n- 事故 MTTR：42 分钟（目标 <60）',
  },
  {
    id: 'cross-functional/retrospective_facilitation',
    output_example_en:
      '## Retro facilitation plan — Sprint 24 (60 min)\n\n### Opening (5)\n- Reminder: blameless; focus on systems\n\n### Data slice (10)\n- Review sprint goal attainment + incident count + carry-over reasons\n\n### Brainstorm (15)\n- Silent write: "What helped / what hurt delivery"\n- Group themes on board\n\n### Deep dive (20)\nPick top 2 themes:\n1. Unclear acceptance criteria caused rework\n2. Waiting on security review too late\n\n### Actions (8)\n| Action | Owner | Due |\n|--------|-------|-----|\n| Add AC checklist to PR template | EM | Apr 12 |\n| Security office hours Wed 10am | Sec | ongoing |\n\n### Close (2)\n- Retro feedback on retro (1–5)',
    output_example_zh:
      '## 回顾主持计划 — 迭代 24（60 分钟）\n\n### 开场（5）\n- 重申无责；聚焦系统\n\n### 数据切片（10）\n- 迭代目标达成 + 事故数 + 结转原因\n\n### 头脑风暴（15）\n- 静默写：「什么帮助交付 / 什么阻碍」\n- 主题归类上墙\n\n### 深挖（20）\n选两大主题：\n1. 验收标准不清导致返工\n2. 安全评审介入过晚\n\n### 行动（8）\n| 行动 | 负责人 | 截止 |\n|------|--------|------|\n| PR 模板加 AC 清单 | EM | 4/12 |\n| 安全答疑周三 10:00 | 安全 | 持续 |\n\n### 收尾（2）\n- 对回顾本身打分（1–5）',
  },
  {
    id: 'cross-functional/professional_email',
    output_example_en:
      'Subject: Decision needed: analytics export rollout date\n\nHi team — we\'re ready to expand the analytics export canary from 10% → 25%.\n\n**Proposal:** Tuesday Apr 15 09:00 UTC, after the vendor cert rotation completes.\n\n**Why:** Gives 48h buffer to observe error budgets and avoids overlapping with Monday finance close activities.\n\nPlease reply **approve** or **concern + reason** by Monday 12:00 UTC.\n\nThanks,\n[Name]\nProgram Manager, Reliability',
    output_example_zh:
      '主题：需决策：分析导出金丝雀扩面日期\n\n各位好 — 我们准备将分析导出金丝雀从 10% 扩至 25%。\n\n**建议：** 4/15（周二）09:00 UTC，在供应商证书轮换完成之后。\n\n**原因：** 留 48 小时观察错误预算，并避开周一财务关账高峰。\n\n请在 **周一 12:00 UTC 前** 回复「同意」或「顾虑+原因」。\n\n谢谢，\n[姓名]\n可靠性项目经理',
  },
  {
    id: 'cross-functional/okr_writing',
    output_example_en:
      '## OKR draft — Product Ops / Q2\n\n### Objective O1\nMake enterprise onboarding predictable and measurable.\n\n**Key results**\n- KR1: Reduce p90 time-to-first-successful-payout from **18d → 12d**\n- KR2: Achieve **90%** of onboardings with a documented mutual success plan\n- KR3: Keep onboarding CSAT **≥ 8.5/10** while scaling volume +25%\n\n### Objective O2\nStrengthen export reliability for finance automation.\n\n**Key results**\n- KR1: Export job success rate **≥ 99.5%** monthly\n- KR2: p95 export latency **< 10 minutes** for 50k-row jobs\n\n### Notes\nKRs are outcomes, not tasks; initiatives will be tracked separately in the roadmap doc.',
    output_example_zh:
      '## OKR 草案 — 产品运营 / Q2\n\n### 目标 O1\n让大型企业上线可预测、可衡量。\n\n**关键结果**\n- KR1：首次成功打款的 p90 从 **18 天 → 12 天**\n- KR2：**90%** 上线具备书面共同成功计划\n- KR3：在体量 +25% 情况下 onboarding CSAT **≥8.5/10**\n\n### 目标 O2\n强化导出可靠性以支撑财务自动化。\n\n**关键结果**\n- KR1：导出任务月成功率 **≥99.5%**\n- KR2：5 万行任务 p95 **<10 分钟**\n\n### 备注\nKR 是结果非任务；举措在路线图中单独跟踪。',
  },
  {
    id: 'cross-functional/meeting_facilitation',
    output_example_en:
      '## Facilitation plan — Quarterly planning (90 min)\n\n### Desired outcomes\n1. Agree top 3 bets for next quarter\n2. Identify resource conflicts + decision owner\n\n### Agenda\n- 0–10: context + constraints (PM)\n- 10–35: option pitches (5 min each)\n- 35–60: debate + pre-mortem on top 2 bets\n- 60–85: decisions + next steps\n- 85–90: recap email responsibilities\n\n### Ground rules\n- One conversation at a time; park lot for tangents\n- Decisions captured in shared doc live\n\n### Facilitator prompts\n- "What would make this fail in 6 weeks?"\n- "What are we saying no to if we say yes?"',
    output_example_zh:
      '## 会议主持计划 — 季度规划（90 分钟）\n\n### 期望产出\n1. 确定下季度三大押注\n2. 识别资源冲突 + 决策负责人\n\n### 议程\n- 0–10：背景与约束（PM）\n- 10–35：方案路演（各 5 分钟）\n- 35–60：讨论 + 两大押注的预失败分析\n- 60–85：决策与下一步\n- 85–90：纪要邮件分工\n\n### 规则\n- 一次一个话题；偏题进停车场\n- 决策实时写入共享文档\n\n### 主持提问\n- 「6 周后什么会导致失败？」\n- 「若同意，我们拒绝什么？」',
  },
  {
    id: 'cross-functional/decision_memo_one_pager',
    output_example_en:
      '## Decision memo — Adopt managed Flink for fraud enrichment (1 pager)\n\n### Context\nRule latency requirements tightened; current stream path cannot meet p95 <2s during peak.\n\n### Options\nA) Managed Flink (vendor B)  B) Expand Kafka Streams  C) Delay requirement\n\n### Recommendation\n**Option A** for 12 months with portability clause; reassess build at month 9.\n\n### Rationale\nFastest path to meet SLO; ops burden acceptable vs team capacity; vendor meets data residency.\n\n### Risks / mitigations\n- Vendor lock-in → contract export + abstraction layer for state snapshots\n- Cost growth → autoscale caps + monthly review\n\n### Decision owners / date\nCTO + CFO approval by Apr 18; PM to communicate to risk team Apr 19.',
    output_example_zh:
      '## 决策备忘录 — 采用托管 Flink 做欺诈 enrich（1 页）\n\n### 背景\n规则延迟要求收紧；现有流路径在峰值无法满足 p95 <2s。\n\n### 选项\nA）托管 Flink（B 供应商） B）扩展 Kafka Streams C）推迟需求\n\n### 建议\n**选 A** 12 个月并含可迁移条款；第 9 月复盘是否自研。\n\n### 理由\n最快满足 SLO；相对团队产能运维负担可接受；供应商满足驻留。\n\n### 风险/缓解\n- 供应商锁定 → 合同导出 + 状态快照抽象层\n- 成本上升 → 弹性上限 + 月度审视\n\n### 决策人/日期\nCTO+CFO 4/18 前批准；PM 4/19 向风险团队同步。',
  },
  {
    id: 'cross-functional/data_storytelling',
    output_example_en:
      '## Data story — Why churn ticked up in March (5-minute read)\n\n### The headline\nChurn MRR rose **+0.6 pts** MoM — mostly concentrated in SMB EU customers who onboarded in Q4.\n\n### The chart that matters\nCohort curve for Q4 SMB EU shows faster drop after day 45, coinciding with pricing tier changes.\n\n### Hypothesis (data-backed)\nNot a product outage — support tickets flat. Likely **bill shock** from usage-based fees after initial promo period.\n\n### Recommendation\n1. CS outreach playbook for day-35 check-in with projected bill\n2. Product: clearer in-app forecast of usage fees\n\n### Next update\nWe will track a experiment cohort starting Apr 20 and report in 3 weeks.',
    output_example_zh:
      '## 数据叙事 — 为何 3 月流失上升（5 分钟阅读）\n\n### 要点\n流失 MRR **环比 +0.6 点** —— 主要集中在 Q4 上线的欧洲 SMB。\n\n### 关键图\nQ4 SMB 欧洲队列在 ~45 天后更快下滑，与价位档调整时间重合。\n\n### 假设（有数据支撑）\n非产品事故 —— 支持工单平稳。更可能是促销期后 **用量费用账单冲击**。\n\n### 建议\n1. CS 在第 35 天做账单预测式回访\n2. 产品：应用内更清晰展示用量费用预测\n\n### 下次更新\n4/20 起跟踪实验队列，三周后汇报。',
  },
  {
    id: 'c-suite/cto/vendor_selection_memo',
    output_example_en:
      '## Vendor selection memo — Managed Kubernetes for EU workloads\n\n### Requirements\n- EU data residency, SOC2 Type II, private networking, 99.95% SLA\n\n### Shortlist\n- Vendor X: strongest EU regions; higher cost\n- Vendor Y: lower cost; smaller EU footprint\n\n### Evaluation\n| Criteria | Weight | X | Y |\n|----------|--------|---|---|\n| Reliability history | 30% | 9 | 7 |\n| Cost (3-yr TCO) | 25% | 6 | 9 |\n| Security/compliance | 25% | 9 | 8 |\n| Engineer experience | 20% | 8 | 7 |\n\n### Recommendation\n**Vendor X** for production EU; use Y for non-prod sandboxes to optimize spend.\n\n### Next steps\nLegal redlines + security architecture review complete by May 1.',
    output_example_zh:
      '## 供应商选型备忘录 — 欧洲工作负载托管 Kubernetes\n\n### 需求\n- 欧盟驻留、SOC2 Type II、私网、99.95% SLA\n\n### 短名单\n- X：欧洲区域强；成本更高\n- Y：成本更低；欧洲覆盖较小\n\n### 评估\n| 标准 | 权重 | X | Y |\n|------|------|---|---|\n| 可靠性记录 | 30% | 9 | 7 |\n| 成本（3 年 TCO） | 25% | 6 | 9 |\n| 安全/合规 | 25% | 9 | 8 |\n| 工程师体验 | 20% | 8 | 7 |\n\n### 建议\n生产欧洲选 **X**；非生产沙箱用 **Y** 优化花费。\n\n### 下一步\n5/1 前完成法务红线与安全架构评审。',
  },
  {
    id: 'c-suite/cto/security_posture_brief',
    output_example_en:
      '## Security posture brief — Board readout (Q1)\n\n### Executive summary\nRisk posture is **stable** with continued investment in identity, detection, and vendor risk. No material incidents this quarter.\n\n### Key metrics\n- MFA coverage: **99.2%** human accounts\n- Mean time to contain incidents: **38 minutes** (target <45)\n- Critical vulns open >30d: **2** (down from 5)\n\n### Priorities next quarter\n- Complete access review automation for cloud IAM\n- Roll out phishing-resistant MFA for admin roles\n\n### Asks\n- Approve incremental budget for SIEM storage growth (+$90k annualized)\n\n### Assurance\nExternal pen test remediation: 14/16 items closed; 2 accepted risks documented with compensating controls.',
    output_example_zh:
      '## 安全态势简报 — 董事会（Q1）\n\n### 执行摘要\n风险态势 **稳定**，持续投入身份、检测与供应商风险。本季无重大事故。\n\n### 关键指标\n- MFA 覆盖：**99.2%** 人类账号\n- 事件遏制平均时长：**38 分钟**（目标 <45）\n- >30 天未修严重漏洞：**2**（从 5 下降）\n\n### 下季重点\n- 完成云 IAM 访问评审自动化\n- 管理角色推广防钓鱼 MFA\n\n### 诉求\n- 批准 SIEM 存储增长预算（年化 +9 万）\n\n### 保证\n外部渗透整改：16 项中 14 已关；2 项接受风险并有补偿控制。',
  },
  {
    id: 'c-suite/cto/architecture_review',
    output_example_en:
      '## Architecture review — Real-time fraud scoring service (summary)\n\n### Problem / goals\nReduce rule evaluation latency and improve safe experimentation for risk teams.\n\n### Proposed architecture\n- Flink job consuming payment events\n- Feature store for hot features + online model scoring sidecar\n- Shadow mode deployment for 14 days\n\n### Trade-offs\n- **Pros:** meets p95 <2s; supports rapid rule iteration\n- **Cons:** operational complexity; need SRE coverage\n\n### Risks\n- State checkpoint failures during peak — mitigated with multi-AZ + automated restore drills\n\n### Decision\n**Proceed** to detailed design phase; require SLO dashboard + runbooks before GA.\n\n### Actions\n- Platform team staffing plan by Apr 22\n- Security review of data flows by Apr 25',
    output_example_zh:
      '## 架构评审 — 实时欺诈评分服务（摘要）\n\n### 问题/目标\n降低规则评估延迟，并为风险团队提供安全实验能力。\n\n### 方案\n- Flink 作业消费支付事件\n- 特征库 + 在线模型 sidecar\n- 14 天影子模式\n\n### 权衡\n- **利：** 满足 p95<2s；规则迭代快\n- **弊：** 运维复杂；需 SRE 覆盖\n\n### 风险\n- 峰值检查点失败 — 多 AZ + 自动恢复演练缓解\n\n### 决策\n进入详细设计；全量前需 SLO 面板 + 手册。\n\n### 行动\n- 4/22 前平台人力计划\n- 4/25 前完成数据流安全评审',
  },
  {
    id: 'c-suite/coo/supply_chain_disruption_brief',
    output_example_en:
      '## Supply chain disruption brief — EU inbound lanes (48h update)\n\n### Situation\nPort congestion + carrier labor action is delaying **12%** of inbound SKUs by 4–9 days.\n\n### Customer impact\n- Tier1 retail accounts: 3 SKUs at risk of stockout within 7 days\n\n### Mitigations in flight\n- Airfreight partial shipment for SKU-4412 (cost +$120k)\n- Shift 8% volume to alternate carrier with 2-day longer baseline but stable schedule\n\n### Financial exposure\nRevenue at risk **$1.8M** over 3 weeks if no mitigation; mitigated plan reduces to **$0.4M**\n\n### Decisions needed\n- Approve airfreight exception (threshold >$100k)\n- Authorize temporary OT at fulfillment site B\n\n### Comms\nCustomer success scripts updated; daily exec standup until green.',
    output_example_zh:
      '## 供应链扰动简报 — 欧洲入向通道（48 小时更新）\n\n### 情况\n港口拥堵 + 承运人劳工行动导致 **12%** 入向 SKU 延迟 4–9 天。\n\n### 客户影响\n- 一级零售客户：3 个 SKU 7 日内有断货风险\n\n### 进行中缓解\n- SKU-4412 部分空运（成本 +12 万）\n- 8% 货量转至备选承运（基线慢 2 天但更稳定）\n\n### 财务敞口\n若不处理 3 周收入风险 **180 万**；缓解后降至 **40 万**\n\n### 待决策\n- 批准空运例外（阈值 >10 万）\n- 授权履约中心 B 临时加班\n\n### 沟通\nCS 话术已更新；恢复前每日高管站会。',
  },
  {
    id: 'c-suite/coo/pmi_ops_integration_checklist',
    output_example_en:
      '## PMI ops integration checklist — Week 3 (excerpt)\n\n### HR / workforce\n- [x] Payroll cutover dry run completed\n- [ ] Manager mapping for approval chains validated in 100% of entities\n\n### IT / systems\n- [x] SSO federation tested for acquired domain\n- [ ] ERP inventory sync job running <15m latency in staging\n\n### Customer ops\n- [ ] Unified ticketing queues configured; macros imported\n- [ ] SLA timers adjusted for new business hours per region\n\n### Risk register\n- **R1:** duplicate vendor contracts — owner Legal; due Apr 14\n- **R2:** data residency for EU customers — owner Security; due Apr 18\n\n### Go/No-go gate Apr 20\nRequires green on R1/R2 + successful payroll dry run #2.',
    output_example_zh:
      '## 并购运营整合清单 — 第 3 周（节选）\n\n### 人力\n- [x] 薪酬切换演练完成\n- [ ] 全部法人实体审批链经理映射校验\n\n### IT/系统\n- [x] 被收购域 SSO 联邦测试\n- [ ] 预发 ERP 库存同步作业延迟 <15 分钟\n\n### 客户运营\n- [ ] 统一工单队列配置；宏导入\n- [ ] 按区域调整 SLA 计时与工作时段\n\n### 风险登记\n- **R1：** 重复供应商合同 — 法务；截止 4/14\n- **R2：** 欧盟客户数据驻留 — 安全；截止 4/18\n\n### 4/20 门禁\nR1/R2 关闭 + 第二次薪酬演练成功方可继续。',
  },
  {
    id: 'c-suite/cmo/product_launch_messaging_brief',
    output_example_en:
      '## Messaging brief — Analytics+ launch\n\n### Positioning statement\nFor finance leaders who need board-ready variance stories, **Analytics+** is a narrative workspace that turns reconciled metrics into defensible explanations—unlike static BI exports that break under scrutiny.\n\n### Key messages\n1. **Trust:** numbers tie to the same ledger views your auditors already trust\n2. **Speed:** go from question to annotated storyline in minutes, not days\n3. **Governance:** permissions mirror payout and reporting roles\n\n### Proof points\n- SOC2 controls on exports; immutable audit trail\n- Pilot customer: "cut board prep from 9 days to 4" (FinEuro case)\n\n### Launch channels\n- Webinar + 3-part LinkedIn story series + customer email to finance admins\n\n### Guardrails\nAvoid promising specific ROI; use "customers report" language with citations.',
    output_example_zh:
      '## 发布信息简报 — Analytics+\n\n### 定位陈述\n面向需要董事会级差异叙事的财务负责人，**Analytics+** 是将已对账指标转化为可辩护解释的故事工作区——不同于在质询下易崩的静态 BI 导出。\n\n### 核心信息\n1. **可信：** 数字与审计已认可的账簿视图一致\n2. **速度：** 从问题到带注释叙事只需数分钟而非数天\n3. **治理：** 权限镜像打款与报表角色\n\n### 证据\n- 导出 SOC2 控制；不可篡改审计链\n- 试点客户：「董事会准备从 9 天到 4 天」（FinEuro 案例）\n\n### 发布渠道\n- 网络研讨会 + 领英 3 段故事 + 财务管理员邮件\n\n### 边界\n避免承诺具体 ROI；用「客户反馈」并附引用。',
  },
  {
    id: 'c-suite/cmo/brand_positioning_memo',
    output_example_en:
      '## Brand positioning memo — FY26 refresh (excerpt)\n\n### Category frame\nWe compete in **financial operations infrastructure**, not generic "fintech apps."\n\n### Target ICP\nMid-market finance teams (200–2,000 employees) modernizing controls without ripping out banks.\n\n### Value pillars\n1. **Control:** approvals, logs, roles\n2. **Speed:** fewer spreadsheets, fewer handoffs\n3. **Credibility:** compliance-ready artifacts\n\n### Differentiation vs competitors\n- vs suites: deeper workflows for payouts + exports\n- vs point tools: enterprise-grade access + auditability\n\n### Voice & tone\nCalm, precise, confident — avoid hype adjectives ("revolutionary").\n\n### Implications\nUpdate homepage hero, sales deck chapter 1, and analyst briefing doc with consistent pillar language.',
    output_example_zh:
      '## 品牌定位备忘录 — FY26 刷新（节选）\n\n### 品类框\n我们处于 **财务运营基础设施**，而非泛「金融科技应用」。\n\n### 目标 ICP\n200–2000 人、在不换掉银行的前提下现代化控制的中型财务团队。\n\n### 价值支柱\n1. **控制：** 审批、日志、角色\n2. **速度：** 更少表格与转手\n3. **可信：** 合规可用材料\n\n### 差异化\n- 对套件：打款+导出工作流更深\n- 对单点：企业级访问与可审计性\n\n### 语气\n冷静、精确、自信 —— 避免「颠覆」类夸张词。\n\n### 落地\n首页首屏、销售 deck 第一章、分析师简报统一支柱语言。',
  },
  {
    id: 'c-suite/chro/workforce_planning_exec_summary',
    output_example_en:
      '## Workforce planning — executive summary (Q2)\n\n### Headcount plan\nNet **+120** roles globally, concentrated in GTM (55) and R&D (45), with slower growth in G&A (20).\n\n### Critical skills gaps\n- Enterprise sales leadership in UKI\n- Senior security engineers for platform hardening\n\n### Risks\n- Hiring market cooling helps cost, but lengthens time-to-fill for niche roles\n- Geo expansion requires localized benefits review in 2 countries\n\n### Actions\n- Launch internal mobility program for IC5+ engineers (May)\n- Approve 8 contractor slots for peak implementation season\n\n### DEI note\nPipeline for URG candidates in engineering interviews improved +6 pts QoQ; continue sponsorship program funding.',
    output_example_zh:
      '## 人力规划 — 高管摘要（Q2）\n\n### 编制计划\n全球净增 **+120**，集中在 GTM（55）与研发（45），管理支持（20）增速较慢。\n\n### 关键技能缺口\n- 英国爱尔兰企业销售管理\n- 平台加固资深安全工程师\n\n### 风险\n- 招聘市场降温利于成本，但小众岗位填补时间拉长\n- 地域扩张需在 2 国审视本地化福利\n\n### 行动\n- 5 月启动 IC5+ 工程师内部流动计划\n- 批准 8 个外包岗应对实施高峰\n\n### DEI\n工程面试 URG 管道环比 +6 点；继续资助赞助计划',
  },
  {
    id: 'c-suite/chro/executive_team_assessment_brief',
    output_example_en:
      '## Executive team assessment — confidential brief (excerpt)\n\n### Overall\nLeadership team is **cohesive on strategy** with healthy debate; primary friction is prioritization between growth and reliability investments.\n\n### Strengths\n- CFO–CFO office partnership on capital discipline is strong\n- CMO bringing measurable demand gen rigor\n\n### Development areas\n- COO team needs clearer cross-functional decision rights on customer incidents\n- CHRO to accelerate manager training completion (currently 78%)\n\n### Succession notes\n- VP Sales bench is adequate; CFO succession requires 12-month development plan for FP&A leader\n\n### Recommendations\n- Institute monthly "trade-off forum" chaired by CEO with explicit decision log\n- Add executive team OKR on customer reliability shared across COO/CTO/CPO',
    output_example_zh:
      '## 高管团队评估 — 保密简报（节选）\n\n### 总体\n领导团队在战略上 **凝聚且辩论健康**；主要摩擦在增长与可靠性投资排序。\n\n### 优势\n- CFO 与财务办公室在资本纪律上协作强\n- CMO 带来可衡量的获客严谨度\n\n### 发展区\n- COO 线需在客户事件上明确跨职能决策权\n- CHRO 需加速经理培训完成率（现 78%）\n\n### 继任\n- 销售 VP 梯队尚可；CFO 继任需为 FP&A 负责人制定 12 月培养计划\n\n### 建议\n- 设 CEO 主持的月度「取舍论坛」+ 决策日志\n- 增加 COO/CTO/CPO 共享的客户可靠性高管 OKR',
  },
  {
    id: 'c-suite/chro/comp_committee_brief',
    output_example_en:
      '## Compensation committee brief — April cycle (excerpt)\n\n### Market movement\nTech talent market cooling; benchmark medians for engineering +2% vs prior cycle (down from +6%).\n\n### Proposed adjustments\n- **Merit budget:** 3.2% overall (within policy)\n- **Equity refresh:** concentrate on top 15% performers + retention risk list (42 employees)\n\n### Pay equity check\nStatistical analysis shows no systemic gender pay gap >2% in same job codes after controls; 6 individual outliers flagged for HRBP review\n\n### Committee asks\n- Approve exception for 2 critical hires above band (VP Sales EU, Principal SRE)\n- Approve equity pool utilization at 78% of authorized\n\n### Communications\nManagers receive talking points by Apr 25; employee letters Apr 30–May 2',
    output_example_zh:
      '## 薪酬委员会简报 — 4 月周期（节选）\n\n### 市场变化\n科技人才市场降温；工程基准中位较上周期 +2%（低于此前 +6%）。\n\n### 拟议调整\n- **调薪预算：** 整体 3.2%（在政策内）\n- **股权刷新：** 聚焦前 15% 绩效 + 留存风险名单（42 人）\n\n### 薪酬公平\n控制变量后同职级无系统性性别差距 >2%；6 个个体异常交 HRBP 复核\n\n### 委员会审批\n- 两例关键招聘超带宽例外（欧洲销售 VP、首席 SRE）\n- 批准股权池使用至授权的 78%\n\n### 沟通\n4/25 前经理话术；员工信 4/30–5/2',
  },
  {
    id: 'c-suite/cfo/earnings_call_talking_points',
    output_example_en:
      '## Earnings call talking points — Q1 FY26 (draft)\n\n### Opening frame\n"We delivered solid growth with improving efficiency while investing in reliability and compliance."\n\n### Revenue / ARR\n- ARR **$132M**, +24% YoY\n- NRR **119%**; expansion offset SMB churn pressure\n\n### Profitability\n- Non-GAAP operating margin **6%**, up 1.2 pts YoY\n\n### Guidance\n- Reaffirm FY ARR range; note FX headwind ~1.5 pts on EU revenue\n\n### Q&A anticipated\n- **Competition:** emphasize workflow depth + auditability vs suites\n- **Macro:** speak to collections performance and customer payment behavior\n\n### Guardrails\nAvoid quoting unreleased product dates; refer to "second half" roadmap themes only.',
    output_example_zh:
      '## 财报电话要点 — FY26 Q1（草案）\n\n### 开场框架\n「我们在提升效率的同时保持稳健增长，并持续投资可靠性与合规。」\n\n### 收入/ARR\n- ARR **1.32 亿**，同比 +24%\n- NRR **119%**；扩展抵消 SMB 流失压力\n\n### 盈利\n- 非 GAAP 营业利润率 **6%**，同比 +1.2 点\n\n### 指引\n- 维持全年 ARR 区间；提示欧元收入汇率逆风约 1.5 点\n\n### 预期问答\n- **竞争：** 强调工作流深度与可审计性 vs 套件\n- **宏观：** 谈回款与客户支付行为\n\n### 边界\n不引用未发布产品日期；路线图仅谈「下半年」主题。',
  },
  {
    id: 'c-suite/cfo/audit_committee_brief',
    output_example_en:
      '## Audit committee brief — Q1 close (excerpt)\n\n### Close quality\nClose completed on **T+6** with no material adjustments; 2 immaterial post-close items documented.\n\n### Internal controls\n- Revenue: control effectiveness **effective**; no exceptions\n- ITGC: 1 minor finding on access recert timing — remediation owner IT, due May 15\n\n### Fraud / whistleblower\nNo new substantiated matters; 2 tips closed after investigation\n\n### External auditor\nPlanning memo received; focus areas: revenue cut-off for enterprise renewals + capitalization policy for internal tools\n\n### Recommendations\n- Approve internal audit plan for Q2 (vendor risk + payroll)\n- Request monthly dashboard on access review completion rates',
    output_example_zh:
      '## 审计委员会简报 — Q1 关账（节选）\n\n### 关账质量\n**T+6** 完成关账；无重大调整；2 项非重大期后事项已记录。\n\n### 内控\n- 收入：控制运行 **有效**；无例外\n- ITGC：访问复核时效 1 项轻微发现 — IT 负责，5/15 前整改\n\n### 舞弊/举报\n无新坐实事项；2 条线索调查后关闭\n\n### 外审\n已收计划备忘录；关注企业续约截止 + 内部工具资本化政策\n\n### 建议\n- 批准 Q2 内审计划（供应商风险+薪酬）\n- 要求月度访问复核完成率看板',
  },
  {
    id: 'c-suite/ceo/ma_diligence_exec_summary',
    output_example_en:
      '## M&A diligence — Target: LogiSaaS (exec summary)\n\n### Strategic fit\nAdds EU mid-market density and complementary TMS integrations; accelerates cross-sell into existing finance workflows.\n\n### Financial snapshot (vendor-provided, unverified)\n- ARR $18M, growth 85% YoY, gross margin ~72%\n\n### Key risks\n- Customer concentration: top 10 = 48% revenue\n- Technical debt in monolith deployment path\n- GDPR subprocessors list incomplete\n\n### Synergy hypothesis (illustrative)\n$6–9M ARR uplift over 24 months via bundle + channel leverage (requires validation)\n\n### Recommended next steps\n- Confirm exclusivity / process timeline\n- Deep dive IT security + revenue quality (ACL analytics)\n- Social-style references with 6 customers\n\n### Decision ask\nApprove **Phase II diligence budget** ($450k) and core team time allocation for 4 weeks.',
    output_example_zh:
      '## 并购尽调 — 标的：LogiSaaS（高管摘要）\n\n### 战略契合\n增强欧洲中型市场密度并补齐 TMS 集成；向现有财务工作流交叉销售加速。\n\n### 财务快照（卖方提供，未验证）\n- ARR 1800 万，同比 +85%，毛利率约 72%\n\n### 主要风险\n- 客户集中：前十占收入 48%\n- 单体发布路径技术债\n- GDPR 子处理者清单不全\n\n### 协同假设（示意）\n捆绑+渠道 24 个月内 ARR 提升 600–900 万（待验证）\n\n### 建议下一步\n- 确认独家/流程时间表\n- IT 安全 + 收入质量深潜（ACL 分析）\n- 6 家客户背调式访谈\n\n### 决策诉求\n批准 **二期尽调预算**（45 万）及 4 周核心团队时间投入。',
  },
  {
    id: 'c-suite/ceo/all_hands_script',
    output_example_en:
      '## All-hands script — April 2026 (draft, 18 min)\n\n### Opening (2)\n"Thanks for joining. Three themes today: customer trust, disciplined growth, and how we win together."\n\n### Customer trust (5)\n- Shoutout to teams who shipped reliability improvements; checkout SLO strongest quarter yet\n- Reminder: security is everyone\'s job — report phish, protect secrets\n\n### Business momentum (6)\n- ARR milestone + what it means for investment in R&D\n- Clear-eyed note on competition: we win on depth + execution\n\n### People & culture (4)\n- Hybrid norms: default to documentation; respect focus time\n- Learning budget reminder\n\n### Close (1)\n"Questions? Post in #ask-leadership; we\'ll answer async by Friday."\n\n### Tone notes\nCandid, optimistic, no jargon; avoid promising personal comp details in this forum.',
    output_example_zh:
      '## 全员大会讲稿 — 2026 年 4 月（草案，18 分钟）\n\n### 开场（2）\n「感谢到场。今天三个主题：客户信任、有纪律的增长、以及如何一起赢。」\n\n### 客户信任（5）\n- 致敬可靠性改进团队；结账 SLO 创季度最佳\n- 提醒：安全人人有责 —— 报告钓鱼、保护密钥\n\n### 业务动能（6）\n- ARR 里程碑 + 对研发投资的含义\n- 清醒谈竞争：我们以深度与执行取胜\n\n### 人与文化（4）\n- 混合办公：默认写文档；尊重专注时间\n- 学习预算提醒\n\n### 收尾（1）\n「问题请发 #ask-leadership；周五前异步回复。」\n\n### 语气\n坦诚、乐观、少黑话；此场合不承诺个人薪酬细节。',
  },
];
