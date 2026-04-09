import { useMemo, useState } from "react";
import type { Recipe, Locale, CategoryNode } from "../types";
import { buildRecipeCategoryTree, label } from "../lib/categories";
import { t } from "../lib/i18n";

function CategoryItem({
  node,
  active,
  onSelect,
  depth,
}: {
  node: CategoryNode;
  active: string | null;
  onSelect: (p: string) => void;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const isActive = active === node.path;
  return (
    <li>
      <button
        type="button"
        onClick={() => {
          if (hasChildren) setExpanded((e) => !e);
          onSelect(node.path);
        }}
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

export default function RecipeBrowse({
  recipes,
  locale,
  base,
}: {
  recipes: Recipe[];
  locale: Locale;
  base: string;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tree = useMemo(() => buildRecipeCategoryTree(recipes, locale), [recipes, locale]);
  const total = recipes.length;

  const filtered = useMemo(() => {
    let list = recipes;
    if (category) list = list.filter((r) => r.category.startsWith(category));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => {
        const nm = locale === "zh" ? r.name_zh : r.name_en;
        const roles = locale === "zh" ? r.roles_zh : r.roles_en;
        return nm.toLowerCase().includes(q) || (roles ?? []).some((x) => x.toLowerCase().includes(q)) || r.id.toLowerCase().includes(q);
      });
    }
    return list;
  }, [recipes, category, search, locale]);

  const sidebar = (
    <nav className="flex h-full flex-col">
      <div className="px-3 pt-4 pb-2">
        <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">{t("recipeCategory", locale)}</p>
        <button
          type="button"
          onClick={() => {
            setCategory(null);
            setSidebarOpen(false);
          }}
          className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition ${category === null ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
        >
          {t("allRecipes", locale)}
          <span className="ml-auto text-xs text-gray-400">{total}</span>
        </button>
      </div>
      <ul className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {tree.map((node) => (
          <CategoryItem
            key={node.path}
            node={node}
            active={category}
            onSelect={(p) => {
              setCategory(p === category ? null : p);
              setSidebarOpen(false);
            }}
            depth={0}
          />
        ))}
      </ul>
    </nav>
  );

  return (
    <div className="flex flex-1">
      <aside className="hidden md:block w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">{sidebar}</aside>
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-xl dark:bg-gray-950 md:hidden">{sidebar}</aside>
        </>
      )}

      <div className="flex-1 p-4 md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <button type="button" className="md:hidden rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setSidebarOpen((o) => !o)}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx={11} cy={11} r={8} strokeWidth={2} />
              <path strokeLinecap="round" strokeWidth={2} d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchRecipes", locale)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-blue-500 dark:focus:ring-blue-900"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-20 text-center text-gray-400">{t("noRecipes", locale)}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => {
              const name = locale === "zh" ? r.name_zh : r.name_en;
              const roles = locale === "zh" ? r.roles_zh : r.roles_en;
              const skills = locale === "zh" ? r.skills_referenced_zh : r.skills_referenced_en;
              const wfs = locale === "zh" ? r.workflows_referenced_zh : r.workflows_referenced_en;
              const href = `${base}/${locale}/recipe/${r.id.replace("recipe/", "")}/`;
              const [layer, roleKey = ""] = r.category.split("/");
              const catLabel = roleKey ? `${label(layer, locale)} · ${label(roleKey, locale)}` : label(layer, locale);
              return (
                <a
                  key={r.id}
                  href={href}
                  className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
                >
                  <span className="mb-1 w-fit rounded-md bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-300">{catLabel}</span>
                  <h3 className="text-base font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400">{name}</h3>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(roles ?? []).map((role) => (
                      <span key={role} className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        {label(role.includes("/") ? role.split("/").pop()! : role, locale)}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(skills ?? []).slice(0, 4).map((s) => (
                      <span key={s} className="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {s}
                      </span>
                    ))}
                    {(skills ?? []).length > 4 && <span className="text-xs text-gray-400">+{(skills ?? []).length - 4}</span>}
                  </div>
                  {(wfs ?? []).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(wfs ?? []).map((w) => (
                        <span key={w} className="rounded bg-teal-50 px-1.5 py-0.5 text-xs text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                          {w}
                        </span>
                      ))}
                    </div>
                  )}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
