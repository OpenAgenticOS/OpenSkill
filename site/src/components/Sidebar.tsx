import { useState } from "react";
import { t } from "../lib/i18n";
import type { CategoryNode, Locale } from "../types";

interface Props {
  tree: CategoryNode[];
  locale: Locale;
  active: string | null;
  onSelect: (path: string | null) => void;
  open: boolean;
  onClose: () => void;
}

function CategoryItem({
  node,
  active,
  onSelect,
  depth,
}: {
  node: CategoryNode;
  active: string | null;
  onSelect: (path: string) => void;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const isActive = active === node.path;

  return (
    <li>
      <button
        onClick={() => {
          if (hasChildren) setExpanded((e) => !e);
          onSelect(node.path);
        }}
        className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm transition
          ${isActive ? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-950 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-800"}
          ${depth > 0 ? "pl-" + (depth * 4 + 2) : ""}`}
        style={depth > 0 ? { paddingLeft: `${depth * 1 + 0.5}rem` } : undefined}
      >
        {hasChildren && (
          <svg
            className={`h-3 w-3 shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeWidth={2} d="m9 5 7 7-7 7" />
          </svg>
        )}
        <span className="truncate">{node.label}</span>
        <span className="ml-auto text-xs text-gray-400">{node.count}</span>
      </button>
      {hasChildren && expanded && (
        <ul className="space-y-0.5">
          {node.children.map((child) => (
            <CategoryItem
              key={child.path}
              node={child}
              active={active}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Sidebar({
  tree,
  locale,
  active,
  onSelect,
  open,
  onClose,
}: Props) {
  const total = tree.reduce((n, c) => n + c.count, 0);

  const inner = (
    <nav className="flex h-full flex-col">
      <div className="px-3 pt-4 pb-2">
        <button
          onClick={() => onSelect(null)}
          className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition
            ${active === null ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          {t("allSkills", locale)}
          <span className="ml-auto text-xs text-gray-400">{total}</span>
        </button>
      </div>
      <ul className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {tree.map((node) => (
          <CategoryItem
            key={node.path}
            node={node}
            active={active}
            onSelect={onSelect}
            depth={0}
          />
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
        {inner}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={onClose}
          />
          <aside className="fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-xl dark:bg-gray-950 md:hidden">
            {inner}
          </aside>
        </>
      )}
    </>
  );
}
