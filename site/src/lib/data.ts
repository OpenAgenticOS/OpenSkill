import type {
  Skill, SkillBundle,
  Workflow, WorkflowBundle,
  Recipe, RecipeBundle,
  Locale,
} from "../types";
import enBundle from "../../public/openskill.en.json";
import zhBundle from "../../public/openskill.zh.json";
import wfBundle from "../../public/openskill.workflows.json";
import rcBundle from "../../public/openskill.recipes.json";

const bundles: Record<Locale, SkillBundle> = {
  en: enBundle as SkillBundle,
  zh: zhBundle as SkillBundle,
};

const workflows = (wfBundle as WorkflowBundle).workflows;
const recipes = (rcBundle as RecipeBundle).recipes;

export function getSkills(locale: Locale): Skill[] {
  return bundles[locale].skills;
}

export function getSkill(locale: Locale, id: string): Skill | undefined {
  return bundles[locale].skills.find((s) => s.id === id);
}

export function getAllSkillIds(locale: Locale): string[] {
  return bundles[locale].skills.map((s) => s.id);
}

export function getWorkflows(): Workflow[] {
  return workflows;
}

export function getWorkflow(id: string): Workflow | undefined {
  return workflows.find((w) => w.id === id);
}

export function getRecipes(): Recipe[] {
  return recipes;
}

export function getRecipe(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}
