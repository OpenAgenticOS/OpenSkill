import { useState, useEffect } from "react";
import type { Skill, SkillBundle, Locale } from "../types";

const cache: Record<string, Skill[]> = {};

export function useSkills(locale: Locale) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cache[locale]) {
      setSkills(cache[locale]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const file = locale === "zh" ? "openskill.zh.json" : "openskill.en.json";
    fetch(`${import.meta.env.BASE_URL}${file}`)
      .then((r) => r.json() as Promise<SkillBundle>)
      .then((bundle) => {
        cache[locale] = bundle.skills;
        setSkills(bundle.skills);
      })
      .finally(() => setLoading(false));
  }, [locale]);

  return { skills, loading };
}
