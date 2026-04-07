import { useState, useMemo } from "react";
import type { Skill, Locale, CategoryNode } from "../types";
import { buildCategoryTree, label } from "../lib/categories";
import { t } from "../lib/i18n";

const difficultyColor: Record<string, string> = {
  beginner: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  advanced: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

function CategoryItem({ node, active, onSelect, depth }: { node: CategoryNode; active: string | null; onSelect: (p: string) => void; depth: number }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const isActive = active === node.path;
  return (
    <li>
      <button
        onClick={() => { if (hasChildren) setExpanded((e) => !e); onSelect(node.path); }}
        className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm transition ${isActive ? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-950 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
        style={depth > 0 ? { paddingLeft: `${depth + 0.5}rem` } : undefined}
      >
        {hasChildren && (
          <svg className={`h-3 w-3 shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeWidth={2} d="m9 5 7 7-7 7" />
          </svg>
        )}
        <span className="truncate">{node.label}</span>
        <span className="ml-auto text-xs text-gray-400">{node.count}</span>
      </button>
      {hasChildren && expanded && (
        <ul className="space-y-0.5">{node.children.map((c) => <CategoryItem key={c.path} node={c} active={active} onSelect={onSelect} depth={depth + 1} />)}</ul>
      )}
    </li>
  );
}

export default function SearchableGrid({ skills, locale, base }: { skills: Skill[]; locale: Locale; base: string }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tree = useMemo(() => buildCategoryTree(skills, locale), [skills, locale]);
  const total = tree.reduce((n, c) => n + c.count, 0);

  const filtered = useMemo(() => {
    let list = skills;
    if (category) list = list.filter((s) => s.category.startsWith(category));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        s.persona.toLowerCase().includes(q) ||
        s.objective.toLowerCase().includes(q),
      );
    }
    return list;
  }, [skills, category, search]);

  const sidebar = (
    <nav className="flex h-full flex-col">
      <div className="px-3 pt-4 pb-2">
        <button
          onClick={() => { setCategory(null); setSidebarOpen(false); }}
          className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition ${category === null ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
        >
          {t("allSkills", locale)}
          <span className="ml-auto text-xs text-gray-400">{total}</span>
        </button>
      </div>
      <ul className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {tree.map((node) => (
          <CategoryItem key={node.path} node={node} active={category} onSelect={(p) => { setCategory(p === category ? null : p); setSidebarOpen(false); }} depth={0} />
        ))}
      </ul>
    </nav>
  );

  return (
    <div className="flex flex-1">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
        {sidebar}
      </aside>
      {/* Mobile drawer */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-xl dark:bg-gray-950 md:hidden">{sidebar}</aside>
        </>
      )}

      <div className="flex-1 p-4 md:p-6">
        {/* Search + mobile toggle */}
        <div className="mb-4 flex items-center gap-2">
          <button className="md:hidden rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setSidebarOpen((o) => !o)}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx={11} cy={11} r={8} strokeWidth={2} /><path strokeLinecap="round" strokeWidth={2} d="m21 21-4.35-4.35" />
            </svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("searchPlaceholder", locale)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-blue-500 dark:focus:ring-blue-900" />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-gray-400">{t("noResults", locale)}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => {
              const roleKey = s.category.split("/")[1] ?? s.category.split("/")[0];
              const href = `${base}/${locale}/skill/${s.id}/`;
              return (
                <a key={s.id} href={href}
                  className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400">{s.name}</h3>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColor[s.difficulty] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>{s.difficulty}</span>
                  </div>
                  <p className="mb-3 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{s.objective}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">{label(roleKey, locale)}</span>
                    {s.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">{tag}</span>
                    ))}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
