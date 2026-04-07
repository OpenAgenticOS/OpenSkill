import type { Skill, CategoryNode, Locale } from "../types";

const LABELS_EN: Record<string, string> = {
  "c-suite": "C-Suite",
  management: "Management",
  "individual-contributor": "Individual Contributor",
  "cross-functional": "Cross-functional",
  ceo: "CEO",
  cto: "CTO",
  cfo: "CFO",
  coo: "COO",
  cmo: "CMO",
  chro: "CHRO",
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
  designer: "Designer",
  marketing: "Marketing",
  "sales-rep": "Sales Rep",
  "customer-success": "Customer Success",
  legal: "Legal",
  finance: "Finance",
  devops: "DevOps",
  security: "Security",
};

const LABELS_ZH: Record<string, string> = {
  "c-suite": "高管层",
  management: "管理层",
  "individual-contributor": "执行层",
  "cross-functional": "跨职能",
  ceo: "CEO",
  cto: "CTO",
  cfo: "CFO",
  coo: "COO",
  cmo: "CMO",
  chro: "CHRO",
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
  designer: "设计师",
  marketing: "市场营销",
  "sales-rep": "销售代表",
  "customer-success": "客户成功",
  legal: "法务",
  finance: "财务",
  devops: "DevOps",
  security: "安全",
};

export function label(key: string, locale: Locale): string {
  const map = locale === "zh" ? LABELS_ZH : LABELS_EN;
  return map[key] ?? key;
}

const LAYER_ORDER = [
  "c-suite",
  "management",
  "individual-contributor",
  "cross-functional",
];

export function buildCategoryTree(
  skills: Skill[],
  locale: Locale,
): CategoryNode[] {
  const map = new Map<string, Map<string, number>>();

  for (const s of skills) {
    const parts = s.category.split("/");
    const layer = parts[0];
    const role = parts[1] ?? "";
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
      if (role) {
        children.push({
          label: label(role, locale),
          path: `${layer}/${role}`,
          count,
          children: [],
        });
      }
    }
    return {
      label: label(layer, locale),
      path: layer,
      count: total,
      children,
    };
  });
}
