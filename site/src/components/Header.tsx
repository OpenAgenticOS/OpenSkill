import { t } from "../lib/i18n";
import type { Locale } from "../types";

interface Props {
  locale: Locale;
  onLocaleChange: (l: Locale) => void;
  search: string;
  onSearchChange: (v: string) => void;
  onToggleSidebar: () => void;
}

export default function Header({
  locale,
  onLocaleChange,
  search,
  onSearchChange,
  onToggleSidebar,
}: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <button
          className="md:hidden rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <a href="#" className="flex items-center gap-2 shrink-0">
          <span className="text-xl">🧠</span>
          <span className="text-lg font-bold tracking-tight">{t("title", locale)}</span>
        </a>

        <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400">
          {t("subtitle", locale)}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <svg
              className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx={11} cy={11} r={8} strokeWidth={2} />
              <path strokeLinecap="round" strokeWidth={2} d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("searchPlaceholder", locale)}
              className="w-40 rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-blue-500 dark:focus:ring-blue-900 sm:w-56"
            />
          </div>

          <div className="flex rounded-lg border border-gray-200 text-sm dark:border-gray-700">
            <button
              onClick={() => onLocaleChange("en")}
              className={`px-2.5 py-1 rounded-l-lg transition ${locale === "en" ? "bg-blue-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >
              EN
            </button>
            <button
              onClick={() => onLocaleChange("zh")}
              className={`px-2.5 py-1 rounded-r-lg transition ${locale === "zh" ? "bg-blue-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >
              中文
            </button>
          </div>

          <a
            href="https://github.com/OpenAgenticOS/OpenSkill"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:block rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="GitHub"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .5C5.37.5 0 5.78 0 12.292c0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.333-1.723-1.333-1.723-1.089-.73.083-.716.083-.716 1.205.083 1.838 1.215 1.838 1.215 1.07 1.802 2.807 1.281 3.492.98.108-.763.418-1.282.762-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.228-3.164-.123-.297-.532-1.497.117-3.12 0 0 1.001-.315 3.28 1.209a11.49 11.49 0 0 1 3-.396 11.49 11.49 0 0 1 3 .396c2.278-1.524 3.276-1.209 3.276-1.209.652 1.623.243 2.823.12 3.12.765.825 1.226 1.877 1.226 3.164 0 4.53-2.805 5.528-5.475 5.818.43.364.814 1.084.814 2.184 0 1.576-.014 2.846-.014 3.232 0 .316.216.684.825.568C20.565 21.917 24 17.5 24 12.292 24 5.78 18.627.5 12 .5Z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
