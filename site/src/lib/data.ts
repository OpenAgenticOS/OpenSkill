import type { Skill, SkillBundle, Locale } from "../types";
import enBundle from "../../public/openskill.en.json";
import zhBundle from "../../public/openskill.zh.json";

const bundles: Record<Locale, SkillBundle> = {
  en: enBundle as SkillBundle,
  zh: zhBundle as SkillBundle,
};

export function getSkills(locale: Locale): Skill[] {
  return bundles[locale].skills;
}

export function getSkill(locale: Locale, id: string): Skill | undefined {
  return bundles[locale].skills.find((s) => s.id === id);
}

export function getAllSkillIds(locale: Locale): string[] {
  return bundles[locale].skills.map((s) => s.id);
}
