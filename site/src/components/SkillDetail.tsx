import { t } from "../lib/i18n";
import CopyButton from "./CopyButton";
import RichText from "./RichText";
import type { Skill, Locale } from "../types";

interface Props {
  skill: Skill;
  locale: Locale;
  onBack: () => void;
}

function buildUserTemplate(skill: Skill): string {
  return skill.input_variables
    .map((v) => `${v.name}: {{${v.name}}}`)
    .join("\n");
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function SkillDetail({ skill, locale, onBack }: Props) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back + title */}
      <div>
        <button
          onClick={onBack}
          className="mb-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("backToList", locale)}
        </button>
        <h1 className="text-2xl font-bold">{skill.name}</h1>
        <div className="mt-2 flex flex-wrap gap-2">
          {skill.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs dark:bg-gray-800"
            >
              {tag}
            </span>
          ))}
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {skill.difficulty}
          </span>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs dark:bg-gray-800">
            {skill.estimated_time}
          </span>
        </div>
      </div>

      {/* COSTAR fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Section title={t("persona", locale)}>
          <p className="text-sm leading-relaxed"><RichText text={skill.persona} /></p>
        </Section>
        <Section title={t("objective", locale)}>
          <p className="text-sm leading-relaxed"><RichText text={skill.objective} /></p>
        </Section>
        <Section title={t("style", locale)}>
          <p className="text-sm"><RichText text={skill.style} /></p>
        </Section>
        <Section title={t("tone", locale)}>
          <p className="text-sm"><RichText text={skill.tone} /></p>
        </Section>
        <Section title={t("audience", locale)}>
          <p className="text-sm"><RichText text={skill.audience} /></p>
        </Section>
        <Section title={t("outputFormat", locale)}>
          <p className="text-sm"><RichText text={skill.output_format} /></p>
        </Section>
      </div>

      {/* System prompt */}
      <Section title={t("systemPrompt", locale)}>
        <div className="relative">
          <pre className="max-h-80 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm whitespace-pre-wrap dark:border-gray-700 dark:bg-gray-900">
            {skill.system_prompt}
          </pre>
          <div className="mt-2">
            <CopyButton
              text={skill.system_prompt}
              label={t("copySystemPrompt", locale)}
              locale={locale}
            />
          </div>
        </div>
      </Section>

      {/* Input variables */}
      <Section title={t("inputVariables", locale)}>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-3 py-2 text-left font-medium">{t("variable", locale)}</th>
                <th className="px-3 py-2 text-left font-medium">{t("description", locale)}</th>
                <th className="px-3 py-2 text-left font-medium">{t("example", locale)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {skill.input_variables.map((v) => (
                <tr key={v.name}>
                  <td className="px-3 py-2 font-mono text-xs">
                    {v.name}
                    <span
                      className={`ml-1.5 text-[10px] font-medium ${v.required ? "text-red-500" : "text-gray-400"}`}
                    >
                      {v.required ? t("required", locale) : t("optional", locale)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{v.description}</td>
                  <td className="px-3 py-2 text-gray-500 italic">{v.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2">
          <CopyButton
            text={buildUserTemplate(skill)}
            label={t("copyUserTemplate", locale)}
            locale={locale}
          />
        </div>
      </Section>

      {/* Compatible models */}
      <Section title={t("compatibleModels", locale)}>
        <div className="flex flex-wrap gap-2">
          {skill.compatible_models.map((m) => (
            <span
              key={m}
              className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs dark:border-gray-700"
            >
              {m}
            </span>
          ))}
        </div>
      </Section>
    </div>
  );
}
