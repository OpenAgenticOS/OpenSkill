# Execution traces · 执行轨迹（可选）

此目录用于存放**脱敏后的**技能执行记录（YAML），便于分析与改进提示词。默认**不**存储模型原文输出，可用 `output_hash`（SHA-256）引用。

- Schema: [schema/trace.schema.json](../schema/trace.schema.json)
- 校验: `npm run validate` 会递归校验 `traces/**/*.yaml`（及 `.yml`）

贡献 trace 前请移除 PII，并确认符合组织合规要求。
