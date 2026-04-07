import { t } from "../lib/i18n";
import { label } from "../lib/categories";
import RichText from "./RichText";
import type { Skill, Locale } from "../types";

interface Props {
  skills: Skill[];
  locale: Locale;
  onSelect: (s: Skill) => void;
}

const difficultyColor: Record<string, string> = {
  beginner: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  advanced: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export default function SkillGrid({ skills, locale, onSelect }: Props) {
  if (skills.length === 0) {
    return (
      <p className="py-20 text-center text-gray-400">{t("noResults", locale)}</p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {skills.map((s) => {
        const parts = s.category.split("/");
        const roleKey = parts[1] ?? parts[0];
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {s.name}
              </h3>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColor[s.difficulty] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
              >
                {s.difficulty}
              </span>
            </div>

            <p className="mb-3 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
              <RichText text={s.objective} />
            </p>

            <div className="mt-auto flex flex-wrap gap-1.5">
              <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {label(roleKey, locale)}
              </span>
              {s.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
