import type { Skill, Recipe, CategoryNode, Locale } from "../types";

const LABELS_EN: Record<string, string> = {
  "c-suite": "C-Suite",
  management: "Management",
  "individual-contributor": "Individual Contributor",
  "cross-functional": "Cross-functional",
  ceo: "CEO", cto: "CTO", cfo: "CFO", coo: "COO", cmo: "CMO", chro: "CHRO",
  "engineering-manager": "Engineering Manager",
  "product-manager": "Product Manager",
  "hr-manager": "HR Manager",
  "sales-manager": "Sales Manager",
  "operations-manager": "Operations Manager",
  "finance-manager": "Finance Manager",
  "marketing-manager": "Marketing Manager",
  "software-engineer": "Software Engineer",
  "data-analyst": "Data Analyst",
  "data-scientist": "Data Scientist",
  designer: "Designer", marketing: "Marketing", "sales-rep": "Sales Rep",
  "customer-success": "Customer Success",
  legal: "Legal", finance: "Finance", devops: "DevOps", security: "Security",
};

const LABELS_ZH: Record<string, string> = {
  "c-suite": "高管层",
  management: "管理层",
  "individual-contributor": "执行层",
  "cross-functional": "跨职能",
  ceo: "CEO", cto: "CTO", cfo: "CFO", coo: "COO", cmo: "CMO", chro: "CHRO",
  "engineering-manager": "工程经理",
  "product-manager": "产品经理",
  "hr-manager": "人力经理",
  "sales-manager": "销售经理",
  "operations-manager": "运营经理",
  "finance-manager": "财务经理",
  "marketing-manager": "营销经理",
  "software-engineer": "软件工程师",
  "data-analyst": "数据分析师",
  "data-scientist": "数据科学家",
  designer: "设计师", marketing: "市场营销", "sales-rep": "销售代表",
  "customer-success": "客户成功",
  legal: "法务", finance: "财务", devops: "DevOps", security: "安全",
};

export function label(key: string, locale: Locale): string {
  return (locale === "zh" ? LABELS_ZH : LABELS_EN)[key] ?? key;
}

const LAYER_ORDER = ["c-suite", "management", "individual-contributor", "cross-functional"];

export function buildCategoryTree(skills: Skill[], locale: Locale): CategoryNode[] {
  const map = new Map<string, Map<string, number>>();
  for (const s of skills) {
    const [layer, role = ""] = s.category.split("/");
    if (!map.has(layer)) map.set(layer, new Map());
    const roles = map.get(layer)!;
    roles.set(role, (roles.get(role) ?? 0) + 1);
  }
  return LAYER_ORDER.filter((l) => map.has(l)).map((layer) => {
    const roles = map.get(layer)!;
    const children: CategoryNode[] = [];
    let total = 0;
    for (const [role, count] of roles) {
      total += count;
      if (role) children.push({ label: label(role, locale), path: `${layer}/${role}`, count, children: [] });
    }
    return { label: label(layer, locale), path: layer, count: total, children };
  });
}

/** Process domains for workflows (enterprise function taxonomy). */
export const WORKFLOW_DOMAIN_ORDER = [
  "strategy-planning",
  "product-delivery",
  "engineering-ops",
  "people-collaboration",
  "go-to-market",
  "finance-governance",
  "operations",
] as const;

const WORKFLOW_DOMAIN_EN: Record<string, string> = {
  "strategy-planning": "Strategy & planning",
  "product-delivery": "Product delivery",
  "engineering-ops": "Engineering & operations",
  "people-collaboration": "People & collaboration",
  "go-to-market": "Go-to-market",
  "finance-governance": "Finance & governance",
  operations: "Operations",
};

const WORKFLOW_DOMAIN_ZH: Record<string, string> = {
  "strategy-planning": "战略与规划",
  "product-delivery": "产品交付",
  "engineering-ops": "工程与运维",
  "people-collaboration": "人员与协作",
  "go-to-market": "市场与销售",
  "finance-governance": "财务与治理",
  operations: "运营",
};

export function workflowDomainLabel(domain: string, locale: Locale): string {
  return (locale === "zh" ? WORKFLOW_DOMAIN_ZH : WORKFLOW_DOMAIN_EN)[domain] ?? domain;
}

/** Sidebar nodes for workflow list: one entry per domain that has workflows. */
export function buildWorkflowDomainTree(
  workflows: { category: string }[],
  locale: Locale,
): CategoryNode[] {
  const counts = new Map<string, number>();
  for (const w of workflows) {
    counts.set(w.category, (counts.get(w.category) ?? 0) + 1);
  }
  return WORKFLOW_DOMAIN_ORDER.filter((d) => (counts.get(d) ?? 0) > 0).map((d) => ({
    label: workflowDomainLabel(d, locale),
    path: d,
    count: counts.get(d) ?? 0,
    children: [],
  }));
}

/** Same layer/role tree as skills, built from recipe.category. */
export function buildRecipeCategoryTree(recipes: Recipe[], locale: Locale): CategoryNode[] {
  const map = new Map<string, Map<string, number>>();
  for (const r of recipes) {
    const [layer, role = ""] = r.category.split("/");
    if (!map.has(layer)) map.set(layer, new Map());
    const roles = map.get(layer)!;
    roles.set(role, (roles.get(role) ?? 0) + 1);
  }
  return LAYER_ORDER.filter((l) => map.has(l)).map((layer) => {
    const roles = map.get(layer)!;
    const children: CategoryNode[] = [];
    let total = 0;
    for (const [role, count] of roles) {
      total += count;
      if (role) children.push({ label: label(role, locale), path: `${layer}/${role}`, count, children: [] });
    }
    return { label: label(layer, locale), path: layer, count: total, children };
  });
}
