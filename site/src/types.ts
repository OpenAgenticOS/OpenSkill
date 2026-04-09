export interface InputVariable {
  name: string;
  description: string;
  required: boolean;
  example: string;
}

export interface RubricDimension {
  dimension: string;
  weight: number;
  criteria_5: string;
  criteria_3: string;
  criteria_1: string;
}

export interface ComposableLink {
  skill_id: string;
  relationship: string;
  data_mapping: string;
}

export interface Enhancer {
  type: string;
  name: string;
  description: string;
  protocol: string;
  optional: boolean;
}

export interface RelatedSkill {
  name: string;
  id: string;
}

export interface Skill {
  id: string;
  name: string;
  version: string;
  category: string;
  tags: string[];
  locale: string;
  input_variables: InputVariable[];
  compatible_models: string[];
  language: string;
  difficulty: string;
  estimated_time: string;
  author: string;
  created_at: string;
  mcp_tool_name: string;
  source_path: string;
  persona: string;
  objective: string;
  style: string;
  tone: string;
  audience: string;
  output_format: string;
  system_prompt: string;
  user_prompt_template: string;
  output_example: string;
  related_skills: RelatedSkill[];
  status?: string;
  evaluation_rubric?: RubricDimension[];
  composable_with?: ComposableLink[];
  enhancers?: Enhancer[];
  competence_profile?: Record<string, unknown>;
  model_benchmarks?: Record<string, unknown>[];
  execution_profile?: Record<string, unknown>;
}

export interface SkillBundle {
  format_version: number;
  generated_at: string;
  skills_count: number;
  locale: string;
  skills: Skill[];
}

export type Locale = "en" | "zh";

export interface CategoryNode {
  label: string;
  path: string;
  count: number;
  children: CategoryNode[];
}

export interface WorkflowStep {
  id: string;
  type: string;
  skill_id?: string;
  input_mapping?: Record<string, string>;
  output?: string;
  description?: string;
}

export interface Workflow {
  id: string;
  category: string;
  version: string;
  difficulty: string;
  estimated_time_zh: string;
  estimated_time_en: string;
  trigger_zh?: string;
  trigger_en?: string;
  locales: string[];
  name_zh: string;
  name_en: string;
  steps_zh: WorkflowStep[];
  steps_en: WorkflowStep[];
}

export interface WorkflowBundle {
  format_version: number;
  generated_at: string;
  workflows_count: number;
  workflows: Workflow[];
}

export interface Recipe {
  id: string;
  category: string;
  version: string;
  locales: string[];
  name_zh: string;
  name_en: string;
  roles_zh: string[];
  roles_en: string[];
  skills_referenced_zh: string[];
  skills_referenced_en: string[];
  workflows_referenced_zh: string[];
  workflows_referenced_en: string[];
  source_path_zh: string;
  source_path_en: string;
  body_md_zh: string;
  body_md_en: string;
  author: string;
  created_at: string;
}

export interface RecipeBundle {
  format_version: number;
  generated_at: string;
  recipes_count: number;
  recipes: Recipe[];
}
