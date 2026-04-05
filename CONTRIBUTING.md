# 贡献者公约 · Contributor Covenant

## 我们的承诺 · Our Pledge

OpenSkill 是一个人人可参与的社区项目。无论你是 CEO、工程师、应届生还是转行者，
只要你有在某个岗位使用 AI 的实际经验，你的贡献就有价值。

OpenSkill is a community project where everyone can participate. Whether you're a CEO, engineer, new grad, or career changer,
if you have real experience using AI in any role, your contribution is valuable.

---

## 贡献方式 · Ways to Contribute

### 🌟 方式一：提交新技能（最受欢迎！）

不需要是技术专家，只需要：
1. 有某个岗位的实际工作经验
2. 发现 AI 在某个具体任务上表现很好

**步骤 · Steps:**

1. **查看是否已有类似技能** — 搜索 [`skills/`](./skills/) 目录或用 [GitHub 搜索](https://github.com/search)
2. **使用模板创建文件** — 复制 [`SKILL_SCHEMA.md`](./SKILL_SCHEMA.md) 中的最简模板
3. **放到正确目录** — 参考分类体系 `skills/{层级}/{岗位}/`
4. **提交 PR** — PR 标题格式：`[New Skill] 岗位/技能名`
5. **等待评审** — 维护者会在 72 小时内回复

> **不会 Git？** 直接在 GitHub 网页上点击 [Create new file](https://github.com/openskill-ai/openskill/new/main) 也可以！

---

### 🔧 方式二：完善现有技能

发现某个技能的输出不够好？有更好的提示词写法？
- 直接编辑文件并提交 PR
- 在 PR 描述中说明改动原因和改进后的效果

---

### 💬 方式三：评测与反馈

不写代码也能贡献！
- 测试某个技能，在 Issue 中分享实测效果（截图 + 评分）
- 在已有技能的 Issue 区留下你的使用体验

---

### 🏷️ 方式四：提 Issue

- 建议新岗位或新技能：使用 [新技能请求模板](.github/ISSUE_TEMPLATE/new_skill_request.md)
- 报告技能质量问题：使用 [技能改进建议模板](.github/ISSUE_TEMPLATE/skill_improvement.md)

---

## 技能质量标准 · Skill Quality Standards

你的 PR 将根据以下标准评审：

| 标准 | 说明 |
|------|------|
| ✅ **原子性** | 一个 Skill 只做一件事 |
| ✅ **双语** | 中英文并行（允许机翻后校对） |
| ✅ **有输出示例** | 至少一个真实的好输出 |
| ✅ **有验收标准** | 用户如何判断输出好不好 |
| ✅ **格式正确** | 通过 Schema 自动校验 |

**不要求**：学术完美、全覆盖所有变体、特定模型支持

---

## PR 流程 · PR Process

```
你的 PR → CI 自动 Schema 校验 → Maintainer 审核 → 合并 🎉
```

- **Schema 校验**：必须通过（自动）
- **人工审核**：72 小时内，Reviewer 会留下建议
- **合并标准**：2 位 Reviewer 批准

---

## 本地开发（可选）· Local Development (Optional)

如果你想在提交前本地校验格式：

```bash
# 安装依赖
npm install

# 校验所有 Skill 文件
npm run validate

# 校验单个文件
npm run validate skills/c-suite/ceo/strategic_vision.skill.md
```

---

## 行为准则 · Code of Conduct

- 对所有贡献者保持尊重，不管经验水平
- 批评的是技能质量，不是贡献者本人
- 鼓励「先合并，后优化」—— 不完美的贡献也是贡献
- 使用 AI 生成的内容请标注，并确保经过人工验证

---

## 致谢 · Recognition

每位贡献者都会被列在 [CONTRIBUTORS.md](./CONTRIBUTORS.md) 中，
并在对应的技能文件中标注 `author` 字段。

贡献超过 5 个技能将获得 🏆 **Core Contributor** 徽章。

---

感谢你让 OpenSkill 变得更好！🙏
Thank you for making OpenSkill better! 🙏
