import { useMemo, useState } from "react";
import type { Workflow, Locale, CategoryNode } from "../types";
import { buildWorkflowDomainTree, workflowDomainLabel } from "../lib/categories";
import { t } from "../lib/i18n";

function DomainItem({
  node,
  active,
  onSelect,
}: {
  node: CategoryNode;
  active: string | null;
  onSelect: (p: string) => void;
}) {
  const isActive = active === node.path;
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(node.path)}
        className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm transition ${isActive ? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-950 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
      >
        <span className="truncate">{node.label}</span>
        <span className="ml-auto text-xs text-gray-400">{node.count}</span>
      </button>
    </li>
  );
}

export default function WorkflowBrowse({
  workflows,
  locale,
  base,
}: {
  workflows: Workflow[];
  locale: Locale;
  base: string;
}) {
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tree = useMemo(() => buildWorkflowDomainTree(workflows, locale), [workflows, locale]);
  const total = workflows.length;

  const filtered = useMemo(() => {
    let list = workflows;
    if (domain) list = list.filter((w) => w.category === domain);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((w) => {
        const nm = locale === "zh" ? w.name_zh : w.name_en;
        const tr = locale === "zh" ? (w.trigger_zh ?? "") : (w.trigger_en ?? "");
        return nm.toLowerCase().includes(q) || tr.toLowerCase().includes(q) || w.id.toLowerCase().includes(q);
      });
    }
    return list;
  }, [workflows, domain, search, locale]);

  const sidebar = (
    <nav className="flex h-full flex-col">
      <div className="px-3 pt-4 pb-2">
        <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">{t("processDomain", locale)}</p>
        <button
          type="button"
          onClick={() => {
            setDomain(null);
            setSidebarOpen(false);
          }}
          className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition ${domain === null ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
        >
          {t("allWorkflows", locale)}
          <span className="ml-auto text-xs text-gray-400">{total}</span>
        </button>
      </div>
      <ul className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {tree.map((node) => (
          <DomainItem
            key={node.path}
            node={node}
            active={domain}
            onSelect={(p) => {
              setDomain(p === domain ? null : p);
              setSidebarOpen(false);
            }}
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
              placeholder={t("searchWorkflows", locale)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-blue-500 dark:focus:ring-blue-900"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-20 text-center text-gray-400">{t("noWorkflows", locale)}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((wf) => {
              const name = locale === "zh" ? wf.name_zh : wf.name_en;
              const trigger = locale === "zh" ? wf.trigger_zh : wf.trigger_en;
              const steps = locale === "zh" ? wf.steps_zh : wf.steps_en;
              const href = `${base}/${locale}/workflow/${wf.id.replace("workflow/", "")}/`;
              return (
                <a
                  key={wf.id}
                  href={href}
                  className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
                >
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {workflowDomainLabel(wf.category, locale)}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400">{name}</h3>
                  {trigger && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{trigger}</p>}
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800">{wf.difficulty}</span>
                    <span>{wf.estimated_time}</span>
                    <span>
                      {steps.length} {t("steps", locale)}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {steps
                      .filter((s) => s.type === "skill")
                      .map((s) => (
                        <span key={s.id} className="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {s.skill_id}
                        </span>
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
