export interface InputVariable {
  name: string;
  description: string;
  required: boolean;
  example: string;
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
